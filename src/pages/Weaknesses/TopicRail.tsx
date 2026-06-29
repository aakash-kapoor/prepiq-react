import { type TopicStats, getStatusConfig } from './types';

interface TopicRailProps {
    topicMetrics: TopicStats[];
    isLoading: boolean;
}

export default function TopicRail({ topicMetrics, isLoading }: TopicRailProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="mb-6">
                <h3 className="text-base font-bold text-slate-900">Topic-Wise Technical Confidence Index</h3>
                <p className="text-xs text-gray-500 mt-0.5">Calculated in real time based on your manual confidence evaluations.</p>
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
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 items-center gap-3 border-b border-gray-50 pb-4 last:border-0 last:pb-0 group">

                                {/* Topic metadata */}
                                <div className="flex items-center gap-3 md:col-span-2 min-w-0">
                                    <div className="relative w-10 h-10 flex items-center justify-center shrink-0 hidden sm:flex">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="20" cy="20" r="16" stroke="#F1F5F9" strokeWidth="3" fill="transparent" />
                                            <circle
                                                cx="20" cy="20" r="16"
                                                stroke={currentStatus.strokeColor}
                                                strokeWidth="3" fill="transparent"
                                                strokeDasharray={2 * Math.PI * 16}
                                                strokeDashoffset={2 * Math.PI * 16 - (Math.min(item.avgConfidence, 5) / 5) * (2 * Math.PI * 16)}
                                                className="transition-all duration-500"
                                            />
                                        </svg>
                                        <span className="absolute text-[9px] font-black text-slate-700">{item.avgConfidence || '—'}</span>
                                    </div>
                                    <div className="min-w-0 pr-2">
                                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors break-words leading-tight">
                                            {item.topic}
                                        </p>
                                        <p className="text-[11px] text-gray-400 font-semibold mt-0.5 whitespace-nowrap">
                                            {item.totalQuestions} active questions logged
                                        </p>
                                    </div>
                                </div>

                                {/* Status pill */}
                                <div className="md:col-span-1 flex items-center -mt-1 md:mt-0">
                                    <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md border inline-block ${currentStatus.color}`}>
                                        {currentStatus.label}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="md:col-span-2 space-y-1.5 w-full col-span-1 sm:col-span-2 md:col-span-2">
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
    );
}
