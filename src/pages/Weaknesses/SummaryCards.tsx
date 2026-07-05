import { type TopicStats } from './types';

interface SummaryCardsProps {
    topicMetrics: TopicStats[];
    globalAvg: string;
}

export default function SummaryCards({ topicMetrics, globalAvg }: SummaryCardsProps) {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const globalAvgNum = parseFloat(globalAvg);
    const strokeDashoffset = circumference - (Math.min(globalAvgNum, 5) / 5) * circumference;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm flex items-center justify-between transition hover:border-indigo-100/80 dark:hover:border-indigo-500/50">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Overall Score Index</p>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{globalAvg} <span className="text-sm font-medium text-slate-400 dark:text-slate-500">/ 5.0</span></h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">Platform baseline score benchmark</p>
                </div>
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r={radius} stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="6" fill="transparent" />
                        <circle
                            cx="40" cy="40" r={radius}
                            stroke="#6366F1" strokeWidth="6" fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-700 ease-out"
                        />
                    </svg>
                    <span className="absolute text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{Math.round((globalAvgNum / 5) * 100)}%</span>
                </div>
            </div>

            {/* Critical Gaps */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm flex items-center justify-between transition hover:border-red-100/80 dark:hover:border-red-500/50">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Critical Knowledge Gaps</p>
                    <h3 className="text-3xl font-extrabold text-red-600 dark:text-red-500 mt-1">
                        {topicMetrics.filter(t => t.avgConfidence > 0 && t.avgConfidence < 3.0).length}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">Modules rating below 3.0</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 flex items-center justify-center text-xl select-none">🚨</div>
            </div>

            {/* Topics Mastered */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm flex items-center justify-between transition hover:border-emerald-100/80 dark:hover:border-emerald-500/50">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Topics Mastered</p>
                    <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-500 mt-1">
                        {topicMetrics.filter(t => t.avgConfidence >= 4.0).length}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">Perfect validation logs</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-xl select-none">🏆</div>
            </div>
        </div>
    );
}
