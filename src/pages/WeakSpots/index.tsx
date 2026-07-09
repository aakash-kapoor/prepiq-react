import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
// import { db } from '../../config/firebase';
// import { collection } from 'firebase/firestore';
import EmptyState from '../../components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { type TopicStats } from './types';
import TrackSelector from '../../components/TrackSelector';
import SummaryCards from './SummaryCards';
import TopicRail from './TopicRail';
import { WeakSpotsSkeleton, WeakSpotsContentSkeleton } from '../../components/Skeleton';
import { useMinLoadingDelay } from '../../hooks/useMinLoadingDelay';
import { useJobApplications } from '../../context/JobApplicationContext';

export default function WeakSpots() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { applications, loading: appsLoading } = useJobApplications();
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [topicMetrics, setTopicMetrics] = useState<TopicStats[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasTopicScores, setHasTopicScores] = useState<boolean>(true);
    const { loading: componentLoading, markDone, cancelTimer } = useMinLoadingDelay(600);
    const prevSelectedAppIdRef = useRef<string | null>(null);

    // Sync job tracks from Context
    useEffect(() => {
        if (appsLoading) return;
        markDone();

        if (applications.length > 0 && !selectedApp) {
            setSelectedApp(applications[0]);
        } else if (selectedApp) {
            const refreshed = applications.find(a => a.id === selectedApp.id);
            if (refreshed && JSON.stringify(refreshed) !== JSON.stringify(selectedApp)) {
                setSelectedApp(refreshed);
            }
        }

        return () => cancelTimer();
    }, [applications, appsLoading, markDone, cancelTimer, selectedApp]);

    // Fetch and aggregate confidence metrics
    useEffect(() => {
        if (!user || !selectedApp) return;

        const isTrackSwitch = prevSelectedAppIdRef.current !== null && prevSelectedAppIdRef.current !== selectedApp.id;
        prevSelectedAppIdRef.current = selectedApp.id;

        if (isTrackSwitch) {
            setIsLoading(true);
        }
        const topicScores = selectedApp.topicScores;

        if (!topicScores) {
            setHasTopicScores(false);
            setTopicMetrics([]);
            if (isTrackSwitch) {
                setTimeout(() => setIsLoading(false), 400);
            } else {
                setIsLoading(false);
            }
            return;
        }

        setHasTopicScores(true);

        const formattedStats: TopicStats[] = Object.keys(topicScores).map(topicName => {
            const item = topicScores[topicName];
            return {
                topic: topicName,
                totalQuestions: item.count,
                avgConfidence: item.count > 0 ? parseFloat((item.sum / item.count).toFixed(1)) : 0,
                difficultyBreakdown: {}, // we don't track difficulty breakdown in topicScores right now
            };
        });

        if (isTrackSwitch) {
            setTimeout(() => {
                setTopicMetrics(formattedStats);
                setIsLoading(false);
            }, 400);
        } else {
            setTopicMetrics(formattedStats);
            setIsLoading(false);
        }
    }, [selectedApp, user]);

    const practicedTopics = topicMetrics.filter(t => t.avgConfidence > 0);
    const globalAvg = practicedTopics.length > 0
        ? (topicMetrics.reduce((sum, item) => sum + item.avgConfidence, 0) / practicedTopics.length).toFixed(1)
        : '0.0';

    if (componentLoading || appsLoading) {
        return <WeakSpotsSkeleton />;
    }

    if (!applications || applications.length === 0) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <EmptyState
                    icon="🎯"
                    title="No Weak Spot Data Yet"
                    description="Your visual confidence charts and skill tracking data will display here once you seed your first workplace target application."
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
                isLoading ? (
                    <WeakSpotsContentSkeleton />
                ) : !hasTopicScores ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-12 mt-8">
                        <EmptyState
                            icon="🚀"
                            title="We've upgraded our tracking engine!"
                            description="Complete one new quiz in this track to instantly calibrate your weak spots and unlock your custom study plan."
                            actionText="Launch Quiz"
                            onAction={() => navigate('/dashboard/quiz', { state: { preSelectedAppId: selectedApp.id } })}
                        />
                    </div>
                ) : (
                    <>
                        <SummaryCards topicMetrics={topicMetrics} globalAvg={globalAvg} />
                        <TopicRail topicMetrics={topicMetrics} isLoading={isLoading} />
                    </>
                )
            )}
        </div>
    );
}