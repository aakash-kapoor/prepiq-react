import { type TimelineDay } from '../context/JobApplicationContext';

interface TimelineCardProps {
  day: TimelineDay;
  totalDays: number;
}

export default function TimelineCard({ day, totalDays }: TimelineCardProps) {
  let markerColors = 'bg-[#6366F1] border-indigo-200 dark:border-indigo-800 ring-indigo-100 dark:ring-indigo-900/50';
  if (day.type === 'mock') markerColors = 'bg-[#F59E0B] border-amber-200 dark:border-amber-800 ring-amber-100 dark:ring-amber-900/50';
  if (day.type === 'final') markerColors = 'bg-[#EF4444] border-red-200 dark:border-red-800 ring-red-100 dark:ring-red-900/50';

  return (
    <div className="relative pl-6 md:pl-8 group">
      {/* Timeline Dot Marker */}
      <span className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 ring-4 transition group-hover:scale-110 ${markerColors}`} />

      {/* Timeline content details box card */}
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3 hover:border-slate-200 dark:hover:border-slate-600 transition">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-50 dark:border-slate-700 pb-2">
          <span className="text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Day {day.dayNumber} of {totalDays}
          </span>
          <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">{day.title}</h4>
        </div>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {day.description}
        </p>

        <div className="flex flex-wrap gap-1 pt-1 items-center">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">Target Module:</span>
          {day.focusTopics.map((topic, tIdx) => (
            <span key={tIdx} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
