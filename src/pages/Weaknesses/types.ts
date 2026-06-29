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
    if (score === 0) return { label: 'Unpracticed', color: 'text-slate-400 bg-slate-50 border-slate-200', barColor: 'bg-slate-300', strokeColor: '#CBD5E1' };
    if (score < 3.0) return { label: 'Critical Gap', color: 'text-red-700 bg-red-50 border-red-200', barColor: 'bg-[#EF4444]', strokeColor: '#EF4444' };
    if (score < 4.0) return { label: 'Needs Work', color: 'text-amber-700 bg-amber-50 border-amber-200', barColor: 'bg-[#F59E0B]', strokeColor: '#F59E0B' };
    return { label: 'Mastered', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', barColor: 'bg-[#10B981]', strokeColor: '#10B981' };
}
