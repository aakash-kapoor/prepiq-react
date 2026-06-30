import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import EmptyState from '../../components/EmptyState';
import { type TopicStats } from './types';
import AppSelector from './AppSelector';
import SummaryCards from './SummaryCards';
import TopicRail from './TopicRail';

export default function Weaknesses() {
    const { user } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [topicMetrics, setTopicMetrics] = useState<TopicStats[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Sync job tracks from Firestore
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

    // Fetch and aggregate confidence metrics
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
                    difficultyBreakdown: item.difficulties,
                };
            });

            setTopicMetrics(formattedStats);
            setIsLoading(false);
        });
    }, [selectedApp, user]);

    const practicedTopics = topicMetrics.filter(t => t.avgConfidence > 0);
    const globalAvg = practicedTopics.length > 0
        ? (topicMetrics.reduce((sum, item) => sum + item.avgConfidence, 0) / practicedTopics.length).toFixed(1)
        : '0.0';

    if (!applications || applications.length === 0) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <EmptyState
                    icon="🎯"
                    title="No Weakness Metrics Found"
                    description="Your visual confidence charts and skill tracking data will display here once you seed your first workplace target application."
                />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <AppSelector
                applications={applications}
                selectedApp={selectedApp}
                onSelect={setSelectedApp}
            />

            {selectedApp && (
                <>
                    <SummaryCards topicMetrics={topicMetrics} globalAvg={globalAvg} />
                    <TopicRail topicMetrics={topicMetrics} isLoading={isLoading} />
                </>
            )}
        </div>
    );
}
