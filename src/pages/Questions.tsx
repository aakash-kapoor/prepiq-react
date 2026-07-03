import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useGemini } from '../hooks/useGemini';
import { db } from '../config/firebase';
import { collection, onSnapshot, doc, getDocs, writeBatch } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ProgressBar from '../components/ProgressBar';
import Spinner from '../components/Spinner';
import { showSuccessToast, showErrorToast } from '../lib/toast';
import { QuestionsSkeleton } from '../components/Skeleton';
import { useMinLoadingDelay } from '../hooks/useMinLoadingDelay';

// Sub-component to manage individual accordion state safely
const QuestionCard = ({ q, index }: { q: any, index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-100 transition animate-fadeIn">
      <div className="flex justify-between items-start gap-4 mb-2">
        <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">Q{index + 1}</span>
        <div className="flex gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">{q.topic}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-50 text-amber-600 rounded">{q.difficulty}</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-900 leading-snug mb-3">{q.question}</p>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition underline"
      >
        {isExpanded ? 'Hide Ideal Answer' : 'View Ideal Answer'}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-3 p-4 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line"
          >
            {q.idealAnswer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Questions() {
  const { user } = useAuth();
  const { generateQuestions, isLoading: isAiLoading, error: aiError } = useGemini();
  const location = useLocation();

  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(15);
  const { loading: appsLoading, markDone, cancelTimer } = useMinLoadingDelay(600);

  const hasAutoSelected = useRef(false);

  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'users', user.uid, 'jobApplications');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);
      markDone();

      const stateTargetId = location.state?.preSelectedAppId;
      if (stateTargetId) {
        const foundApp = apps.find(a => a.id === stateTargetId);
        if (foundApp) {
          setSelectedApp(foundApp);
          hasAutoSelected.current = true;
          return;
        }
      }

      // Only auto-select the first app once — never override the user's
      // manual selection on subsequent snapshot updates (stale closure fix).
      if (apps.length > 0 && !hasAutoSelected.current) {
        setSelectedApp(apps[0]);
        hasAutoSelected.current = true;
      }
    });
    return () => { unsubscribe(); cancelTimer(); };
  }, [user, location.state]);

  useEffect(() => {
    if (!user || !selectedApp) return;
    setFetchingQuestions(true);
    const questionsRef = collection(db, 'users', user.uid, 'jobApplications', selectedApp.id, 'questions');

    getDocs(questionsRef).then((snapshot) => {
      setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setFetchingQuestions(false);
    });
  }, [selectedApp, user]);

  const handleBuildDeck = async () => {
    if (!user || !selectedApp) return;

    const generated = await generateQuestions(
      selectedApp.role,
      selectedApp.extractedSkills,
      selectedApp.focusAreas,
      questionCount
    );

    if (generated && Array.isArray(generated)) {
      const batch = writeBatch(db);
      const questionsRef = collection(db, 'users', user.uid, 'jobApplications', selectedApp.id, 'questions');

      generated.forEach((q) => {
        const newDocRef = doc(questionsRef);
        batch.set(newDocRef, {
          ...q,
          timesAnswered: 0,
          lastConfidence: 0,
          averageConfidence: 0
        });
      });
      await batch.commit();

      const updatedSnapshot = await getDocs(questionsRef);
      setQuestions(updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      showSuccessToast(`${generated.length} questions added to your deck.`);
    } else {
      showErrorToast(aiError || 'Failed to generate questions. Please try again.');
    }
  };

  if (appsLoading) {
    return <QuestionsSkeleton />;
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <EmptyState
          icon="📚"
          title="Question Bank is Empty"
          description="Before we can build an adaptive mock question pipeline, you need to upload a target job description blueprint."
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-2 items-center shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Select Target Track:</span>
        {applications.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedApp(app)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition max-w-[180px] truncate ${selectedApp?.id === app.id
              ? 'bg-[#6366F1] text-white border-[#6366F1]'
              : 'bg-white text-slate-600 hover:bg-gray-50 border-gray-200'
              }`}
            title={`${app.company} — ${app.role}`}
          >
            {app.company} — {app.role}
          </button>
        ))}
      </div>

      {selectedApp && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 pb-6 border-b-2 md:border-b-0 md:border-gray-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">{selectedApp.role}</h3>
              <p className="text-xs text-slate-500 font-medium">Core Target: {selectedApp.company}</p>
            </div>

            {isAiLoading && (
              <div className="bg-indigo-50 text-indigo-700 border border-indigo-100 p-3 rounded-xl space-y-2">
                <p className="text-xs font-medium">🚀 Gemini is engineering exactly {questionCount} tailored target questions...</p>
                <ProgressBar isActive={isAiLoading} message="Generating questions" />
              </div>
            )}

            <div className="text-xs space-y-1.5 text-slate-600 border-t border-slate-100 pt-4 mt-2">
              <p>📍 <strong>Pool Size:</strong> {questions.length} Questions Loaded</p>
              <p>⚡ <strong>Estimated Tier:</strong> {selectedApp.estimatedDifficulty}</p>
            </div>

            {/* Core Skills, Nice to Have, and Red Flags */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              {selectedApp.extractedSkills?.some((s: any) => s.category === 'Core') && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Core Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedApp.extractedSkills
                      .filter((s: any) => s.category === 'Core')
                      .map((s: any, idx: number) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold">
                          {s.skill}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {selectedApp.extractedSkills?.some((s: any) => s.category === 'NiceToHave' || s.category === 'Nice to Have') && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nice to Have</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedApp.extractedSkills
                      .filter((s: any) => s.category === 'NiceToHave' || s.category === 'Nice to Have')
                      .map((s: any, idx: number) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100 font-bold">
                          {s.skill}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {((selectedApp.redFlags && selectedApp.redFlags.length > 0) || selectedApp.extractedSkills?.some((s: any) => s.category === 'RedFlag')) && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Red Flags Identified</h4>
                  <div className="flex flex-col gap-1">
                    {selectedApp.redFlags?.map((flag: string, idx: number) => (
                      <span key={`flag-${idx}`} className="text-[10px] px-2 py-1.5 rounded bg-rose-50 text-rose-600 border border-rose-100 font-bold leading-tight flex items-start gap-1">
                        <span>⚠️</span>
                        <span>{flag}</span>
                      </span>
                    ))}
                    {selectedApp.extractedSkills
                      ?.filter((s: any) => s.category === 'RedFlag')
                      .map((s: any, idx: number) => (
                        <span key={`skill-flag-${idx}`} className="text-[10px] px-2 py-1.5 rounded bg-rose-50 text-rose-600 border border-rose-100 font-bold leading-tight flex items-start gap-1">
                          <span>⚠️</span>
                          <span>{s.skill}</span>
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {questions.length === 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Number of Questions</label>
                  <select
                    value={questionCount}
                    disabled={isAiLoading}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer disabled:opacity-60"
                  >
                    <option value={5}>Short Sprint (5 Questions)</option>
                    <option value={10}>Standard Practice (10 Questions)</option>
                    <option value={15}>Comprehensive Drill (15 Questions)</option>
                    <option value={20}>Deep Evaluation Master (20 Questions)</option>
                  </select>
                </div>

                <button
                  onClick={handleBuildDeck}
                  disabled={isAiLoading}
                  className="w-full bg-[#6366F1] hover:bg-opacity-95 text-white py-3 px-4 rounded-xl text-xs font-bold transition shadow-md shadow-indigo-500/10 uppercase tracking-wider flex items-center justify-center gap-2.5 text-center"
                >
                  {isAiLoading && <Spinner size="sm" colorClass="text-white" />}
                  <span>{isAiLoading ? 'Building Deck via Gemini...' : 'Generate AI Question Bank'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-3">
            {fetchingQuestions ? (
              <LoadingState message="Syncing local questions storage ledger..." size="md" />
            ) : questions.length === 0 ? (
              <div className="bg-dashed border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center text-slate-400 text-xs font-medium">
                No active mock tracking deck created yet for this role position. Click "Generate" to populate tailored content.
              </div>
            ) : (
              questions.map((q, index) => (
                <QuestionCard key={q.id} q={q} index={index} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}