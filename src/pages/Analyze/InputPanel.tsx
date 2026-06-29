interface InputPanelProps {
    company: string;
    jdText: string;
    isLoading: boolean;
    validationError: string | null;
    apiError: string | null;
    successMessage: string | null;
    onCompanyChange: (value: string) => void;
    onJdTextChange: (value: string) => void;
    onAnalyze: () => void;
}

export default function InputPanel({
    company,
    jdText,
    isLoading,
    validationError,
    apiError,
    successMessage,
    onCompanyChange,
    onJdTextChange,
    onAnalyze,
}: InputPanelProps) {
    return (
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between gap-4">
            <div className="space-y-4 flex-1 flex flex-col">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">Analyze New Role</h2>
                    <p className="text-xs text-slate-400 font-medium">Paste the company details and job description to extract core priorities.</p>
                </div>

                {(validationError || apiError) && (
                    <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl text-xs font-medium animate-fadeIn">
                        {validationError || apiError}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-semibold animate-fadeIn">
                        {successMessage}
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Company Name</label>
                    <input
                        type="text"
                        placeholder="e.g., Google, Stripe, Local Startup"
                        className="w-full p-3 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 transition font-medium"
                        value={company}
                        onChange={(e) => onCompanyChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1 flex-1 min-h-[320px]">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Job Description Text</label>
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-xl text-xs outline-none resize-none flex-1 focus:ring-1 focus:ring-indigo-500 transition font-medium leading-relaxed"
                        placeholder="Paste everything from the job posting..."
                        value={jdText}
                        onChange={(e) => onJdTextChange(e.target.value)}
                    />
                </div>
            </div>

            <button
                onClick={onAnalyze}
                disabled={isLoading}
                className="w-full bg-[#6366F1] hover:bg-opacity-95 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-50 text-xs uppercase tracking-wider shadow-md shadow-indigo-500/10 mt-2"
            >
                {isLoading ? 'Running secure tokenization extraction...' : '🔒 SECURE ENCRYPT & ANALYZE'}
            </button>
        </div>
    );
}
