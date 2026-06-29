import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const [legalContent, setLegalContent] = useState<{ title: string; text: string } | null>(null);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error("Login authentication routine terminated:", error);
    }
  };

  const highlights = [
    {
      color: 'indigo',
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      iconPath: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z',
      label: 'Automated job description analysis',
    },
    {
      color: 'amber',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      iconPath: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      label: 'Adaptive confidence mapping',
    },
    {
      color: 'emerald',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      iconPath: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
      label: 'Day-by-day study timeline',
    },
    {
      color: 'rose',
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
      label: 'Visual weakness radar',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans antialiased text-slate-900">

      {/* LEFT COLUMN */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 md:p-12 md:max-w-xl xl:max-w-2xl bg-white z-10">

        {/* Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer w-fit"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 bg-[#6366F1] rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shadow-indigo-500/20">
            IQ
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">PrepIQ</span>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-sm mx-auto space-y-8 my-auto py-12">

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              Sign in to access your prep workspace — your gaps, quizzes, and study plan are waiting.
            </p>
          </div>

          {/* Google Sign In */}
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 active:bg-slate-100 border border-gray-200 hover:border-gray-300 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition duration-200 shadow-sm hover:shadow-md text-xs tracking-wide"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-4 h-4"
                alt="Google"
              />
              Continue with Google
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">
                secure sign in
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: 'M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z', label: 'Google-secured login' },
                { icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125', label: 'Isolated Firestore DB' },
                { icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z', label: 'No credit card needed' },
                { icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', label: 'Free to use, always' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 bg-slate-50 border border-gray-100 rounded-xl px-3 py-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5 text-indigo-400 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="text-[10px] font-semibold text-slate-500 leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-slate-300 text-center font-medium leading-relaxed">
            By signing in, you agree to our{' '}
            <button
              type="button"
              onClick={() => setLegalContent({
                title: "Terms of Service",
                text: "Welcome to PrepIQ. By authenticating with Google Sign-In and utilizing this platform, you agree that your data is processed entirely serverless via isolated Cloud Firestore instances. PrepIQ is a developmental technical interview preparation framework built for educational and benchmarking use. All generative insights are produced via the Gemini API as structural schema models."
              })}
              className="text-slate-500 hover:text-slate-700 underline font-bold transition"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => setLegalContent({
                title: "Privacy Policy",
                text: "Your privacy is fully protected under our serverless data pipeline architecture. PrepIQ does not manage local user credential databases; authentication relies exclusively on secure Google OAuth tokens. Application data—including analyzed job descriptions, confidence logs, and flashcard metrics—is securely mapped to your isolated user identity record via Firebase Security Rules."
              })}
              className="text-slate-500 hover:text-slate-700 underline font-bold transition"
            >
              Privacy Policy
            </button>
            .
          </p>
        </div>

        {/* Footer note */}
        <div className="flex items-center gap-2 text-[10px] text-slate-300 font-semibold tracking-wide uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-slate-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          Secure serverless endpoint
        </div>
      </div>

      {/* RIGHT COLUMN — hidden on mobile */}
      <div className="hidden md:flex flex-1 bg-slate-950 relative overflow-hidden items-center justify-center p-10 xl:p-16 select-none">

        {/* Grid backdrop */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Ambient glows */}
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -top-24 -right-24 pointer-events-none" />
        <div className="absolute w-[350px] h-[350px] bg-violet-500/5 rounded-full blur-3xl -bottom-16 -left-16 pointer-events-none" />

        {/* Content card */}
        <div className="max-w-md w-full relative z-10 space-y-6">

          {/* Quote / headline */}
          <div className="space-y-3 pb-6 border-b border-white/5">
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md inline-block">
              Platform summary
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
              Know your weak spots<br />
              <span className="text-indigo-400">before they do.</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              PrepIQ reverse-engineers job descriptions with Gemini AI — mapping your exact knowledge gaps, drilling them with adaptive quizzes, and building a custom study sprint to your interview date.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-2.5">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.04] p-3.5 rounded-xl hover:bg-white/[0.04] transition"
              >
                <div className={`w-8 h-8 ${h.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`w-4 h-4 ${h.text}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={h.iconPath} />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-slate-300">{h.label}</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-slate-600 ml-auto shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
            ))}
          </div>

          {/* Bottom meta */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#6366F1] rounded-lg flex items-center justify-center font-black text-[9px] text-white">
                IQ
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PrepIQ</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">100% Free · Serverless</span>
          </div>
        </div>
      </div>

  {/* LEGAL POPUP OVERLAY */}
            {legalContent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
                    <div className="bg-white border border-slate-100 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 transform animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest text-indigo-600">
                                {legalContent.title}
                            </h3>
                            <button 
                                type="button"
                                onClick={() => setLegalContent(null)}
                                className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg transition"
                            >
                                Close
                            </button>
                        </div>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed whitespace-pre-line">
                            {legalContent.text}
                        </p>
                    </div>
                </div>
            )}

        </div>
  );
}