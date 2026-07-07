import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface SelectOption<T = any> {
  value: T;
  label: string;
}

interface CustomSelectProps<T = any> {
  label?: string;
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  horizontal?: boolean;
}

export default function CustomSelect<T = any>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className = "",
  triggerClassName = "",
  horizontal = false
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isOpen ? 'z-40' : 'z-20'} ${
        horizontal 
          ? 'flex flex-col sm:flex-row sm:items-center gap-2 sm:w-auto' 
          : 'flex flex-col gap-1.5'
      } ${className}`}
    >
      {label && (
        <span
          className={`font-bold uppercase tracking-wider shrink-0 ${
            horizontal
              ? 'text-[10px] sm:text-xs text-slate-500'
              : 'text-[10px] text-slate-400 dark:text-slate-500'
          }`}
        >
          {label}
        </span>
      )}
      <div className={`relative ${horizontal ? 'min-w-[240px] sm:min-w-[280px] max-w-full' : 'w-full'}`}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-xl text-left text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed ${triggerClassName}`}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : 'Select an option...'}
          </span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl dark:shadow-2xl z-50 max-h-60 overflow-y-auto overflow-x-hidden p-1.5 focus:outline-none"
            >
              {options.map((option, idx) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={`${idx}-${option.value}`}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-[#6366F1] dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate mr-2">
                      {option.label}
                    </span>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-[#6366F1] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
