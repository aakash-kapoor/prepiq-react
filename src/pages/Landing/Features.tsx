import { motion } from 'motion/react';

const features = [
    {
        accent: 'indigo',
        iconPath: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z',
        title: 'JD blueprint extraction',
        description: 'Paste any engineering role description. The parser instantly maps core priorities, nice-to-haves, and technical red flags specific to that company.',
        bgClass: 'bg-indigo-50',
        textClass: 'text-indigo-600',
        hoverBorder: 'hover:border-indigo-200',
    },
    {
        accent: 'amber',
        iconPath: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
        title: 'Adaptive quiz sandbox',
        description: 'Drill down on tailored technical cards. Rate your confidence from 1 to 5 on each concept — the system tracks every score to build your weakness profile.',
        bgClass: 'bg-amber-50',
        textClass: 'text-amber-600',
        hoverBorder: 'hover:border-amber-200',
    },
    {
        accent: 'emerald',
        iconPath: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
        title: 'Dynamic timeline planner',
        description: 'Your lowest-confidence topics get sorted and spread cleanly across custom day-by-day sprint intervals — a study schedule built for your exact interview date.',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-600',
        hoverBorder: 'hover:border-emerald-200',
    },
    {
        accent: 'rose',
        iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
        title: 'Weakness radar',
        description: 'Visual confidence charts surface your blind spots at a glance. See which topics need the most attention before you waste hours on topics you already know.',
        bgClass: 'bg-rose-50',
        textClass: 'text-rose-500',
        hoverBorder: 'hover:border-rose-200',
    },
    {
        accent: 'sky',
        iconPath: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z',
        title: 'Gemini-powered precision',
        description: 'Not keyword matching — actual reasoning. Gemini reads the full JD context, infers implicit expectations, and structures output as strict JSON for reliable parsing.',
        bgClass: 'bg-sky-50',
        textClass: 'text-sky-600',
        hoverBorder: 'hover:border-sky-200',
    },
    {
        accent: 'violet',
        iconPath: 'M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z',
        title: 'Zero setup, fully serverless',
        description: 'Sign in with Google and go. No local environment, no API key wrangling, no backend to manage. Everything runs on Firebase and Gemini with your account.',
        bgClass: 'bg-violet-50',
        textClass: 'text-violet-600',
        hoverBorder: 'hover:border-violet-200',
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' as const },
    }),
};

export default function Features() {
    return (
        <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4 }}
                className="text-center mb-12 sm:mb-16"
            >
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">System blueprint</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">Engineered to isolate gaps, optimize time.</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {features.map((f, i) => (
                    <motion.div
                        key={f.title}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-40px' }}
                        className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/[0.08] ${f.hoverBorder}`}
                    >
                        <div className={`w-10 h-10 rounded-xl ${f.bgClass} ${f.textClass} flex items-center justify-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d={f.iconPath} />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">{f.title}</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{f.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
