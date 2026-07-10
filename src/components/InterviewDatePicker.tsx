
interface InterviewDatePickerProps {
  interviewDate?: string;
  minDate: string;
  disabled?: boolean;
  isSavingDate?: boolean;
  onDateChange: (dateValue: string) => void;
  onClearDate?: () => void;
  showOptionalBadge?: boolean;
  helpText?: string;
  onError?: (message: string) => void;
}

export default function InterviewDatePicker({
  interviewDate,
  minDate,
  disabled = false,
  isSavingDate = false,
  onDateChange,
  onClearDate,
  showOptionalBadge = false,
  helpText,
  onError,
}: InterviewDatePickerProps) {
  // Format the stored ISO date string to the yyyy-MM-dd value the date input expects
  const toInputValue = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const isControlDisabled = disabled || isSavingDate;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="interview-date"
          className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
        >
          Interview Date
        </label>
        {showOptionalBadge && (
          <span className="text-[10px] text-slate-300 dark:text-slate-600 font-medium">optional</span>
        )}
        {!showOptionalBadge && interviewDate && onClearDate && (
          <button
            onClick={onClearDate}
            disabled={isControlDisabled}
            className="text-[10px] font-bold text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition disabled:opacity-50"
          >
            Clear
          </button>
        )}
      </div>
      <div className="relative">
        <input
          id="interview-date"
          type="date"
          min={minDate}
          value={toInputValue(interviewDate)}
          disabled={isControlDisabled}
          onChange={(e) => onDateChange(e.target.value)}
          onBlur={(e) => {
            if (e.target.validity.badInput) {
              onError?.("Please enter a valid interview date.");
            } else if (e.target.validity.rangeUnderflow) {
              onError?.("Interview date cannot be in the past.");
            }
          }}
          className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition disabled:opacity-60 cursor-pointer"
        />
        {isSavingDate && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          </div>
        )}
      </div>
      {helpText ? (
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-snug">
          {helpText}
        </p>
      ) : (
        !interviewDate && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-snug">
            No date set — showing default 5-day sprint. Set your interview date for a real countdown.
          </p>
        )
      )}
    </div>
  );
}
