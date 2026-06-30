import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import LoadingState from '../components/LoadingState';

interface JobApp {
  id: string;
  company: string;
  role: string;
  estimatedDifficulty: string;
  overallProgress: number;
  extractedSkills: any[];
  focusAreas: string[];
}

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState<JobApp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [globalAvgConfidence, setGlobalAvgConfidence] = useState<number>(0);

  // 1. Fetch real-time job applications tracker ledger
  useEffect(() => {
    if (!user) return;

    const appsRef = collection(db, 'users', user.uid, 'jobApplications');
    const unsubscribe = onSnapshot(appsRef, async (snapshot) => {
      const appsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApp));
      setApplications(appsList);

      // 2. Safely aggregate cross-subcollection structural question counts and metrics
      let questionCounter = 0;
      let totalConfidenceSum = 0;
      let ratedQuestionsCount = 0;

      for (const app of appsList) {
        const qRef = collection(db, 'users', user.uid!, 'jobApplications', app.id, 'questions');
        const qSnapshot = await getDocs(qRef);
        questionCounter += qSnapshot.size;

        qSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.lastConfidence && data.lastConfidence > 0) {
            totalConfidenceSum += data.lastConfidence;
            ratedQuestionsCount += 1;
          }
        });
      }

      setTotalQuestions(questionCounter);
      setGlobalAvgConfidence(
        ratedQuestionsCount > 0 ? parseFloat((totalConfidenceSum / ratedQuestionsCount).toFixed(1)) : 0.0
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <LoadingState message="Syncing real-time workspace metrics..." />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-1 md:px-0">
      
      {/* Dynamic Header Badge Text Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {user?.displayName?.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            You have <span className="text-[#6366F1] font-semibold">{applications.length} active roles</span> tracking. Keep sharpening your weak spots.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/analyze')}
          className="text-xs font-bold bg-[#6366F1] hover:bg-opacity-95 text-white px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/10 transition self-start sm:self-auto"
        >
          Analyze New JD →
        </button>
      </div>

      {/* 2. RESPONSIVE DYNAMIC STAT CARDS METRIC ROW*/}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active JDs</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{applications.length}</h3>
          <p className="text-[11px] text-slate-400 mt-1 truncate" title="In compilation sync pipeline">
            In compilation sync pipeline
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Questions Sourced</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalQuestions}</h3>
          <p className="text-[11px] text-slate-400 mt-1 truncate">Across all targets</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Confidence</p>
          <h3 className="text-2xl font-extrabold text-[#6366F1] mt-1">{globalAvgConfidence || '0.0'}</h3>
          <p className="text-[11px] text-slate-400 mt-1 truncate">/ 5.0 target benchmark</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Target</p>
          <h3
            className="text-xl font-extrabold text-orange-500 mt-1.5 truncate"
            title={applications[0]?.company || 'None Active'}
          >
            {applications[0]?.company || 'None Active'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 truncate">Ready for drill routines</p>
        </div>
      </div>

      {/* 3. FLUID ACTIVE JOB TRACKS CONTAINER */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Job Preparations</h3>
        
        {applications.length === 0 ? (
          <div className="bg-dashed border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center text-slate-400 text-sm font-medium">
            No tracked applications active. Click "Analyze New JD" above to seed your platform metrics!
          </div>
        ) : (
          /* Grid auto-adjusts cleanly: 1 column on mobile screens, 2 columns on desktops */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => {
              
              // === ADD CODE FOR ACCENTS HERE ===
              const difficulty = app.estimatedDifficulty?.toLowerCase() || 'mid-level';
              
              // Fallback style (Mid-Level / Medium)[cite: 1]
              let accentStyles = {
                borderTop: 'border-t-4 border-t-[#F97316]', // Vibrant Orange[cite: 1]
                badge: 'bg-orange-50 text-orange-700 border-orange-200'
              };

              if (difficulty.includes('senior') || difficulty.includes('hard')) {
                accentStyles = {
                  borderTop: 'border-t-4 border-t-[#EF4444]', // Crimson Red[cite: 1]
                  badge: 'bg-red-50 text-red-700 border-red-200'
                };
              } else if (difficulty.includes('easy') || difficulty.includes('junior') || difficulty.includes('green')) {
                accentStyles = {
                  borderTop: 'border-t-4 border-t-[#10B981]', // Emerald Green[cite: 1]
                  badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
                };
              } else if (difficulty.includes('mid') || difficulty.includes('medium')) {
                accentStyles = {
                  borderTop: 'border-t-4 border-t-[#F97316]', // Orange[cite: 1]
                  badge: 'bg-orange-50 text-orange-700 border-orange-200'
                };
              }

              return (
                <div 
                  key={app.id} 
                  // Injected dynamic top border accent class here
                  className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4 hover:border-indigo-100/80 transition duration-150 ${accentStyles.borderTop}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-base tracking-tight leading-tight">{app.role}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{app.company}</p>
                    </div>
                    {/* Injected dynamic custom badge color class here */}
                    <span className={`text-[9px] font-extrabold border px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${accentStyles.badge}`}>
                      {app.estimatedDifficulty || 'Mid-Level'}
                    </span>
                  </div>

                  {/* Progress metrics bars section */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span className="text-slate-400 font-medium text-[11px]">Skill Extraction Weight</span>
                      <span>{app.extractedSkills?.length || 0} Badges Logged</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#6366F1] h-1.5 transition-all duration-500" 
                        style={{ width: `${Math.min((app.extractedSkills?.length || 0) * 4, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Navigation Actions Footer Strip matching wireframe layouts */}
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between mt-1">
                    <span className="text-[11px] text-slate-400 font-medium">
                      🎯 {app.focusAreas?.length || 0} Core Evaluation Hubs
                    </span>
                    <button
                      onClick={() => navigate('/dashboard/questions', {
                        state: { preSelectedAppId: app.id }
                      })}
                      className="text-xs font-bold text-[#6366F1] hover:text-opacity-80 transition flex items-center gap-0.5"
                    >
                      View Insights & Practice →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}