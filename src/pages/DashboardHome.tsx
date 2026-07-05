import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { DashboardSkeleton } from '../components/Skeleton';
import { useMinLoadingDelay } from '../hooks/useMinLoadingDelay';
import DeleteJobModal from '../components/DeleteJobModal';
import { deleteJobApplication } from '../lib/deleteUserData';
import { showSuccessToast, showErrorToast } from '../lib/toast';

interface JobApp {
  id: string;
  company: string;
  role: string;
  estimatedDifficulty: string;
  overallProgress: number;
  extractedSkills: any[];
  focusAreas: string[];
}

/** Spring-animated counter that counts up when value changes */
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const spring = useSpring(0, { damping: 30, stiffness: 120 });
  const display = useTransform(spring, (v) =>
    Number.isInteger(value) ? Math.round(v) : parseFloat(v.toFixed(1))
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState<JobApp[]>([]);
  const { loading, markDone, cancelTimer } = useMinLoadingDelay(600);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [globalAvgConfidence, setGlobalAvgConfidence] = useState<number>(0);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<JobApp | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch real-time job applications tracker ledger (lightweight — no subcollection reads here)
  useEffect(() => {
    if (!user) return;

    const appsRef = collection(db, 'users', user.uid, 'jobApplications');
    const unsubscribe = onSnapshot(appsRef, (snapshot) => {
      const appsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApp));
      setApplications(appsList);
      markDone();
    });

    return () => { unsubscribe(); cancelTimer(); };
  }, [user]);

  // 2. Aggregate question stats separately — only re-runs when the applications list changes.
  // Keeping this outside onSnapshot prevents a Firestore read storm (N getDocs calls
  // firing every time any single jobApplication doc is updated).
  useEffect(() => {
    if (!user || applications.length === 0) {
      setTotalQuestions(0);
      setGlobalAvgConfidence(0);
      return;
    }

    let cancelled = false;

    const fetchStats = async () => {
      let questionCounter = 0;
      let totalConfidenceSum = 0;
      let ratedQuestionsCount = 0;

      for (const app of applications) {
        const qRef = collection(db, 'users', user.uid, 'jobApplications', app.id, 'questions');
        const qSnapshot = await getDocs(qRef);
        if (cancelled) return; // Component unmounted or deps changed — discard result
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
    };

    fetchStats();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, applications.length]);

  const handleDeleteConfirm = async () => {
    if (!user || !deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteJobApplication(user.uid, deleteTarget.id);
      showSuccessToast(`${deleteTarget.role} at ${deleteTarget.company} removed.`);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete job application:', err);
      showErrorToast('Could not remove this application. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, duration: 0.3, ease: 'easeOut' as const },
    }),
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-1 md:px-0">

      {/* Dynamic Header Badge Text Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Good morning, {user?.displayName?.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            You have <span className="text-[#6366F1] font-semibold">{applications.length} active roles</span> tracking. Keep sharpening your weak spots.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/analyze')}
          className="text-xs font-bold bg-[#6366F1] hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/10 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 self-start sm:self-auto"
        >
          Analyze New JD →
        </button>
      </div>

      {/* 2. RESPONSIVE DYNAMIC STAT CARDS METRIC ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Active JDs',
            value: <AnimatedNumber value={applications.length} className="text-2xl font-extrabold text-slate-900 dark:text-slate-100" />,
            sub: 'In compilation sync pipeline',
          },
          {
            label: 'Questions Sourced',
            value: <AnimatedNumber value={totalQuestions} className="text-2xl font-extrabold text-slate-900 dark:text-slate-100" />,
            sub: 'Across all targets',
          },
          {
            label: 'Avg Confidence',
            value: <AnimatedNumber value={globalAvgConfidence || 0} className="text-2xl font-extrabold text-[#6366F1]" />,
            sub: '/ 5.0 target benchmark',
          },
          {
            label: 'Next Target',
            value: (
              <h3
                className="text-xl font-extrabold text-orange-500 mt-1.5 truncate"
                title={applications[0]?.company || 'None Active'}
              >
                {applications[0]?.company || 'None Active'}
              </h3>
            ),
            sub: 'Ready for drill routines',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm"
          >
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <div className="mt-1">{stat.value}</div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* 3. FLUID ACTIVE JOB TRACKS CONTAINER */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Job Preparations</h3>

        <AnimatePresence mode="popLayout">
          {applications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-dashed border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-12 text-center text-slate-400 dark:text-slate-500 text-sm font-medium"
            >
              No tracked applications active. Click "Analyze New JD" above to seed your platform metrics!
            </motion.div>
          ) : (
            /* Grid auto-adjusts cleanly: 1 column on mobile screens, 2 columns on desktops */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app, index) => {

                const difficulty = app.estimatedDifficulty?.toLowerCase() || 'mid-level';

                // Fallback style (Mid-Level / Medium)
                let accentStyles = {
                  borderTop: 'border-t-4 border-t-[#F97316] dark:border-t-[#F97316]',
                  badge: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
                };

                if (difficulty.includes('senior') || difficulty.includes('hard')) {
                  accentStyles = {
                    borderTop: 'border-t-4 border-t-[#EF4444] dark:border-t-[#EF4444]',
                    badge: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                  };
                } else if (difficulty.includes('easy') || difficulty.includes('junior') || difficulty.includes('green')) {
                  accentStyles = {
                    borderTop: 'border-t-4 border-t-[#10B981] dark:border-t-[#10B981]',
                    badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  };
                } else if (difficulty.includes('mid') || difficulty.includes('medium')) {
                  accentStyles = {
                    borderTop: 'border-t-4 border-t-[#F97316] dark:border-t-[#F97316]',
                    badge: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
                  };
                }

                return (
                  <motion.div
                    key={app.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                    className={`bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/[0.10] transition-all duration-200 ${accentStyles.borderTop}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base tracking-tight leading-tight truncate">{app.role}</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-400 font-medium mt-0.5">{app.company}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[9px] font-extrabold border px-2 py-0.5 rounded-md uppercase tracking-wider ${accentStyles.badge}`}>
                          {app.estimatedDifficulty || 'Mid-Level'}
                        </span>
                        {/* Delete trigger — small, unobtrusive, never accidental */}
                        <button
                          onClick={() => setDeleteTarget(app)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-150"
                          title="Remove application"
                          aria-label={`Remove ${app.role} at ${app.company}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Progress metrics bars section */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400 dark:text-slate-500 font-medium text-[11px]">Skill Extraction Weight</span>
                        <span>{app.extractedSkills?.length || 0} Badges Logged</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-[#6366F1] h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((app.extractedSkills?.length || 0) * 4, 100)}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.07 + 0.2 }}
                        />
                      </div>
                    </div>

                    {/* Navigation Actions Footer Strip matching wireframe layouts */}
                    <div className="pt-3 border-t border-gray-50 dark:border-slate-700 flex items-center justify-between mt-1">
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        🎯 {app.focusAreas?.length || 0} Core Evaluation Hubs
                      </span>
                      <button
                        onClick={() => navigate('/dashboard/questions', {
                          state: { preSelectedAppId: app.id }
                        })}
                        className="text-xs font-bold text-[#6366F1] hover:text-indigo-700 hover:translate-x-0.5 transition-all duration-150 flex items-center gap-0.5"
                      >
                        View Insights & Practice →
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete confirmation modal — rendered via portal, outside card stacking context */}
      <DeleteJobModal
        open={deleteTarget !== null}
        deleting={isDeleting}
        company={deleteTarget?.company ?? ''}
        role={deleteTarget?.role ?? ''}
        onCancel={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  );
}