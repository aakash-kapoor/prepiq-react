import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import LoadingState from '../components/LoadingState';
import { motion, AnimatePresence } from 'motion/react';

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const appId = location.state?.appId;
  const appName = location.state?.appName || 'Target Position';

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  useEffect(() => {
    if (!user || !appId) {
      navigate('/dashboard/quiz');
      return;
    }
    const questionsRef = collection(db, 'users', user.uid, 'jobApplications', appId, 'questions');
    getDocs(questionsRef).then((snapshot) => {
      const qList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Fisher-Yates shuffle — produces a uniform random permutation.
      // The old sort(() => 0.5 - Math.random()) approach is statistically biased.
      for (let i = qList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [qList[i], qList[j]] = [qList[j], qList[i]];
      }
      setQuestions(qList);
      setLoading(false);
    });
  }, [appId, user, navigate]);

  const handleRateConfidence = async (score: number) => {
    if (!user || !appId) return;
    const currentQ = questions[currentIndex];

    // Read the previous stored values to compute a true running average.
    // timesAnswered is already stored on the doc; we increment it atomically,
    // so we compute the new average from the OLD count before the increment.
    const prevCount = currentQ.timesAnswered ?? 0;
    const prevAvg = currentQ.averageConfidence ?? 0;
    const newCount = prevCount + 1;
    const newAvg = parseFloat(((prevAvg * prevCount + score) / newCount).toFixed(2));

    const docRef = doc(db, 'users', user.uid, 'jobApplications', appId, 'questions', currentQ.id);
    await updateDoc(docRef, {
      timesAnswered: increment(1),
      lastConfidence: score,
      averageConfidence: newAvg,
    });

    if (currentIndex < questions.length - 1) {
      setShowAnswer(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
      setTimeout(() => {
        navigate('/dashboard/quiz', { state: { preSelectedAppId: appId } });
      }, 2500);
    }
  };

  const confirmExitSession = () => {
    setIsExitModalOpen(false);
    navigate('/dashboard/quiz', { state: { preSelectedAppId: appId } });
  };

  if (loading) return <LoadingState message="Assembling interactive session modules..." />;
  if (questions.length === 0) return <div className="text-center p-12">No evaluation content synchronized.</div>;

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
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Practice Cycle Synchronized!</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          Your technical confidence metrics have been securely saved to your ledger. Compiling updated knowledge gaps on your Weak Spots tab now...
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
        <span>Drill Progress</span>
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
            {/* Answer reveal with subtle upward fade */}
            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed"
                >
                  <strong className="text-xs text-slate-400 dark:text-slate-500 block mb-1.5 uppercase tracking-wider font-bold">Ideal Structured Target Response:</strong>
                  {currentQuestion.idealAnswer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-slate-700">
            {!showAnswer ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowAnswer(true)}
                className="w-full bg-[#6366F1] hover:bg-opacity-95 transition text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-indigo-500/10"
              >
                Reveal Ideal Answer
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-center"
              >
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rate Your Technical Confidence:</p>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <motion.button
                      key={num}
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ y: -2 }}
                      onClick={() => handleRateConfidence(num)}
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
                  <span>Struggled (1)</span>
                  <span>Nailed It (5)</span>
                </div>
              </motion.div>
            )}
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
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">Exit Practice Drill?</h3>
                  <p className="text-xs text-slate-400 font-medium leading-normal px-2">
                    Are you sure you want to pause this active session? All score answers logged up to this card have been securely saved.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsExitModalOpen(false)}
                    className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wide transition border border-gray-200 dark:border-slate-600"
                  >
                    Continue Drill
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={confirmExitSession}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wide transition shadow-md shadow-red-600/10"
                  >
                    Yes, Exit Session
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