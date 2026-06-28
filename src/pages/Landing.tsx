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

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 selection:bg-indigo-100">

            {/* 1. BLENDED NAVBAR */}
            <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#6366F1] rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shadow-indigo-500/20">
                        IQ
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-900">PrepIQ</span>
                </div>

                <button
                    onClick={handleCTA}
                    className="text-xs font-bold bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 px-4 py-2.5 rounded-xl shadow-sm transition"
                >
                    {user ? 'Go to Workspace →' : 'Sign In'}
                </button>
            </header>

            {/* 2. HERO ENGAGEMENT ZONE */}
            <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20 space-y-6">
                <span className="text-xs font-bold tracking-widest text-[#6366F1] uppercase bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full inline-block animate-fadeIn">
                    Next-Gen AI Technical Interview Prep
                </span>

                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.1] max-w-2xl mx-auto">
                    Know Your Weak Spots <br />
                    <span className="text-[#6366F1]">Before They Do.</span>
                </h1>

                <p className="text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                    Stop parsing endless generic question pools. PrepIQ reverse-engineers job descriptions using Gemini AI to map your precision knowledge gaps, simulate quiz sandboxes, and compile custom study plans.
                </p>

                <div className="pt-4">
                    <button
                        onClick={handleCTA}
                        className="bg-[#6366F1] hover:bg-opacity-95 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition transform hover:-translate-y-0.5"
                    >
                        Start Sharpening Your Skills — It's Free
                    </button>
                </div>
            </section>

            {/* 3. CORE VALUE / FEATURES GRID */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="text-center space-y-1 mb-12">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">System Blueprint</h2>
                    <p className="text-lg font-bold text-slate-900 tracking-tight">Engineered to isolate gaps, optimize time.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* FEATURE 1: ANALYZER (SVG Replace 🔍) */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 transition hover:border-indigo-100/80">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">JD Blueprint Extraction</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Paste any software engineering role description. Our localized parser instantly maps core priorities, nice-to-haves, and organizational technical red flags.
                        </p>
                    </div>

                    {/* FEATURE 2: QUIZ TRACKER (SVG Replace 🎯) */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 transition hover:border-amber-100/80">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Adaptive Quiz Sandbox</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Drill down on tailored technical cards. Log your exact mental confidence intervals from 1 to 5 to safely register data-driven knowledge indexes.
                        </p>
                    </div>

                    {/* FEATURE 3: TIMELINE ENGINE (SVG Replace 📅) */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 transition hover:border-emerald-100/80">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Dynamic Timeline Planner</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Real-time calculations sort out your lowest confidence categories and spread them cleanly across custom day-by-day sprint intervals leading to your interview.
                        </p>
                    </div>

                </div>
            </section>

            {/* 4. FOOTER */}
            <footer className="border-t border-gray-200/60 bg-white py-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                © {new Date().getFullYear()} PrepIQ. All rights reserved. Serverless Pipeline Secure.
            </footer>

        </div>
    );
}