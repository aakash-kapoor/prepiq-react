interface LegalModalProps {
    content: { title: string; text: string } | null;
    onClose: () => void;
}

export default function LegalModal({ content, onClose }: LegalModalProps) {
    if (!content) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
            <div 
                className="bg-white border border-slate-100 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 transform animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest text-indigo-600">
                        {content.title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full transition"
                    >
                        ✕
                    </button>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed whitespace-pre-line">
                    {content.text}
                </p>
            </div>
        </div>
    );
}