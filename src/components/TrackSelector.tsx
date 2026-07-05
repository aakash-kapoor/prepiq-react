import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TrackSelectorProps {
  label?: string;
  applications: any[];
  selectedApp: any;
  onSelect: (app: any) => void;
}

export default function TrackSelector({
  label = "Select Target Track:",
  applications,
  selectedApp,
  onSelect
}: TrackSelectorProps) {
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

  return (
    <div ref={containerRef} className="relative z-20 flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
      {label && (
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
          {label}
        </span>
      )}
      <div className="relative min-w-[240px] sm:min-w-[280px] max-w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-xl text-left text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <span className="truncate">
            {selectedApp ? `${selectedApp.company} — ${selectedApp.role}` : 'Select a target track...'}
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
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl dark:shadow-2xl z-30 max-h-60 overflow-y-auto overflow-x-hidden p-1.5 focus:outline-none"
            >
              {applications.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      onSelect(app);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-[#6366F1] dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate mr-2">
                      {app.company} — {app.role}
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
