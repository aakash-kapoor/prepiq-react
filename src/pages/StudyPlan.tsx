import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, onSnapshot, getDocs, doc, updateDoc } from 'firebase/firestore';
import EmptyState from '../components/EmptyState';
import { showSuccessToast, showErrorToast } from '../lib/toast';
import { StudyPlanSkeleton, StudyPlanContentSkeleton } from '../components/Skeleton';
import { useMinLoadingDelay } from '../hooks/useMinLoadingDelay';
import TrackSelector from '../components/TrackSelector';

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
const minDate = today.toISOString().split("T")[0];

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
  const [daysRemaining, setDaysRemaining] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSavingDate, setIsSavingDate] = useState(false);
  const prevSelectedAppIdRef = useRef<string | null>(null);
  const { loading: appsLoading, markDone, cancelTimer } = useMinLoadingDelay(600);

  // 1. Sync Job Applications from Firestore
  useEffect(() => {
    if (!user) return;
    const appsRef = collection(db, 'users', user.uid, 'jobApplications');
    const unsubscribe = onSnapshot(appsRef, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApp));
      setApplications(apps);
      markDone();
      if (apps.length > 0 && !selectedApp) {
        setSelectedApp(apps[0]);
      } else if (selectedApp) {
        // Keep selectedApp fresh after Firestore doc updates (e.g. after date save)
        const refreshed = apps.find(a => a.id === selectedApp.id);
        if (refreshed) setSelectedApp(refreshed);
      }
    });
    return () => { unsubscribe(); cancelTimer(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // 2. Identify Gaps & Build Timeline dynamically based on data
  useEffect(() => {
    if (!user || !selectedApp) return;

    const isTrackSwitch = prevSelectedAppIdRef.current !== null && prevSelectedAppIdRef.current !== selectedApp.id;
    prevSelectedAppIdRef.current = selectedApp.id;

    if (isTrackSwitch) {
      setIsLoading(true);
    }
    const startTime = Date.now();
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
      
      // Calculate real schedule window if an interview date is set, otherwise default to a 5-day rush sprint
      let windowSize = 5;
      if (selectedApp.interviewDate) {
        // Do NOT use Math.abs — a past date should produce a negative diff
        // and fall back to the minimum sprint, not a bogus positive window.
        const diffTime = new Date(selectedApp.interviewDate).getTime() - new Date().getTime();
        const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        windowSize = Math.max(daysUntil, 3);
      }

      // 3. Generate Custom Timeline Array Blueprint
      const generatedTimeline: TimelineDay[] = [];
      
      for (let i = 1; i <= windowSize; i++) {
        if (i === windowSize) {
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

      if (isTrackSwitch) {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 400 - elapsed);
        setTimeout(() => {
          setWeakTopics(gaps.length > 0 ? gaps : ['Core System Architecture', 'Performance Optimization']);
          setDaysRemaining(windowSize);
          setTimeline(generatedTimeline);
          setIsLoading(false);
        }, delay);
      } else {
        setWeakTopics(gaps.length > 0 ? gaps : ['Core System Architecture', 'Performance Optimization']);
        setDaysRemaining(windowSize);
        setTimeline(generatedTimeline);
        setIsLoading(false);
      }
    });

  }, [selectedApp, user]);

  // Save interview date to Firestore — onSnapshot will refresh selectedApp
  // automatically, which triggers the timeline useEffect to recompute.
  const handleInterviewDateChange = async (dateValue: string) => {
    if (!user || !selectedApp) return;

    if (!dateValue) {
      handleClearInterviewDate();
      return;
    }

    const parsedDate = new Date(dateValue);
    if (isNaN(parsedDate.getTime())) {
      showErrorToast("Please enter a valid interview date.");
      return;
    }

    if (dateValue < minDate) {
      showErrorToast("Interview date cannot be in the past.");
      return;
    }

    setIsSavingDate(true);
    try {
      const appDocRef = doc(db, 'users', user.uid, 'jobApplications', selectedApp.id);
      await updateDoc(appDocRef, { interviewDate: dateValue });
      showSuccessToast('Interview date saved — timeline updated.');
    } catch (err) {
      console.error('Failed to save interview date:', err);
      showErrorToast('Could not save the date. Please try again.');
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleClearInterviewDate = async () => {
    if (!user || !selectedApp) return;
    setIsSavingDate(true);
    try {
      const appDocRef = doc(db, 'users', user.uid, 'jobApplications', selectedApp.id);
      await updateDoc(appDocRef, { interviewDate: '' });
      showSuccessToast('Interview date cleared — using default 5-day sprint.');
    } catch (err) {
      showErrorToast('Could not clear the date. Please try again.');
    } finally {
      setIsSavingDate(false);
    }
  };

  // Format the stored ISO date string to the yyyy-MM-dd value the date input expects
  const toInputValue = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  if (appsLoading) {
    return <StudyPlanSkeleton />;
  }

  if (!applications || applications.length === 0) {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <EmptyState 
                icon="📅"
                title="No Study Plan Yet"
                description="A custom day-by-day interview preparation timeline will compile automatically once a target job description is parsed."
            />
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-wrap gap-2 items-center shadow-sm">
        <TrackSelector
          label="Job Track:"
          applications={applications}
          selectedApp={selectedApp}
          onSelect={setSelectedApp}
        />
      </div>

      {selectedApp && (
        isLoading ? (
          <StudyPlanContentSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Schedule Overview Insights Panel */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Timeline Engine</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{selectedApp.company} — {selectedApp.role}</p>
            </div>
            
            {/* Interview Date Picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="interview-date"
                  className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
                >
                  Interview Date
                </label>
                {selectedApp.interviewDate && (
                  <button
                    onClick={handleClearInterviewDate}
                    disabled={isSavingDate}
                    className="text-[10px] font-bold text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition disabled:opacity-50"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="interview-date"
                  type="date"
                  min={minDate}
                  value={toInputValue(selectedApp.interviewDate)}
                  disabled={isSavingDate}
                  onChange={(e) => handleInterviewDateChange(e.target.value)}
                  onBlur={(e) => {
                    if (e.target.validity.badInput) {
                      showErrorToast("Please enter a valid interview date.");
                    } else if (e.target.validity.rangeUnderflow) {
                      showErrorToast("Interview date cannot be in the past.");
                    }
                  }}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition disabled:opacity-60 cursor-pointer"
                />
                {isSavingDate && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                  </div>
                )}
              </div>
              {!selectedApp.interviewDate && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-snug">
                  No date set — showing default 5-day sprint. Set your interview date for a real countdown.
                </p>
              )}
            </div>

            {/* Days Remaining Card */}
            <div className={`p-4 rounded-xl space-y-1 border transition-all ${
              selectedApp.interviewDate
                ? 'bg-indigo-50/50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800'
                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-700'
            }`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${
                selectedApp.interviewDate ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
              }`}>
                {selectedApp.interviewDate ? 'Real Countdown' : 'Default Sprint'}
              </p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{daysRemaining} Days Left</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight pt-1">
                {selectedApp.interviewDate
                  ? 'Timeline is calibrated to your actual interview date.'
                  : 'Set an interview date above for a real countdown.'}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Identified Gaps to Close</h4>
              <div className="flex flex-wrap gap-1">
                {weakTopics.map((topic, idx) => (
                  <span key={idx} className="text-[11px] font-semibold bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800 px-2 py-0.5 rounded">
                    ⚠️ {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Custom Tailored SVG-Style Timeline Rail */}
          <div className="md:col-span-2 space-y-6">
            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 md:ml-6 space-y-6">
              {timeline.map((day) => {
                
                let markerColors = 'bg-[#6366F1] border-indigo-200 dark:border-indigo-800 ring-indigo-100 dark:ring-indigo-900/50';
                if (day.type === 'mock') markerColors = 'bg-[#F59E0B] border-amber-200 dark:border-amber-800 ring-amber-100 dark:ring-amber-900/50';
                if (day.type === 'final') markerColors = 'bg-[#EF4444] border-red-200 dark:border-red-800 ring-red-100 dark:ring-red-900/50';

                return (
                  <div key={day.dayNumber} className="relative pl-6 md:pl-8 group">
                    
                    {/* Timeline Dot Marker */}
                    <span className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 ring-4 transition group-hover:scale-110 ${markerColors}`} />

                    {/* Timeline content details box card */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3 hover:border-slate-200 dark:hover:border-slate-600 transition">
                      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-50 dark:border-slate-700 pb-2">
                        <span className="text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                          Day {day.dayNumber} of {daysRemaining}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">{day.title}</h4>
                      </div>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {day.description}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1 items-center">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">Target Module:</span>
                        {day.focusTopics.map((topic, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
          </div>
        )
      )}
    </div>
  );
}