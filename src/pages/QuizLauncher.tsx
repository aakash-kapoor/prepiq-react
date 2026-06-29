import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import EmptyState from '../components/EmptyState';

export default function QuizLauncher() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'users', user.uid, 'jobApplications');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);

      const stateTargetId = location.state?.preSelectedAppId;
      if (stateTargetId) {
        const foundApp = apps.find(a => a.id === stateTargetId);
        if (foundApp) {
          setSelectedApp(foundApp);
          return;
        }
      }

      if (apps.length > 0 && !selectedApp) {
        setSelectedApp(apps[0]);
      }
    });
    return () => unsubscribe();
  }, [user, location.state]);

  useEffect(() => {
    if (!user || !selectedApp) return;
    const questionsRef = collection(db, 'users', user.uid, 'jobApplications', selectedApp.id, 'questions');
    getDocs(questionsRef).then((snapshot) => {
      setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [selectedApp, user]);

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
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-200 shadow-sm mt-8 animate-fadeIn">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{selectedApp.role}</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">Core Target: {selectedApp.company}</p>
            
            {questions.length === 0 ? (
                <div className="text-center space-y-4">
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">No Deck Generated</p>
                     <button onClick={() => navigate('/dashboard/questions')} className="text-sm text-indigo-600 hover:text-indigo-800 transition underline font-bold">Go to Question Bank to generate.</button>
                </div>
            ) : (
                <div className="text-center space-y-6 max-w-sm w-full">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-around items-center">
                         <div className="text-center">
                              <p className="text-2xl font-black text-slate-900">{questions.length}</p>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Cards Loaded</p>
                         </div>
                         <div className="w-px bg-slate-200 h-12"></div>
                         <div className="text-center">
                              <p className="text-lg font-black text-slate-900 capitalize">{selectedApp.estimatedDifficulty}</p>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Difficulty</p>
                         </div>
                    </div>
                    
                    <button
                        onClick={() => navigate('/dashboard/quiz-session', { state: { appId: selectedApp.id, appName: selectedApp.company } })}
                        className="w-full bg-[#F97316] hover:bg-orange-600 text-white py-4 rounded-xl text-sm font-black transition uppercase tracking-wider shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5"
                    >
                        Launch Mock Practice Session
                    </button>
                    <p className="text-[11px] text-slate-400 font-medium mt-4 px-4 leading-relaxed">
                        Iterative testing improves recall. Taking this quiz multiple times will update your moving confidence averages on the Weak Spots radar.
                    </p>
                </div>
            )}
        </div>
      )}
    </div>
  );
}