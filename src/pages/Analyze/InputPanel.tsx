import ProgressBar from '../../components/ProgressBar';
import Spinner from '../../components/Spinner';

interface InputPanelProps {
    company: string;
    jdText: string;
    interviewDate: string;
    isLoading: boolean;
    onCompanyChange: (value: string) => void;
    onJdTextChange: (value: string) => void;
    onInterviewDateChange: (value: string) => void;
    onAnalyze: () => void;
}

export default function InputPanel({
    company,
    jdText,
    interviewDate,
    isLoading,
    onCompanyChange,
    onJdTextChange,
    onInterviewDateChange,
    onAnalyze,
}: InputPanelProps) {
    return (
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between gap-4">
            <div className="space-y-4 flex-1 flex flex-col">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">Analyze New Role</h2>
                    <p className="text-xs text-slate-400 font-medium">Paste the company details and job description to extract core priorities.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Company Name</label>
                    <input
                        type="text"
                        placeholder="e.g., Google, Stripe, Local Startup"
                        className="w-full p-3 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 transition font-medium disabled:opacity-50 disabled:bg-slate-50"
                        value={company}
                        disabled={isLoading}
                        onChange={(e) => onCompanyChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                            Interview Date
                        </label>
                        <span className="text-[10px] text-slate-300 font-medium">optional</span>
                    </div>
                    <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={interviewDate}
                        disabled={isLoading}
                        onChange={(e) => onInterviewDateChange(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 transition font-medium text-slate-600 disabled:opacity-50 disabled:bg-slate-50 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-300 font-medium leading-snug">
                        Sets your Study Plan countdown from day one.
                    </p>
                </div>

                <div className="flex flex-col gap-1 flex-1 min-h-[320px]">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Job Description Text</label>
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-xl text-xs outline-none resize-none flex-1 focus:ring-1 focus:ring-indigo-500 transition font-medium leading-relaxed disabled:opacity-50 disabled:bg-slate-50"
                        placeholder="Paste everything from the job posting..."
                        value={jdText}
                        disabled={isLoading}
                        onChange={(e) => onJdTextChange(e.target.value)}
                    />
                </div>
            </div>

            {isLoading && (
                <ProgressBar isActive={isLoading} message="Extracting skills with Gemini" />
            )}

            <button
                onClick={onAnalyze}
                disabled={isLoading}
                className="w-full bg-[#6366F1] hover:bg-opacity-95 text-white font-bold py-3.5 px-4 rounded-xl transition disabled:opacity-50 text-xs uppercase tracking-wider shadow-md shadow-indigo-500/10 mt-2 flex items-center justify-center gap-2.5 text-center"
            >
                {isLoading && <Spinner size="sm" colorClass="text-white" />}
                <span>{isLoading ? 'Running secure tokenization extraction...' : '🔒 SECURE ENCRYPT & ANALYZE'}</span>
            </button>
        </div>
    );
}
