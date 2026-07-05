import ProgressBar from '../../components/ProgressBar';
import Spinner from '../../components/Spinner';
import { showErrorToast } from '../../lib/toast';

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

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

const minDate = today.toISOString().split("T")[0];

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
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm flex flex-col justify-between gap-4">
            <div className="space-y-4 flex-1 flex flex-col">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">Analyze a New Role</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Paste the company details and job description to extract core priorities.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Company Name</label>
                    <input
                        type="text"
                        placeholder="e.g., Google, Stripe, Local Startup"
                        className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 transition font-medium disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900/50 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                        value={company}
                        disabled={isLoading}
                        onChange={(e) => onCompanyChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                            Interview Date
                        </label>
                        <span className="text-[10px] text-slate-300 dark:text-slate-600 font-medium">optional</span>
                    </div>
                    <input
                    type="date"
                    value={interviewDate}
                    min={minDate}
                    disabled={isLoading}
                    onChange={(e) => onInterviewDateChange(e.target.value)}
                    onBlur={(e) => {
                        if (e.target.validity.badInput) {
                            showErrorToast("Please enter a valid interview date.");
                        } else if (e.target.validity.rangeUnderflow) {
                            showErrorToast("Interview date cannot be in the past.");
                        }
                    }}
                    className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 transition font-medium text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900/50 cursor-pointer bg-white dark:bg-slate-900"
                    />
                    <p className="text-[10px] text-slate-300 dark:text-slate-500 font-medium leading-snug">
                        Sets your Study Plan countdown from day one.
                    </p>
                </div>

                <div className="flex flex-col gap-1 flex-1 min-h-[320px]">
                    <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Job Description Text</label>
                    <textarea
                        className="w-full p-4 border border-gray-200 dark:border-slate-700 rounded-xl text-xs outline-none resize-none flex-1 focus:ring-1 focus:ring-indigo-500 transition font-medium leading-relaxed disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900/50 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
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
                <span>{isLoading ? 'Analyzing with Gemini...' : 'Analyze Job Description'}</span>
            </button>
        </div>
    );
}