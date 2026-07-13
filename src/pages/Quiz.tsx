import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import LoadingState from '../components/LoadingState';
import { updateOverallProgress } from '../lib/updateProgress';
import { motion, AnimatePresence } from 'motion/react';
import { useGemini } from '../hooks/useGemini';

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const appId = location.state?.appId;
  const appName = location.state?.appName || 'Role';

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionScores, setSessionScores] = useState<number[]>([]);
  const [sessionResults, setSessionResults] = useState<{ topic: string, score: number }[]>([]);

  // AI evaluation state
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiResult, setAiResult] = useState<{ score: number; feedback: string } | null>(null);
  // When aiResult is null the result panel is hidden and the user can still type;
  // when it is populated the result panel replaces the textarea.

  // Fallback: if Gemini fails the user can self-rate instead of being blocked
  const [showFallback, setShowFallback] = useState(false);

  const { evaluateAnswer } = useGemini();

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const sessionResultsRef = useRef(sessionResults);
  const hasSavedRef = useRef(false);
  // Prevents double-fire on "Next Question" and fallback rating buttons
  // while handleRateConfidence awaits the Firestore updateDoc.
  const isAdvancingRef = useRef(false);
  // Mirrors aiResult state and questions[currentIndex] so the stale [] cleanup
  // closure can read the current values at unmount time without React state access.
  const aiResultRef = useRef<{ score: number; feedback: string } | null>(null);
  const currentQuestionRef = useRef<any>(null);

  // Sync refs so the cleanup function has access to the latest values
  useEffect(() => {
    sessionResultsRef.current = sessionResults;
  }, [sessionResults]);

  useEffect(() => {
    if (questions.length > 0) {
      currentQuestionRef.current = questions[currentIndex];
    }
  }, [currentIndex, questions]);

  useEffect(() => {
    (window as any).quizActiveCount = ((window as any).quizActiveCount || 0) + 1;
    (window as any).isQuizActive = true;
    return () => {
      (window as any).quizActiveCount = Math.max(0, ((window as any).quizActiveCount || 0) - 1);
      if ((window as any).quizActiveCount === 0) {
        (window as any).isQuizActive = false;
      }
      // Save session results on unmount if we haven't saved already
      if (!hasSavedRef.current) {
        const pendingResult = aiResultRef.current;
        const pendingQ     = currentQuestionRef.current;

        // Auto-commit a pending AI result if the user navigated away while
        // the result panel was visible but "Next Question" was never clicked.
        // If Gemini was still in-flight (isEvaluating), pendingResult is null
        // and this block is correctly skipped — you can't commit a score that
        // hasn't arrived yet.
        if (pendingResult && pendingQ && user && appId) {
          const prevCount = pendingQ.timesAnswered ?? 0;
          const prevAvg   = pendingQ.averageConfidence ?? 0;
          const newCount  = prevCount + 1;
          const newAvg    = parseFloat(((prevAvg * prevCount + pendingResult.score) / newCount).toFixed(2));

          // Fire-and-forget: Firestore's local write visibility guarantees this
          // write is seen by updateOverallProgress's getDocs on the same client.
          // SM-2 fields are intentionally omitted — they'll be recalculated
          // correctly on the next normal session for this question.
          updateDoc(
            doc(db, 'users', user.uid, 'jobApplications', appId, 'questions', pendingQ.id),
            { timesAnswered: increment(1), lastConfidence: pendingResult.score, averageConfidence: newAvg }
          ).catch(err => console.warn('Cleanup: failed to write pending question confidence:', err));

          // Append to results so handleEndSession includes it in topicScores and session history
          sessionResultsRef.current = [
            ...sessionResultsRef.current,
            { topic: pendingQ.topic || 'General Specs', score: pendingResult.score }
          ];
        }

        handleEndSession(sessionResultsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!user || !appId) {
      navigate('/dashboard/quiz');
      return;
    }
    const questionsRef = collection(db, 'users', user.uid, 'jobApplications', appId, 'questions');
    getDocs(questionsRef).then((snapshot) => {
      const qList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      // SM-2: Sort by nextReviewDate ascending (treating undefined as 0 so unreviewed are prioritized)
      qList.sort((a, b) => {
        const dateA = a.nextReviewDate || 0;
        const dateB = b.nextReviewDate || 0;
        return dateA - dateB;
      });

      // Limit session to top 15 most due questions to prevent burnout
      setQuestions(qList.slice(0, 15));
      setLoading(false);
    });
  }, [appId, user, navigate]);

  const handleEndSession = async (results: { topic: string, score: number }[]) => {
    if (!user || !appId || results.length === 0 || hasSavedRef.current) return;
    hasSavedRef.current = true;

    try {
      const avgScore = results.reduce((a, b) => a + b.score, 0) / results.length;

      // 1. Save Session History
      const sessionRef = doc(collection(db, 'users', user.uid, 'jobApplications', appId, 'quizSessions'));
      setDoc(sessionRef, {
        date: Date.now(),
        averageScore: parseFloat(avgScore.toFixed(2)),
        questionsAnswered: results.length,
        appName: appName
      }).catch((err: any) => console.warn('Failed to save session history:', err));

      // 2. Atomic Update for topicScores (Supports Offline & No Race Conditions)
      const appDocRef = doc(db, 'users', user.uid, 'jobApplications', appId);

      const updates: Record<string, any> = {};
      results.forEach(result => {
        // Using increment() handles initialization if the topic doesn't exist yet
        updates[`topicScores.${result.topic}.sum`] = increment(result.score);
        updates[`topicScores.${result.topic}.count`] = increment(1);
      });

      updateDoc(appDocRef, updates).catch(err =>
        console.warn('Failed to update topic scores (will queue if offline):', err)
      );

      // 3. Update overall progress
      updateOverallProgress(user.uid, appId).catch((err: any) =>
        console.warn('Progress update failed silently:', err)
      );
    } catch (error) {
      console.error('Error during end session cleanup:', error);
    }
  };

  const handleRateConfidence = async (score: number) => {
    if (!user || !appId) return;
    const currentQ = questions[currentIndex];

    const newSessionScores = [...sessionScores, score];
    setSessionScores(newSessionScores);

    const newSessionResults = [...sessionResults, { topic: currentQ.topic || 'General Specs', score }];
    setSessionResults(newSessionResults);
    // Sync immediately — don't wait for the useEffect to run after React commits.
    // Prevents a same-tick navigation from catching a stale ref.
    sessionResultsRef.current = newSessionResults;

    // Read the previous stored values to compute a true running average.
    // timesAnswered is already stored on the doc; we increment it atomically,
    // so we compute the new average from the OLD count before the increment.
    const prevCount = currentQ.timesAnswered ?? 0;
    const prevAvg = currentQ.averageConfidence ?? 0;
    const newCount = prevCount + 1;
    const newAvg = parseFloat(((prevAvg * prevCount + score) / newCount).toFixed(2));

    // SM-2 Algorithm Implementation
    const q = score; // 1-5 scale (maps well to SM-2's 0-5 quality scale where >=3 is a success)
    let easinessFactor = currentQ.easinessFactor || 2.5;
    let repetitions = currentQ.repetitions || 0;
    let interval = currentQ.interval || 0;

    if (q >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easinessFactor);
      }
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    easinessFactor = easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easinessFactor < 1.3) easinessFactor = 1.3;

    const nextReviewDate = Date.now() + (interval * 24 * 60 * 60 * 1000);

    const docRef = doc(db, 'users', user.uid, 'jobApplications', appId, 'questions', currentQ.id);
    await updateDoc(docRef, {
      timesAnswered: increment(1),
      lastConfidence: score,
      averageConfidence: newAvg,
      easinessFactor,
      repetitions,
      interval,
      nextReviewDate
    });

    // Reset per-question AI state before advancing so the next question starts clean
    isAdvancingRef.current = false;
    setUserAnswer('');
    setAiResult(null);
    aiResultRef.current = null; // sync immediately so the cleanup sees a clean state
    setIsEvaluating(false);
    setShowFallback(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Recompute progress before marking session complete so the dashboard
      // reflects the updated state as soon as the user navigates back.
      handleEndSession(newSessionResults);
      setSessionCompleted(true);
      (window as any).isQuizActive = false;
      (window as any).quizActiveCount = 0;
      setTimeout(() => {
        navigate('/dashboard/quiz', { state: { preSelectedAppId: appId } });
      }, 2500);
    }
  };

  const confirmExitSession = () => {
    setIsExitModalOpen(false);
    (window as any).isQuizActive = false;
    (window as any).quizActiveCount = 0;
    handleEndSession(sessionResults);
    navigate('/dashboard/quiz', { state: { preSelectedAppId: appId } });
  };

  if (loading) return <LoadingState message="Loading questions..." />;
  if (questions.length === 0) return <div className="text-center p-12">No questions found for this role.</div>;

  if (sessionCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="max-w-md mx-auto py-24 text-center space-y-4 px-4"
      >
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm border border-emerald-100 dark:border-emerald-800">
          ✓
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Quiz Complete!</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          Your AI-evaluated scores have been saved. Head to Weak Spots to see your updated gap analysis.
        </p>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto py-4 relative">
      <div className="flex justify-between items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium min-w-0">
        <span className="truncate min-w-0">
          Session Track: <strong className="text-slate-700 dark:text-slate-200">{appName}</strong>
        </span>
        <button
          onClick={() => setIsExitModalOpen(true)}
          className="text-red-500 hover:text-red-700 font-bold uppercase tracking-wider text-[10px] transition bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-800/40 px-2.5 py-1 rounded-md border border-red-200/40 dark:border-red-800/40 shrink-0"
        >
          🛑 End Session
        </button>
      </div>

      <div className="flex justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-1">
        <span>Progress</span>
        <span>Question {currentIndex + 1} of {questions.length}</span>
      </div>

      {/* Animated progress bar */}
      <div className="w-full bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full mb-8 overflow-hidden shadow-inner">
        <motion.div
          className="bg-[#6366F1] h-1.5 rounded-full"
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          transition={{ type: 'spring', damping: 25, stiffness: 80 }}
        />
      </div>

      {/* Animated question card — keyed by currentIndex for AnimatePresence transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-8 min-h-[340px] flex flex-col justify-between"
        >
          <div>
            <div className="flex gap-2 mb-4">
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-indigo-100/40 dark:border-indigo-800">
                {currentQuestion.topic}
              </span>
              <span className="text-[10px] bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-amber-100/40 dark:border-amber-800">
                {currentQuestion.difficulty}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug mb-6">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 space-y-3">
            <AnimatePresence mode="wait">
              {/* ── Phase 1: textarea + submit ──────────────────────────────── */}
              {!aiResult && !isEvaluating && !showFallback && (
                <motion.div
                  key="input-phase"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Your Answer
                  </label>
                  <textarea
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    rows={4}
                    maxLength={2000}
                    placeholder="Type your answer here…"
                    className="w-full resize-y rounded-xl border border-gray-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition font-medium leading-relaxed"
                  />
                  <p className={`text-right text-[10px] font-bold tabular-nums transition-colors ${userAnswer.length >= 1800 ? 'text-amber-500 dark:text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}>
                    {userAnswer.length} / 2000
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={userAnswer.trim() === ''}
                    onClick={async () => {
                      setIsEvaluating(true);
                      try {
                        const result = await evaluateAnswer(
                          currentQuestion.question,
                          currentQuestion.idealAnswer,
                          userAnswer.trim()
                        );
                        if (result) {
                          setAiResult(result);
                          aiResultRef.current = result; // sync immediately for stale-closure cleanup
                        } else {
                          // Gemini returned null — surface fallback self-rating
                          setShowFallback(true);
                        }
                      } finally {
                        setIsEvaluating(false);
                      }
                    }}
                    className="w-full bg-[#6366F1] hover:bg-opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-indigo-500/10"
                  >
                    Submit Answer
                  </motion.button>
                </motion.div>
              )}

              {/* ── Phase 2: evaluating spinner ─────────────────────────────── */}
              {isEvaluating && (
                <motion.div
                  key="evaluating-phase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex justify-center py-6"
                >
                  <LoadingState variant="inline" message="Evaluating with AI…" size="sm" />
                </motion.div>
              )}

              {/* ── Phase 3: AI result panel ────────────────────────────────── */}
              {aiResult && !isEvaluating && (
                <motion.div
                  key="result-phase"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="space-y-3"
                >
                  {/* Score + feedback */}
                  <div className={`rounded-xl border p-4 space-y-2 ${
                    aiResult.score <= 2
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : aiResult.score === 3
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                        : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        aiResult.score <= 2 ? 'text-red-500' : aiResult.score === 3 ? 'text-amber-500' : 'text-emerald-500'
                      }`}>AI Score</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(dot => (
                          <div
                            key={dot}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              dot <= aiResult.score
                                ? aiResult.score <= 2 ? 'bg-red-400' : aiResult.score === 3 ? 'bg-amber-400' : 'bg-emerald-400'
                                : 'bg-slate-200 dark:bg-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-black ${
                        aiResult.score <= 2 ? 'text-red-600 dark:text-red-400' : aiResult.score === 3 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>{aiResult.score}/5</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{aiResult.feedback}</p>
                  </div>

                  {/* Collapsible ideal answer */}
                  <details className="group">
                    <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1 select-none list-none">
                      <span className="transition-transform group-open:rotate-90 inline-block">▸</span>
                      View Ideal Answer
                    </summary>
                    <div className="mt-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {currentQuestion.idealAnswer}
                    </div>
                  </details>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={async () => {
                      if (isAdvancingRef.current) return;
                      isAdvancingRef.current = true;
                      await handleRateConfidence(aiResult.score);
                    }}
                    className="w-full bg-[#6366F1] hover:bg-opacity-90 transition text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-indigo-500/10"
                  >
                    {currentIndex < questions.length - 1 ? 'Next Question →' : 'Finish Session ✓'}
                  </motion.button>
                </motion.div>
              )}

              {/* ── Phase 4: fallback self-rating (Gemini error path) ────────── */}
              {showFallback && (
                <motion.div
                  key="fallback-phase"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 text-center"
                >
                  <p className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest">
                    ⚠ AI evaluation failed — rate yourself:
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <motion.button
                        key={num}
                        whileTap={{ scale: 0.92 }}
                        whileHover={{ y: -2 }}
                        onClick={async () => {
                          if (isAdvancingRef.current) return;
                          isAdvancingRef.current = true;
                          await handleRateConfidence(num);
                        }}
                        className={`py-2.5 rounded-xl text-xs font-black transition border shadow-sm ${num <= 2 ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-800/40' :
                          num === 3 ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-800/40' :
                            'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-800/40'
                          }`}
                      >
                        {num}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1 font-bold uppercase tracking-wider">
                    <span>Struggled</span>
                    <span>Nailed it</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Exit modal with AnimatePresence scale + backdrop */}
      <AnimatePresence>
        {isExitModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsExitModalOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <motion.div
                className="bg-white dark:bg-slate-800 max-w-sm w-full rounded-2xl border border-gray-100 dark:border-slate-700 shadow-2xl p-6 space-y-4 pointer-events-auto"
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 12 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-500 rounded-full flex items-center justify-center text-xl mx-auto shadow-sm">
                  ⚠️
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">Exit Quiz?</h3>
                  <p className="text-xs text-slate-400 font-medium leading-normal px-2">
                    Your progress up to this question has been saved.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsExitModalOpen(false)}
                    className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wide transition border border-gray-200 dark:border-slate-600"
                  >
                    Keep Going
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={confirmExitSession}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wide transition shadow-md shadow-red-600/10"
                  >
                    Exit Quiz
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}