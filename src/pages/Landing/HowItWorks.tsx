import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Shared browser-chrome frame                                        */
/* ------------------------------------------------------------------ */

function MockupFrame({ url, children }: { url: string; children: ReactNode }) {
    return (
        <div className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/5 overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                <div className="mx-2 sm:mx-4 flex-1 bg-white border border-slate-100 py-0.5 rounded text-[9px] font-medium text-slate-400 text-center truncate select-none">
                    {url}
                </div>
            </div>
            <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-b-xl pointer-events-none select-none">
                {children}
            </div>
        </div>
    );
}

function Bar({ w = 'w-full', h = 'h-2.5', className = '' }: { w?: string; h?: string; className?: string }) {
    return <div className={`${h} ${w} bg-slate-200 rounded ${className}`} />;
}

/* ------------------------------------------------------------------ */
/* Step 1 — Paste the job description                                 */
/* ------------------------------------------------------------------ */

function JDInputMockup() {
    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-4">
            <div className="space-y-1.5">
                <Bar w="w-1/3" h="h-3" />
                <Bar w="w-2/3" h="h-2" className="bg-slate-100" />
            </div>

            <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Company Name</p>
                <div className="h-8 rounded-lg border border-slate-200 flex items-center px-3">
                    <p className="text-xs font-semibold text-slate-700">Indeed</p>
                </div>
            </div>

            <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Job Description Text</p>
                <div className="rounded-lg border border-slate-200 p-3 space-y-2">
                    <Bar w="w-1/4" h="h-2" />
                    <Bar w="w-full" h="h-2" className="bg-slate-100" />
                    <Bar w="w-11/12" h="h-2" className="bg-slate-100" />
                    <Bar w="w-full" h="h-2" className="bg-slate-100" />
                    <Bar w="w-3/4" h="h-2" className="bg-slate-100" />
                </div>
            </div>

            <div className="h-9 rounded-lg bg-[#6366F1] flex items-center justify-center">
                <p className="text-[10px] font-bold text-white tracking-wide">🔒 SECURE ENCRYPT &amp; ANALYZE</p>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Step 2 — Get your knowledge map                                    */
/* ------------------------------------------------------------------ */

function KnowledgeMapMockup() {
    const core = ['Java', 'React', 'Microservices', 'System Design', 'HTML/CSS', 'JavaScript'];
    const nice = ['Kotlin', 'Mentorship', 'Adaptability'];

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-4">
            <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-emerald-500">Analysis Complete ✓</p>
                    <Bar w="w-32" h="h-3" />
                </div>
                <div className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-1">
                    MID-LEVEL
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Core Skills Required</p>
                <div className="flex flex-wrap gap-1.5">
                    {core.map((tag) => (
                        <span
                            key={tag}
                            className="text-[9px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold whitespace-nowrap"
                        >
                            • {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Nice to Have</p>
                <div className="flex flex-wrap gap-1.5">
                    {nice.map((tag) => (
                        <span
                            key={tag}
                            className="text-[9px] px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-bold whitespace-nowrap"
                        >
                            • {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="rounded-lg bg-rose-50 border border-rose-100 p-2.5 space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-rose-400">⚠ Red Flag Identified</p>
                <Bar w="w-full" h="h-1.5" className="bg-rose-100" />
                <Bar w="w-4/5" h="h-1.5" className="bg-rose-100" />
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Step 3 — Drill your weak spots                                     */
/* ------------------------------------------------------------------ */

function QuizMockup() {
    const scores = [
        { n: 1, tone: 'bg-rose-50 text-rose-500 border-rose-100' },
        { n: 2, tone: 'bg-rose-50 text-rose-500 border-rose-100' },
        { n: 3, tone: 'bg-amber-50 text-amber-600 border-amber-100' },
        { n: 4, tone: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
        { n: 5, tone: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    ];

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-slate-500">
                    Session Track: <span className="text-slate-800">Indeed</span>
                </p>
                <span className="text-[9px] font-bold text-rose-500 bg-rose-50 border border-rose-100 rounded-full px-2 py-1">
                    ● END SESSION
                </span>
            </div>

            <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-semibold text-slate-400">
                    <span>Drill Progress</span>
                    <span>Question 1 of 20</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[5%] bg-[#6366F1]" />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3">
                <div className="flex gap-1.5">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold">
                        JAVA, HIGH-PERFORMANCE SYSTEMS
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100 font-bold">
                        HARD
                    </span>
                </div>
                <div className="space-y-1.5">
                    <Bar w="w-full" h="h-2.5" className="bg-slate-300" />
                    <Bar w="w-4/5" h="h-2.5" className="bg-slate-300" />
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-1.5">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                        Ideal Structured Target Response
                    </p>
                    <Bar w="w-full" h="h-1.5" />
                    <Bar w="w-full" h="h-1.5" />
                    <Bar w="w-2/3" h="h-1.5" />
                </div>
                <div className="pt-2 border-t border-slate-50 space-y-2">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 text-center">
                        Rate Your Technical Confidence
                    </p>
                    <div className="flex gap-1.5">
                        {scores.map((s) => (
                            <div
                                key={s.n}
                                className={`flex-1 h-7 rounded-lg border flex items-center justify-center text-[10px] font-bold ${s.tone}`}
                            >
                                {s.n}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Step 4 — Follow your study plan                                    */
/* ------------------------------------------------------------------ */

function StudyPlanMockup() {
    const days = [
        { label: 'DAY 1 OF 14', tag: 'React, Reliable Systems' },
        { label: 'DAY 2 OF 14', tag: 'Communication, Design Review' },
        { label: 'DAY 3 OF 14', tag: 'System Design, Analytics' },
    ];

    return (
        <div className="grid grid-cols-5 gap-3">
            <div className="col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-3 space-y-3">
                <Bar w="w-2/3" h="h-3" />
                <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-2.5 space-y-1">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-indigo-400">Real Countdown</p>
                    <p className="text-lg font-black text-slate-900 leading-none">14 Days</p>
                </div>
                <div className="space-y-1.5">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Gaps to Close</p>
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="rounded-md bg-rose-50 border border-rose-100 px-2 py-1.5">
                            <Bar w="w-full" h="h-1.5" className="bg-rose-100" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-span-3 space-y-2.5">
                {days.map((d) => (
                    <div key={d.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{d.label}</p>
                            <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
                        </div>
                        <Bar w="w-full" h="h-1.5" className="bg-slate-100" />
                        <span className="inline-block text-[8px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">
                            {d.tag}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Step config + section                                              */
/* ------------------------------------------------------------------ */

const steps = [
    {
        number: '01',
        title: 'Paste the job description',
        description:
            'Drop in any software engineering JD — full-time, contract, or internship. PrepIQ handles the rest.',
        url: 'prepiq.web.app/dashboard/analyze',
        mockup: <JDInputMockup />,
    },
    {
        number: '02',
        title: 'Get your knowledge map',
        description:
            'Gemini AI reverse-engineers the role into a ranked list of topics, separating must-haves from nice-to-haves.',
        url: 'prepiq.web.app/dashboard/analyze',
        mockup: <KnowledgeMapMockup />,
    },
    {
        number: '03',
        title: 'Drill your weak spots',
        description:
            'Work through adaptive flashcard quizzes and rate your confidence on each topic from 1 to 5.',
        url: 'prepiq.web.app/dashboard/quiz-session',
        mockup: <QuizMockup />,
    },
    {
        number: '04',
        title: 'Follow your study plan',
        description:
            'A day-by-day sprint timeline is generated from your lowest-confidence areas — right up to interview day.',
        url: 'prepiq.web.app/dashboard/study-plan',
        mockup: <StudyPlanMockup />,
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-white border-y border-gray-100 py-16 sm:py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16 sm:mb-24">
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                        The workflow
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                        From job description to offer-ready in four steps.
                    </h2>
                </div>

                <div className="flex flex-col gap-16 sm:gap-24">
                    {steps.map((step, i) => {
                        const reversed = i % 2 === 1;
                        return (
                            <div
                                key={step.number}
                                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                                    reversed ? 'lg:[&>*:first-child]:order-2' : ''
                                }`}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.45 }}
                                    className="space-y-4"
                                >
                                    <div className="text-4xl font-black text-indigo-100 tracking-tighter leading-none">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-md">
                                        {step.description}
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    <MockupFrame url={step.url}>{step.mockup}</MockupFrame>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}