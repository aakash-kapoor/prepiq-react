export interface TopicStats {
    topic: string;
    totalQuestions: number;
    avgConfidence: number;
    difficultyBreakdown: { [key: string]: number };
}

export interface StatusConfig {
    label: string;
    color: string;
    barColor: string;
    strokeColor: string;
}

export function getStatusConfig(score: number): StatusConfig {
    if (score === 0) return { label: 'Unpracticed', color: 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700', barColor: 'bg-slate-300 dark:bg-slate-600', strokeColor: '#CBD5E1' };
    if (score < 3.0) return { label: 'Critical Gap', color: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800', barColor: 'bg-[#EF4444]', strokeColor: '#EF4444' };
    if (score < 4.0) return { label: 'Needs Work', color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800', barColor: 'bg-[#F59E0B]', strokeColor: '#F59E0B' };
    return { label: 'Mastered', color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800', barColor: 'bg-[#10B981]', strokeColor: '#10B981' };
}