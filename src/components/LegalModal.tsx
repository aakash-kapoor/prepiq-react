import type { ReactNode } from 'react';

interface LegalModalProps {
    content: { title: string; body: ReactNode } | null;
    onClose: () => void;
}

export default function LegalModal({ content, onClose }: LegalModalProps) {
    if (!content) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl max-w-lg w-full shadow-xl flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-6 py-4 shrink-0">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                        {content.title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full transition shrink-0"
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto px-6 py-5 space-y-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {content.body}
                </div>
            </div>
        </div>
    );
}