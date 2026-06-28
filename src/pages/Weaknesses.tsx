import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';

interface TopicStats {
  topic: string;
  totalQuestions: number;
  avgConfidence: number;
  difficultyBreakdown: { [key: string]: number };
}

export default function Weaknesses() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [topicMetrics, setTopicMetrics] = useState<TopicStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Sync Job Tracks from Firestore
  useEffect(() => {
    if (!user) return;
    const appsRef = collection(db, 'users', user.uid, 'jobApplications');
    const unsubscribe = onSnapshot(appsRef, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);
      if (apps.length > 0 && !selectedApp) {
        setSelectedApp(apps[0]);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // 2. Fetch and Aggregate Confidence Metrics
  useEffect(() => {
    if (!user || !selectedApp) return;
    setIsLoading(true);
    const questionsRef = collection(db, 'users', user.uid, 'jobApplications', selectedApp.id, 'questions');

    getDocs(questionsRef).then((snapshot) => {
      const questionsData = snapshot.docs.map(doc => doc.data());

      const groups: { [key: string]: { total: number; sum: number; difficulties: { [key: string]: number } } } = {};

      questionsData.forEach((q: any) => {
        const topic = q.topic || 'General';
        const conf = q.lastConfidence || 0;
        const diff = q.difficulty || 'Medium';
        if (!groups[topic]) {
          groups[topic] = { total: 0, sum: 0, difficulties: {} };
        }

        if (conf > 0) {
          groups[topic].total += 1;
          groups[topic].sum += conf;
        }
        groups[topic].difficulties[diff] = (groups[topic].difficulties[diff] || 0) + 1;
      });

      const formattedStats: TopicStats[] = Object.keys(groups).map(topicName => {
        const item = groups[topicName];
        return {
          topic: topicName,
          totalQuestions: item.total || Object.values(item.difficulties).reduce((a, b) => a + b, 0),
          avgConfidence: item.total > 0 ? parseFloat((item.sum / item.total).toFixed(1)) : 0,
          difficultyBreakdown: item.difficulties
        };
      });

      setTopicMetrics(formattedStats);
      setIsLoading(false);
    });
  }, [selectedApp, user]);

  const getStatusConfig = (score: number) => {
    if (score === 0) return { label: 'Unpracticed', color: 'text-slate-400 bg-slate-50 border-slate-200', barColor: 'bg-slate-300', strokeColor: '#CBD5E1' };
    if (score < 3.0) return { label: 'Critical Gap', color: 'text-red-700 bg-red-50 border-red-200', barColor: 'bg-[#EF4444]', strokeColor: '#EF4444' };
    if (score < 4.0) return { label: 'Needs Work', color: 'text-amber-700 bg-amber-50 border-amber-200', barColor: 'bg-[#F59E0B]', strokeColor: '#F59E0B' };
    return { label: 'Mastered', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', barColor: 'bg-[#10B981]', strokeColor: '#10B981' };
  };

  const practicedTopics = topicMetrics.filter(t => t.avgConfidence > 0);
  const globalAvg = practicedTopics.length > 0
    ? (topicMetrics.reduce((sum, item) => sum + item.avgConfidence, 0) / practicedTopics.length).toFixed(1)
    : '0.0';

  // Math variables for dynamic SVG Donut Chart mapping
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const globalAvgNum = parseFloat(globalAvg);
  const strokeDashoffset = circumference - (Math.min(globalAvgNum, 5) / 5) * circumference;

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Target Application Selector */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-2 items-center shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Analytics Target:</span>
        {applications.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedApp(app)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${selectedApp?.id === app.id
                ? 'bg-[#6366F1] text-white border-[#6366F1]'
                : 'bg-white text-slate-600 hover:bg-gray-50 border-gray-200'
              }`}
          >
            {app.company} — {app.role}
          </button>
        ))}
      </div>

      {selectedApp && (
        <>
          {/* Top Line Strategic Aggregators Summary Row with integrated Custom Donut Graphics[cite: 2] */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* CARD 1: GLOBAL ACCUMULATED SCORE METRIC CONTAINER */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center justify-between transition hover:border-indigo-100/80">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Overall Score Index</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{globalAvg} <span className="text-sm font-medium text-slate-400">/ 5.0</span></h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Platform baseline score benchmark</p>
              </div>

              {/* Premium Inline SVG Donut Progress Circle */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r={radius} stroke="#F1F5F9" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="#6366F1"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute text-xs font-extrabold text-indigo-600">{Math.round((globalAvgNum / 5) * 100)}%</span>
              </div>
            </div>

            {/* CARD 2: CRITICAL GAPS DANGER FLAG CARD */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center justify-between transition hover:border-red-100/80">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Critical Knowledge Gaps</p>
                <h3 className="text-3xl font-extrabold text-red-600 mt-1">
                  {topicMetrics.filter(t => t.avgConfidence > 0 && t.avgConfidence < 3.0).length}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Modules rating below 3.0</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-xl select-none">🚨</div>
            </div>

            {/* CARD 3: TOPICS MASTERED SPRINT CONTAINER */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center justify-between transition hover:border-emerald-100/80">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Topics Mastered</p>
                <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">
                  {topicMetrics.filter(t => t.avgConfidence >= 4.0).length}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Perfect validation logs</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl select-none">🏆</div>
            </div>

          </div>

          {/* Main Visual Framework: Custom Styled Analytics Rails[cite: 2] */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-900">Topic-Wise Technical Confidence Index</h3>
              <p className="text-xs text-gray-500 mt-0.5">Calculated in real time based on your manual confidence evaluations[cite: 2].</p>
            </div>

            {isLoading ? (
              <p className="text-sm text-gray-400 p-4 font-medium">Compiling structural analytics data matrices...</p>
            ) : topicMetrics.length === 0 ? (
              <p className="text-sm text-gray-400 p-4 text-center font-medium">No active question configurations initialized. Go to your Question Bank to build a tracking deck.</p>
            ) : (
              <div className="space-y-6">
                {topicMetrics.map((item, index) => {
                  const currentStatus = getStatusConfig(item.avgConfidence);
                  const barWidthPercent = item.avgConfidence > 0 ? (item.avgConfidence / 5) * 100 : 0;


                  return (
                    /* Upgraded container to a 5-column grid layout for desktop balance */
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0 group">

                      {/* Column 1: Metadata (Upgraded to take up 2 full columns for broad text safety) */}
                      <div className="flex items-center gap-3 md:col-span-2 min-w-0">
                        {/* Micro Row-Wise Circle Metric */}
                        <div className="relative w-10 h-10 flex items-center justify-center shrink-0 hidden sm:flex">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="20" cy="20" r="16" stroke="#F1F5F9" strokeWidth="3" fill="transparent" />
                            <circle
                              cx="20"
                              cy="20"
                              r="16"
                              stroke={currentStatus.strokeColor}
                              strokeWidth="3"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 16}
                              strokeDashoffset={2 * Math.PI * 16 - (Math.min(item.avgConfidence, 5) / 5) * (2 * Math.PI * 16)}
                              className="transition-all duration-500"
                            />
                          </svg>
                          <span className="absolute text-[9px] font-black text-slate-700">{item.avgConfidence || '—'}</span>
                        </div>

                        {/* Removed the 'truncate' utility class to allow natural wrapping safely */}
                        <div className="min-w-0 pr-2">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors break-words leading-tight">
                            {item.topic}
                          </p>
                          <p className="text-[11px] text-gray-400 font-semibold mt-0.5 whitespace-nowrap">
                            {item.totalQuestions} active questions logged
                          </p>
                        </div>
                      </div>

                      {/* Column 2: Status Pill Tag (Takes 1 column slot cleanly) */}
                      <div className="md:col-span-1 flex items-center">
                        <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md border inline-block ${currentStatus.color}`}>
                          {currentStatus.label}
                        </span>
                      </div>

                      {/* Column 3: Custom UI Progress Metrics Rail (Takes up the remaining 2 column slots) */}
                      <div className="md:col-span-2 space-y-1.5 w-full">
                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                          <span>Target Metric</span>
                          <span className="text-slate-700 font-extrabold">{item.avgConfidence > 0 ? `${item.avgConfidence} / 5.0` : 'Not evaluated'}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${currentStatus.barColor}`}
                            style={{ width: `${barWidthPercent}%` }}
                          />
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}