interface HeroProps {
    onCTA: () => void;
}

const stats = [
    { value: '4', label: 'prep stages in one flow' },
    { value: '100%', label: 'serverless & free to use' },
    { value: 'Gemini', label: 'AI powering the analysis' },
];

export default function Hero({ onCTA }: HeroProps) {
    return (
        <section className="max-w-4xl mx-auto text-center px-4 sm:px-6 pt-16 sm:pt-20 pb-16 sm:pb-24">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#6366F1] uppercase bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full inline-block mb-6">
                Next-gen AI technical interview prep
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.08] max-w-3xl mx-auto mb-6">
                Know your weak spots{' '}
                <span className="text-[#6366F1]">before they do.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto leading-relaxed mb-10">
                Stop parsing generic question banks. PrepIQ reverse-engineers job descriptions using Gemini AI to map your exact knowledge gaps, drill them with adaptive quizzes, and build a day-by-day study sprint.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                    onClick={onCTA}
                    className="w-full sm:w-auto bg-[#6366F1] hover:bg-indigo-600 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    Start sharpening your skills — it's free
                </button>
                <a
                    href="#how-it-works"
                    className="w-full sm:w-auto text-sm font-semibold text-slate-500 hover:text-slate-800 px-6 py-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-center"
                >
                    See how it works ↓
                </a>
            </div>

            {/* App Preview Mockup */}
            <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-indigo-500/10 animate-section-fade overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 bg-slate-50 rounded-t-xl overflow-hidden">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <div className="mx-2 sm:mx-4 flex-1 bg-white border border-slate-100 py-0.5 rounded text-[9px] font-medium text-slate-400 text-center truncate select-none">
                        prepiq.web.app/dashboard/analyze
                    </div>
                    <div className="w-10 shrink-0 hidden sm:block" />
                </div>
                <div className="bg-[#F8FAFC] p-3 sm:p-4 rounded-b-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pointer-events-none select-none">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-2 shadow-sm">
                        <div className="h-2.5 w-2/3 bg-slate-200 rounded" />
                        <div className="h-10 w-full bg-slate-50 rounded border border-dashed border-slate-200" />
                        <div className="h-6 w-full bg-indigo-500 rounded-lg" />
                    </div>
                    <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-slate-100 space-y-3 shadow-sm">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                            <div className="h-3 w-1/3 bg-slate-200 rounded" />
                            <div className="h-3 w-12 bg-amber-100 rounded" />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold whitespace-nowrap">• React 19</span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold whitespace-nowrap">• TypeScript</span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100 font-bold whitespace-nowrap">• System Architecture</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Strip */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm">
                {stats.map((stat) => (
                    <div key={stat.label} className="px-4 py-5 text-center">
                        <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 leading-snug">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
