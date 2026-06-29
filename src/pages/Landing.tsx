import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleCTA = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    const steps = [
        {
            number: '01',
            title: 'Paste the job description',
            description: 'Drop in any software engineering JD — full-time, contract, or internship. PrepIQ handles the rest.',
        },
        {
            number: '02',
            title: 'Get your knowledge map',
            description: 'Gemini AI reverse-engineers the role into a ranked list of topics, separating must-haves from nice-to-haves.',
        },
        {
            number: '03',
            title: 'Drill your weak spots',
            description: 'Work through adaptive flashcard quizzes and rate your confidence on each topic from 1 to 5.',
        },
        {
            number: '04',
            title: 'Follow your study plan',
            description: 'A day-by-day sprint timeline is generated from your lowest-confidence areas — right up to interview day.',
        },
    ];

    const stats = [
        { value: '4', label: 'prep stages in one flow' },
        { value: '100%', label: 'serverless & free to use' },
        { value: 'Gemini', label: 'AI powering the analysis' },
    ];

    const features = [
        {
            accent: 'indigo',
            iconPath: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z',
            title: 'JD blueprint extraction',
            description:
                'Paste any engineering role description. The parser instantly maps core priorities, nice-to-haves, and technical red flags specific to that company.',
            bgClass: 'bg-indigo-50',
            textClass: 'text-indigo-600',
            hoverBorder: 'hover:border-indigo-200',
        },
        {
            accent: 'amber',
            iconPath: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
            title: 'Adaptive quiz sandbox',
            description:
                'Drill down on tailored technical cards. Rate your confidence from 1 to 5 on each concept — the system tracks every score to build your weakness profile.',
            bgClass: 'bg-amber-50',
            textClass: 'text-amber-600',
            hoverBorder: 'hover:border-amber-200',
        },
        {
            accent: 'emerald',
            iconPath:
                'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
            title: 'Dynamic timeline planner',
            description:
                'Your lowest-confidence topics get sorted and spread cleanly across custom day-by-day sprint intervals — a study schedule built for your exact interview date.',
            bgClass: 'bg-emerald-50',
            textClass: 'text-emerald-600',
            hoverBorder: 'hover:border-emerald-200',
        },
        {
            accent: 'rose',
            iconPath:
                'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
            title: 'Weakness radar',
            description:
                'Visual confidence charts surface your blind spots at a glance. See which topics need the most attention before you waste hours on topics you already know.',
            bgClass: 'bg-rose-50',
            textClass: 'text-rose-500',
            hoverBorder: 'hover:border-rose-200',
        },
        {
            accent: 'sky',
            iconPath:
                'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z',
            title: 'Gemini-powered precision',
            description:
                'Not keyword matching — actual reasoning. Gemini reads the full JD context, infers implicit expectations, and structures output as strict JSON for reliable parsing.',
            bgClass: 'bg-sky-50',
            textClass: 'text-sky-600',
            hoverBorder: 'hover:border-sky-200',
        },
        {
            accent: 'violet',
            iconPath:
                'M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z',
            title: 'Zero setup, fully serverless',
            description:
                'Sign in with Google and go. No local environment, no API key wrangling, no backend to manage. Everything runs on Firebase and Gemini with your account.',
            bgClass: 'bg-violet-50',
            textClass: 'text-violet-600',
            hoverBorder: 'hover:border-violet-200',
        },
    ];

    const changelog = [
        {
            version: 'v0.4.0',
            date: 'Jun 28, 2026',
            title: 'Landing and login page redesign',
            description: 'Overhauled the landing page with a sticky frosted navbar, how-it-works section, stats strip, 6-feature grid, and a full-width CTA banner. Login page now includes trust signal pills, SVG icons, and an improved dark right panel.',
            tags: ['feat', 'ui', 'responsive']
        },
        {
            version: 'v0.3.2',
            date: 'Jun 27, 2026',
            title: 'Firebase Hosting target configured',
            description: 'Pointed deployment to prep-iq.web.app via hosting target in .firebaserc. Added .firebase/ cache folder to .gitignore.',
            tags: ['chore', 'deploy']
        },
        {
            version: 'v0.3.1',
            date: 'Jun 27, 2026',
            title: 'SEO meta tags and smooth scroll',
            description: 'Added Open Graph, Twitter Card, and keyword meta tags to index.html. Enabled smooth anchor scrolling via scroll-behavior: smooth. Fixed misplaced meta tags that were outside <head>.',
            tags: ['fix', 'seo']
        },
        {
            version: 'v0.3.0',
            date: 'Jun 26, 2026',
            title: 'TypeScript errors resolved',
            description: 'Fixed unused PlaceholderPage declaration, missing JSX namespace reference in App.tsx, and unused trackOffset variable in Weaknesses.tsx.',
            tags: ['fix', 'typescript']
        },
        {
            version: 'v0.2.0',
            date: 'Jun 25, 2026',
            title: 'README and project documentation',
            description: 'Replaced default Vite README with full project documentation — tech stack table, setup instructions, environment variables, folder structure, and contributing guide.',
            tags: ['docs']
        },
        {
            version: 'v0.1.0',
            date: 'Jun 24, 2026',
            title: 'Initial release',
            description: 'First working version of PrepIQ. Includes JD analysis with Gemini AI, adaptive quiz sandbox, weakness radar, and day-by-day study plan. Fully serverless on Firebase and Firestore.',
            tags: ['feat', 'launch']
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 selection:bg-indigo-100">

            {/* NAVBAR */}
            <header className="sticky top-0 z-50 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-gray-100/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#6366F1] rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shadow-indigo-500/20">
                            IQ
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900">PrepIQ</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <a
                            href="#how-it-works"
                            className="text-[10px] sm:text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                        >
                            How it works
                        </a>
                        <a
                            href="#features"
                            className="text-[10px] sm:text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                        >
                            Features
                        </a>
                        <button
                            onClick={handleCTA}
                            className="text-[10px] sm:text-xs font-bold bg-[#6366F1] hover:bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-xl shadow-sm shadow-indigo-500/20 transition shrink-0"
                        >
                            {user ? 'Go to workspace →' : 'Get started free'}
                        </button>
                    </div>
                </div>
            </header>

            {/* HERO */}
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
                        onClick={handleCTA}
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

                <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-indigo-500/10 animate-section-fade">
                    {/* Browser Header Bar Chrome Mockup */}
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <div className="ml-4 bg-white border border-slate-100 px-16 py-0.5 rounded text-[9px] font-medium text-slate-400 select-none">
                            prepiq.web.app/dashboard/analyze
                        </div>
                    </div>
                    {/* Internal Miniature Layout Screen Simulation Preview */}
                    <div className="bg-[#F8FAFC] p-4 rounded-b-xl grid grid-cols-3 gap-3 text-left pointer-events-none select-none">
                        <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-2 shadow-sm">
                            <div className="h-2.5 w-2/3 bg-slate-200 rounded" />
                            <div className="h-10 w-full bg-slate-50 rounded border border-dashed border-slate-200" />
                            <div className="h-6 w-full bg-indigo-500 rounded-lg" />
                        </div>
                        <div className="col-span-2 bg-white p-3 rounded-xl border border-slate-100 space-y-3 shadow-sm">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                <div className="h-3 w-1/3 bg-slate-200 rounded" />
                                <div className="h-3 w-12 bg-amber-100 rounded" />
                            </div>
                            <div className="flex gap-1.5">
                                <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold">• React 19</span>
                                <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold">• TypeScript</span>
                                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100 font-bold">• System Architecture</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STATS STRIP */}
                <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm">
                    {stats.map((stat) => (
                        <div key={stat.label} className="px-4 py-5 text-center">
                            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                            <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 leading-snug">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="bg-white border-y border-gray-100 py-16 sm:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">The workflow</p>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">From job description to offer-ready in four steps.</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {steps.map((step) => (
                            <div key={step.number} className="relative space-y-3">
                                <div className="text-3xl font-black text-indigo-100 tracking-tighter leading-none">{step.number}</div>
                                <h3 className="text-sm font-bold text-slate-900 tracking-tight">{step.title}</h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                <div className="text-center mb-12 sm:mb-16">
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">System blueprint</p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">Engineered to isolate gaps, optimize time.</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 transition-all duration-300 ease-out ${f.hoverBorder} hover:shadow-md hover:-translate-y-1 hover:shadow-indigo-500/5`}
                        >
                            <div className={`w-10 h-10 rounded-xl ${f.bgClass} ${f.textClass} flex items-center justify-center`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={f.iconPath} />
                                </svg>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">{f.title}</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{f.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA BANNER */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
                <div className="bg-[#6366F1] rounded-3xl px-6 sm:px-12 py-12 sm:py-16 text-center relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />

                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-indigo-200 mb-4">Ready to prep smarter?</p>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto mb-6">
                        Your next interview is a<br className="hidden sm:block" /> system you can reverse-engineer.
                    </h2>
                    <p className="text-sm text-indigo-200 max-w-md mx-auto mb-8 leading-relaxed">
                        Sign in with Google and start in under 60 seconds. No credit card, no setup, no fuss.
                    </p>
                    <button
                        onClick={handleCTA}
                        className="bg-white text-indigo-700 font-bold text-sm px-8 py-4 rounded-xl hover:bg-indigo-50 transition shadow-lg shadow-indigo-900/20 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {user ? 'Go to workspace →' : 'Get started — it\'s free'}
                    </button>
                </div>
            </section>

            {/* ABOUT THE DEVELOPER */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 border-t border-gray-100 pt-14 sm:pt-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-start">
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold tracking-widest text-[#6366F1] uppercase bg-indigo-50 border border-indigo-100/50 px-2.5 py-0.5 rounded-md inline-block">
                            Behind the code
                        </span>
                        <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">About the developer</h2>
                        <p className="text-xs text-slate-400 font-medium">Engineering intent, architecture, and optimizations.</p>
                    </div>

                    <div className="md:col-span-2 space-y-4 text-xs sm:text-[13px] font-medium text-slate-500 leading-relaxed">
                        <p>
                            Hi, I'm <span className="text-slate-900 font-semibold">Aakash Kapoor</span>. I engineered PrepIQ to bridge the gap between generic interview preparation frameworks and specific, production-targeted role demands.
                        </p>
                        <p>
                            Built on a lightweight stack featuring <span className="text-indigo-600 font-semibold">React, TypeScript, and Vite</span>, the application runs entirely serverless over an isolated Cloud Firestore infrastructure with no backend to maintain.
                        </p>
                        <p>
                            By treating large language models as strict JSON schema engines rather than conversational nodes, PrepIQ extracts precise, predictable tech stacks from raw JD text — tracking confidence loops using responsive, dependency-free inline vector graphics.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {['React', 'TypeScript', 'Vite', 'Firebase', 'Gemini AI', 'Tailwind CSS'].map((tag) => (
                                <span key={tag} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CHANGELOG SECTION MATCHING image_32ecbc.jpg */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 border-t border-gray-100 pt-14 sm:pt-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
                    
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold tracking-widest text-[#6366F1] uppercase bg-indigo-50 border border-indigo-100/50 px-2.5 py-0.5 rounded-md inline-block">
                            What's new
                        </span>
                        <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">Changelog</h2>
                        <p className="text-xs text-slate-400 font-medium">System releases, patches, and deployment milestones.</p>
                    </div>

                    <div className="md:col-span-2 space-y-8">
                        {changelog.map((log, index) => (
                            <div key={log.version} className="relative pl-6 border-l-2 border-slate-200 last:border-transparent space-y-2">
                                {/* Chronological indicator point matching image timelines */}
                                <div className={`absolute -left-[7px] top-1 w-3 h-3 rounded-full ring-4 ring-[#F8FAFC] ${
                                    index === 0 ? 'bg-indigo-500' : index < 3 ? 'bg-amber-500' : 'bg-slate-400'
                                }`} />
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{log.version}</span>
                                    <span className="text-[11px] font-bold text-slate-400 tracking-wide">{log.date}</span>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">{log.title}</h3>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed">{log.description}</p>
                                
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {log.tags.map((tag) => (
                                        <span key={tag} className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-gray-100 bg-white py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#6366F1] rounded-lg flex items-center justify-center font-black text-[9px] text-white">
                            IQ
                        </div>
                        <span className="text-xs font-bold text-slate-400">PrepIQ</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest text-center">
                        © {new Date().getFullYear()} PrepIQ · All rights reserved · Serverless pipeline secure
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="https://github.com/aakash-kapoor/prepiq-react" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition">
                            GitHub
                        </a>
                    </div>
                </div>
            </footer>

        </div>
    );
}