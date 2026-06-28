import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';

interface JobApp {
  id: string;
  company: string;
  role: string;
  interviewDate?: string;
}

interface TimelineDay {
  dayNumber: number;
  title: string;
  focusTopics: string[];
  type: 'review' | 'mock' | 'final';
  description: string;
}

export default function StudyPlan() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApp[]>([]);
  const [selectedApp, setSelectedApp] = useState<JobApp | null>(null);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<TimelineDay[]>([]);
  const [daysRemaining, setDaysRemaining] = useState<number>(7); // Default fallback schedule window
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Sync Job Applications from Firestore
  useEffect(() => {
    if (!user) return;
    const appsRef = collection(db, 'users', user.uid, 'jobApplications');
    const unsubscribe = onSnapshot(appsRef, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApp));
      setApplications(apps);
      if (apps.length > 0 && !selectedApp) {
        setSelectedApp(apps[0]);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // 2. Identify Gaps & Build Timeline dynamically based on data
  useEffect(() => {
    if (!user || !selectedApp) return;
    setIsLoading(true);

    const questionsRef = collection(db, 'users', user.uid, 'jobApplications', selectedApp.id, 'questions');
    
    getDocs(questionsRef).then((snapshot) => {
      const questions = snapshot.docs.map(doc => doc.data());
      
      // Group confidence by topic to find problem areas
      const topicScores: { [key: string]: { sum: number; count: number } } = {};
      questions.forEach((q: any) => {
        const topic = q.topic || 'General Specs';
        if (q.lastConfidence && q.lastConfidence > 0) {
          if (!topicScores[topic]) topicScores[topic] = { sum: 0, count: 0 };
          topicScores[topic].sum += q.lastConfidence;
          topicScores[topic].count += 1;
        }
      });

      // Filter down to topics with an average score under 3.5 (Critical Gaps or Needs Work)
      const gaps = Object.keys(topicScores).filter(topic => {
        const avg = topicScores[topic].sum / topicScores[topic].count;
        return avg < 3.5;
      });

      setWeakTopics(gaps.length > 0 ? gaps : ['Core System Architecture', 'Performance Optimization']);
      
      // Calculate real schedule window if an interview date is set, otherwise default to a 5-day rush sprint
      let windowSize = 5;
      if (selectedApp.interviewDate) {
        const diffTime = Math.abs(new Date(selectedApp.interviewDate).getTime() - new Date().getTime());
        windowSize = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 3);
      }
      setDaysRemaining(windowSize);

      // 3. Generate Custom Timeline Array Blueprint
      const generatedTimeline: TimelineDay[] = [];
      
      for (let i = 1; i <= windowSize; i++) {
        if (i === windowSize) {
          // Final day layout: "The Final 10 Mode" from project specifications
          generatedTimeline.push({
            dayNumber: i,
            title: 'The Final 10 Flash Drill ⚡',
            focusTopics: gaps.slice(0, 3),
            type: 'final',
            description: 'The night before. Put away the massive text blocks. Run strict flash card memory loops against your 10 weakest questions only.'
          });
        } else if (i === windowSize - 1) {
          generatedTimeline.push({
            dayNumber: i,
            title: 'Full System Mock Simulation',
            focusTopics: ['All Topics / Random Deck Mix'],
            type: 'mock',
            description: 'Simulate absolute pressure. Pull a mixed deck of 30 random conceptual and practical items without turning on answer sheets.'
          });
        } else {
          // Divide identified gaps across early schedule rows dynamically
          const topicIndex = (i - 1) % (gaps.length || 1);
          const currentFocus = gaps.length > 0 ? [gaps[topicIndex]] : ['Core Architecture Re-evaluation'];
          
          generatedTimeline.push({
            dayNumber: i,
            title: `Deep Dive Revision: Phase ${i}`,
            focusTopics: currentFocus,
            type: 'review',
            description: `Isolate and target your logged proficiency gap in ${currentFocus[0]}. Build manual components locally to cement the logic.`
          });
        }
      }

      setTimeline(generatedTimeline);
      setIsLoading(false);
    });

  }, [selectedApp, user]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Target Application Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-2 items-center shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Track Timeline:</span>
        {applications.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedApp(app)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
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
          
          {/* Left Column: Schedule Overview Insights Panel */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Timeline Engine</h2>
              <p className="text-xs text-slate-400 mt-0.5">{selectedApp.company} — {selectedApp.role}</p>
            </div>
            
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Preparation Status</p>
              <h3 className="text-2xl font-black text-slate-800">{daysRemaining} Days Left</h3>
              <p className="text-xs text-slate-500 font-medium leading-tight pt-1">
                AI has dynamically distributed your target gap modules based on your manual confidence logs.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identified Gaps to Close</h4>
              <div className="flex flex-wrap gap-1">
                {weakTopics.map((topic, idx) => (
                  <span key={idx} className="text-[11px] font-semibold bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded">
                    ⚠️ {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Custom Tailored SVG-Style Timeline Rail */}
          <div className="md:col-span-2 space-y-6">
            {isLoading ? (
              <p className="text-sm text-slate-400 font-medium">Computing schedule intervals...</p>
            ) : (
              <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-6">
                {timeline.map((day) => {
                  
                  // Color styling assignment based on milestone types
                  let markerColors = 'bg-[#6366F1] border-indigo-200 ring-indigo-100';
                  if (day.type === 'mock') markerColors = 'bg-[#F59E0B] border-amber-200 ring-amber-100';
                  if (day.type === 'final') markerColors = 'bg-[#EF4444] border-red-200 ring-red-100';

                  return (
                    <div key={day.dayNumber} className="relative pl-6 md:pl-8 group">
                      
                      {/* Timeline Dot Marker */}
                      <span className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 ring-4 transition group-hover:scale-110 ${markerColors}`} />

                      {/* Timeline content details box card */}
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3 hover:border-slate-200 transition">
                        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-50 pb-2">
                          <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                            Day {day.dayNumber} of {daysRemaining}
                          </span>
                          <h4 className="text-sm font-black text-slate-900">{day.title}</h4>
                        </div>
                        
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {day.description}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1 items-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Target Module:</span>
                          {day.focusTopics.map((topic, tIdx) => (
                            <span key={tIdx} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}