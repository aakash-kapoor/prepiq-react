import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
    title: string;
    description: string;
    icon: string;
    actionText?: string;
    onAction?: () => void;
}

export default function EmptyState({
    title,
    description,
    icon,
    actionText = "Analyze First Role",
    onAction,
}: EmptyStateProps) {
    const navigate = useNavigate();

    const handleAction = onAction || (() => navigate('/dashboard/analyze'));

    return (
        <div className="flex flex-col items-center justify-center text-center p-12 max-w-sm mx-auto my-16 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm animate-fadeIn">
            <span className="text-5xl mb-4 select-none">{icon}</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>
            <p className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed">
                {description}
            </p>
            <button
                onClick={handleAction}
                className="mt-5 bg-[#6366F1] hover:bg-opacity-95 text-white font-bold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-500/10"
            >
                {actionText}
            </button>
        </div>
    );
}