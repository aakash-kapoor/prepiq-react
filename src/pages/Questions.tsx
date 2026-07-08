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
import { QuestionsSkeleton, QuestionsContentSkeleton, QuestionCardsSkeleton } from '../components/Skeleton';
import { useMinLoadingDelay } from '../hooks/useMinLoadingDelay';
import TrackSelector from '../components/TrackSelector';
import CustomSelect from '../components/CustomSelect';
import { deleteQuestion } from '../lib/deleteUserData';

// Sub-component to manage individual accordion state safely
const QuestionCard = ({ q, index, onDelete }: { q: any, index: number, onDelete: (id: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    onDelete(q.id);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:border-indigo-100 dark:hover:border-indigo-500/50 transition animate-fadeIn">
      <div className="flex justify-between items-start gap-4 mb-2">
        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md">Q{index + 1}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded">{q.topic}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 rounded">{q.difficulty}</span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-5 h-5 flex items-center justify-center rounded text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-150 disabled:opacity-40 ml-1"
            title="Remove this question"
            aria-label="Remove question"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug mb-3">{q.question}</p>

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
            className="mt-3 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-line"
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
  const { generateQuestions, error: aiError } = useGemini();
  const location = useLocation();

  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [isBuildingDeck, setIsBuildingDeck] = useState(false);
  const { loading: appsLoading, markDone, cancelTimer } = useMinLoadingDelay(600);

  const [filterTopic, setFilterTopic] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [isBlueprintExpanded, setIsBlueprintExpanded] = useState(false);

  const hasAutoSelected = useRef(false);
  const prevSelectedAppIdRef = useRef<string | null>(null);

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

    const isTrackSwitch = prevSelectedAppIdRef.current !== null && prevSelectedAppIdRef.current !== selectedApp.id;
    prevSelectedAppIdRef.current = selectedApp.id;

    if (isTrackSwitch) {
      setContentLoading(true);
    }
    const startTime = Date.now();
    setFetchingQuestions(true);
    const questionsRef = collection(db, 'users', user.uid, 'jobApplications', selectedApp.id, 'questions');

    const unsubscribe = onSnapshot(questionsRef, (snapshot) => {
      const questionsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (isTrackSwitch) {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 400 - elapsed);
        setTimeout(() => {
          setQuestions(questionsList);
          setFetchingQuestions(false);
          setContentLoading(false);
        }, delay);
      } else {
        setQuestions(questionsList);
        setFetchingQuestions(false);
        setContentLoading(false);
      }
    }, (error) => {
      console.error("Error listening to questions:", error);
      setFetchingQuestions(false);
      setContentLoading(false);
    });

    return () => unsubscribe();
  }, [selectedApp, user]);

  const handleBuildDeck = async () => {
    if (!navigator.onLine) {
      showErrorToast('You\'re offline. Connect to the internet to generate interview questions.');
      return;
    }
    if (!user || !selectedApp || isBuildingDeck) return;

    setIsBuildingDeck(true);
    try {
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
    } catch (err: any) {
      console.error('Error building question deck:', err);
      showErrorToast('An error occurred while building the deck.');
    } finally {
      setIsBuildingDeck(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!user || !selectedApp) return;
    // Optimistic remove — update UI immediately, then delete from Firestore
    setQuestions(prev => prev.filter(q => q.id !== questionId));

    if (!navigator.onLine) {
      deleteQuestion(user.uid, selectedApp.id, questionId).catch(err => {
        console.error('Offline delete failed:', err);
      });
      showSuccessToast('Question removed offline — the change will sync automatically when you\'re back online.');
      return;
    }

    try {
      await deleteQuestion(user.uid, selectedApp.id, questionId);
      showSuccessToast('Question removed.');
    } catch (err) {
      // Rollback isn't straightforward without caching the removed item,
      // so re-fetch from Firestore to restore truth
      const questionsRef = collection(db, 'users', user.uid, 'jobApplications', selectedApp.id, 'questions');
      const snapshot = await getDocs(questionsRef);
      setQuestions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      showErrorToast('Failed to remove question. Please try again.');
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
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-wrap gap-2 items-center shadow-sm">
        <TrackSelector
          label="Job Track:"
          applications={applications}
          selectedApp={selectedApp}
          onSelect={setSelectedApp}
        />
      </div>

      {selectedApp && (
        contentLoading ? (
          <QuestionsContentSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4 pb-6 border-b-2 md:border-b-0">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">{selectedApp.role}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{selectedApp.company}</p>
            </div>

            {isBuildingDeck && (
              <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 p-3 rounded-xl space-y-2">
                <p className="text-xs font-medium">🚀 Gemini is engineering exactly {questionCount} tailored target questions...</p>
                <ProgressBar isActive={isBuildingDeck} message="Generating questions" />
              </div>
            )}

            <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
              <p>📍 <strong>Questions:</strong> {questions.length} Questions Loaded</p>
              <p>⚡ <strong>Estimated Tier:</strong> {selectedApp.estimatedDifficulty}</p>
            </div>

            {/* Collapsible Job Blueprint Section */}
            <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
              <button
                type="button"
                onClick={() => setIsBlueprintExpanded(!isBlueprintExpanded)}
                className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                aria-expanded={isBlueprintExpanded}
              >
                <span className="flex items-center gap-1.5">
                  📋 <span>Target Skills & Blueprint</span>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isBlueprintExpanded ? 'rotate-180' : ''}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              <AnimatePresence initial={false}>
                {isBlueprintExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-4">
                      {selectedApp.extractedSkills?.some((s: any) => s.category === 'Core') && (
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Core Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedApp.extractedSkills
                              .filter((s: any) => s.category === 'Core')
                              .map((s: any, idx: number) => (
                                <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 font-bold">
                                  {s.skill}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}

                      {selectedApp.extractedSkills?.some((s: any) => s.category === 'NiceToHave' || s.category === 'Nice to Have') && (
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Nice to Have</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedApp.extractedSkills
                              .filter((s: any) => s.category === 'NiceToHave' || s.category === 'Nice to Have')
                              .map((s: any, idx: number) => (
                                <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 border border-amber-100 dark:border-amber-800 font-bold">
                                  {s.skill}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}

                      {((selectedApp.redFlags && selectedApp.redFlags.length > 0) || selectedApp.extractedSkills?.some((s: any) => s.category === 'RedFlag')) && (
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Red Flags Identified</h4>
                          <div className="flex flex-col gap-1">
                            {selectedApp.redFlags?.map((flag: string, idx: number) => (
                              <span key={`flag-${idx}`} className="text-[10px] px-2 py-1.5 rounded bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 border border-rose-100 dark:border-rose-800 font-bold leading-tight flex items-start gap-1">
                                <span>⚠️</span>
                                <span>{flag}</span>
                              </span>
                            ))}
                            {selectedApp.extractedSkills
                              ?.filter((s: any) => s.category === 'RedFlag')
                              .map((s: any, idx: number) => (
                                <span key={`skill-flag-${idx}`} className="text-[10px] px-2 py-1.5 rounded bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 border border-rose-100 dark:border-rose-800 font-bold leading-tight flex items-start gap-1">
                                  <span>⚠️</span>
                                  <span>{s.skill}</span>
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <CustomSelect
                label={questions.length === 0 ? 'Number of Questions' : 'Questions to Add'}
                value={questionCount}
                disabled={isBuildingDeck}
                onChange={setQuestionCount}
                options={[
                  { value: 5, label: '5 Questions' },
                  { value: 10, label: '10 Questions' },
                  { value: 15, label: '15 Questions' },
                  { value: 20, label: '20 Questions' }
                ]}
              />

              <button
                onClick={handleBuildDeck}
                disabled={isBuildingDeck}
                className="w-full bg-[#6366F1] hover:bg-opacity-95 text-white py-3 px-4 rounded-xl text-xs font-bold transition shadow-md shadow-indigo-500/10 uppercase tracking-wider flex items-center justify-center gap-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBuildingDeck && <Spinner size="sm" colorClass="text-white" />}
                <span>
                  {isBuildingDeck
                    ? 'Building with Gemini...'
                    : questions.length === 0
                      ? 'Build Question Bank'
                      : `Add ${questionCount} More Questions`}
                </span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            {fetchingQuestions ? (
              <LoadingState message="Syncing local questions storage ledger..." size="md" />
            ) : isBuildingDeck && questions.length === 0 ? (
              <QuestionCardsSkeleton count={questionCount} />
            ) : questions.length === 0 ? (
              <div className="bg-dashed border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-12 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">
                No questions yet — click Build to get started.
              </div>
            ) : (
              <>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-3 mb-2">
                  <CustomSelect
                    label="Topic"
                    value={filterTopic}
                    onChange={setFilterTopic}
                    className="flex-1"
                    options={['All', ...Array.from(new Set(questions.map(q => q.topic).filter(Boolean)))].map(t => ({
                      value: t as string,
                      label: t as string
                    }))}
                  />
                  <CustomSelect
                    label="Difficulty"
                    value={filterDifficulty}
                    onChange={setFilterDifficulty}
                    className="flex-1"
                    options={['All', ...Array.from(new Set(questions.map(q => q.difficulty).filter(Boolean)))].map(d => ({
                      value: d as string,
                      label: d as string
                    }))}
                  />
                  <CustomSelect
                    label="Sort By"
                    value={sortOption}
                    onChange={setSortOption}
                    className="flex-1"
                    options={[
                      { value: 'default', label: 'Default' },
                      { value: 'confidenceAsc', label: 'Confidence (Lowest)' },
                      { value: 'confidenceDesc', label: 'Confidence (Highest)' }
                    ]}
                  />
                </div>
                
                <AnimatePresence mode="popLayout">
                  {questions
                    .filter(q => filterTopic === 'All' || q.topic === filterTopic)
                    .filter(q => filterDifficulty === 'All' || q.difficulty === filterDifficulty)
                    .sort((a, b) => {
                      if (sortOption === 'confidenceAsc') return (a.averageConfidence || 0) - (b.averageConfidence || 0);
                      if (sortOption === 'confidenceDesc') return (b.averageConfidence || 0) - (a.averageConfidence || 0);
                      return 0;
                    })
                    .map((q, index) => (
                  <motion.div
                    key={q.id}
                    layout
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                  >
                    <QuestionCard q={q} index={index} onDelete={handleDeleteQuestion} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {isBuildingDeck && (
                <div className="mt-3">
                  <QuestionCardsSkeleton count={questionCount} />
                </div>
              )}
              </>
            )}
          </div>
          </div>
        )
      )}
    </div>
  );
}