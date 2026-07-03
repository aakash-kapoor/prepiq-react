import { motion } from 'motion/react';

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
            <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#6366F1] uppercase bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full inline-block mb-6"
            >
                Next-gen AI technical interview prep
            </motion.span>

            <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.08] max-w-3xl mx-auto mb-6"
            >
                Know your weak spots{' '}
                <span className="text-[#6366F1]">before they do.</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto leading-relaxed mb-10"
            >
                Stop parsing generic question banks. PrepIQ reverse-engineers job descriptions using Gemini AI to map your exact knowledge gaps, drill them with adaptive quizzes, and build a day-by-day study sprint.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.28 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
                <button
                    onClick={onCTA}
                    className="w-full sm:w-auto bg-[#6366F1] hover:bg-indigo-600 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/[0.28] hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200"
                >
                    Start sharpening your skills — it's free
                </button>
                <a
                    href="#how-it-works"
                    className="w-full sm:w-auto text-sm font-semibold text-slate-500 hover:text-slate-800 px-6 py-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-center"
                >
                    See how it works ↓
                </a>
            </motion.div>

            {/* Stats Strip — staggered fade-in */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-14 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm"
            >
                {stats.map((stat) => (
                    <div key={stat.label} className="px-4 py-5 text-center">
                        <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 leading-snug">{stat.label}</p>
                    </div>
                ))}
            </motion.div>
        </section>
    );
}
