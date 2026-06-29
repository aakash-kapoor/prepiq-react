import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGemini } from '../hooks/useGemini';
import { db } from '../config/firebase';
import { collection, onSnapshot, doc, getDocs, writeBatch } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Questions() {
  const { user } = useAuth();
  const { generateQuestions, isLoading: isAiLoading } = useGemini();
  const navigate = useNavigate();
  const location = useLocation();

  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  
  // Dynamic Selector State[cite: 1]
  const [questionCount, setQuestionCount] = useState<number>(15);

  // Sync saved applications from user's Firestore collection
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

  // Load questions when an application card is clicked
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
    
    // Pass the custom count selection directly to the hook[cite: 1]
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
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Target Application Selector bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-2 items-center shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Select Target Track:</span>
        {applications.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedApp(app)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition max-w-[180px] truncate ${
              selectedApp?.id === app.id
                ? 'bg-[#6366F1] text-white border-[#6366F1]'
                : 'bg-white text-slate-600 hover:bg-gray-50 border-gray-200'
            }`}
          >
            {app.company} — {app.role}
          </button>
        ))}
      </div>

      {selectedApp && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Deck Status Overview Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 pb-6 border-b-2 md:border-b-0 md:border-gray-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">{selectedApp.role}</h3>
              <p className="text-xs text-slate-500 font-medium">Core Target: {selectedApp.company}</p>
            </div>

            {isAiLoading && (
              <div className="bg-indigo-50 text-indigo-700 border border-indigo-100 p-3 rounded-xl text-xs font-medium animate-pulse">
                🚀 Gemini is engineering exactly {questionCount} tailored target questions...
              </div>
            )}

            <div className="text-xs space-y-1.5 text-slate-600">
              <p>📍 <strong>Pool Size:</strong> {questions.length} Questions Loaded</p>
              <p>⚡ <strong>Estimated Tier:</strong> {selectedApp.estimatedDifficulty}</p>
            </div>

            {questions.length === 0 ? (
              <div className="space-y-3 pt-2">
                {/* Custom Styled Select Dropdown Menu[cite: 1] */}
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
                  className="w-full bg-[#6366F1] hover:bg-opacity-95 text-white py-3 rounded-xl text-xs font-bold transition shadow-md shadow-indigo-500/10 uppercase tracking-wider"
                >
                  {isAiLoading ? 'Building Deck via Gemini...' : 'Generate AI Question Bank'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/dashboard/quiz', { state: { appId: selectedApp.id, appName: selectedApp.company } })}
                className="w-full bg-[#F97316] hover:bg-opacity-95 text-white py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 uppercase tracking-wider shadow-md shadow-orange-500/10"
              >
                Launch Mock Practice Session
              </button>
            )}
          </div>

          {/* List of generated Accordion / Rows */}
          <div className="md:col-span-2 space-y-3">
            {fetchingQuestions ? (
              <p className="text-sm text-gray-500 font-medium">Syncing local questions storage ledger...</p>
            ) : questions.length === 0 ? (
              <div className="bg-dashed border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center text-slate-400 text-xs font-medium">
                No active mock tracking deck created yet for this role position. Click "Generate" to populate tailored content.
              </div>
            ) : (
              questions.map((q, index) => (
                <div key={q.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-100 transition animate-fadeIn">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">Q{index + 1}</span>
                    <div className="flex gap-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">{q.topic}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-50 text-amber-600 rounded">{q.difficulty}</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 leading-snug">{q.question}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}