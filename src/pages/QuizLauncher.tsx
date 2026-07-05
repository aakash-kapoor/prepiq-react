import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { QuizLauncherSkeleton, QuizLauncherContentSkeleton } from '../components/Skeleton';
import { useMinLoadingDelay } from '../hooks/useMinLoadingDelay';
import TrackSelector from '../components/TrackSelector';

export default function QuizLauncher() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const { loading: appsLoading, markDone, cancelTimer } = useMinLoadingDelay(600);

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
    const questionsRef = collection(db, 'users', user.uid, 'jobApplications', selectedApp.id, 'questions');
    getDocs(questionsRef).then((snapshot) => {
      const questionsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (isTrackSwitch) {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 400 - elapsed);
        setTimeout(() => {
          setQuestions(questionsList);
          setContentLoading(false);
        }, delay);
      } else {
        setQuestions(questionsList);
        setContentLoading(false);
      }
    });
  }, [selectedApp, user]);

  if (appsLoading) {
    return <QuizLauncherSkeleton />;
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <EmptyState
          icon="🎮"
          title="No Active Quiz Target"
          description="Analyze a job description first to initialize your target tracking."
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-wrap gap-2 items-center shadow-sm">
        <TrackSelector
          label="Select Target Track:"
          applications={applications}
          selectedApp={selectedApp}
          onSelect={setSelectedApp}
        />
      </div>

      {selectedApp && (
        contentLoading ? (
          <QuizLauncherContentSkeleton />
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm mt-8 animate-fadeIn">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">{selectedApp.role}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">Core Target: {selectedApp.company}</p>
            
            {questions.length === 0 ? (
                <div className="text-center space-y-4">
                     <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">No Deck Generated</p>
                     <button onClick={() => navigate('/dashboard/questions')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition underline font-bold">Go to Question Bank to generate.</button>
                </div>
            ) : (
                <div className="text-center space-y-6 max-w-sm w-full">
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-xl p-4 flex justify-around items-center">
                         <div className="text-center">
                              <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{questions.length}</p>
                              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1">Cards Loaded</p>
                         </div>
                         <div className="w-px bg-slate-200 dark:bg-slate-700 h-12"></div>
                         <div className="text-center">
                              <p className="text-lg font-black text-slate-900 dark:text-slate-100 capitalize">{selectedApp.estimatedDifficulty}</p>
                              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1">Difficulty</p>
                         </div>
                    </div>
                    
                    <button
                        onClick={() => navigate('/dashboard/quiz-session', { state: { appId: selectedApp.id, appName: selectedApp.company } })}
                        className="w-full bg-[#F97316] hover:bg-orange-600 text-white py-4 rounded-xl text-sm font-black transition uppercase tracking-wider shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5"
                    >
                        Launch Mock Practice Session
                    </button>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-4 px-4 leading-relaxed">
                        Iterative testing improves recall. Taking this quiz multiple times will update your moving confidence averages on the Weak Spots radar.
                    </p>
                </div>
            )}
          </div>
        )
      )}
    </div>
  );
}