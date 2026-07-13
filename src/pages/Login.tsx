import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LegalModal from '../components/LegalModal';
import Spinner from '../components/Spinner';
import { showErrorToast } from '../lib/toast';
import { motion } from 'motion/react';

const auroraBlobs = [
  {
    color: '#6366F1',
    size: '60%',
    style: { top: '-10%', left: '-10%' },
    animate: { x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.15, 1] },
    duration: 14,
  },
  {
    color: '#8B5CF6',
    size: '60%',
    style: { bottom: '-15%', right: '-5%' },
    animate: { x: [0, -40, 0], y: [0, -50, 0], scale: [1, 0.9, 1] },
    duration: 18,
  },
  {
    color: '#22D3B6',
    size: '40%',
    style: { top: '20%', right: '15%' },
    animate: { x: [0, -70, 0], y: [0, 50, 0], scale: [1, 1.2, 1] },
    duration: 11,
  },
];

export default function Login() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const [legalContent, setLegalContent] = useState<{ title: string; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isReturningUser = localStorage.getItem('prepiq_visited') === '1';

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await loginWithGoogle();
      localStorage.setItem('prepiq_visited', '1');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login authentication routine terminated:', error);
      // Don't surface "popup closed" — that's intentional user action
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
        showErrorToast('Sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
      label: 'AI-graded answer feedback',
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
      label: 'Visual weak spots radar',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row font-sans antialiased text-slate-900 dark:text-slate-100">

      {/* LEFT COLUMN */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 md:p-12 md:max-w-xl xl:max-w-2xl bg-white dark:bg-slate-950 z-10">

        {/* Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer w-fit"
          onClick={() => navigate('/')}
        >
          <img src="/prepiq.svg" alt="PrepIQ Logo" className="w-7 h-7 shrink-0" />
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">PrepIQ</span>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-sm mx-auto space-y-8 my-auto py-12">

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {isReturningUser ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
              {isReturningUser
                ? 'Sign in to access your prep workspace — your gaps, quizzes, and study plan are waiting.'
                : 'Sign in with Google to build your personalized interview prep workspace in seconds.'}
            </p>
          </div>

          {/* Google Sign In */}
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 font-bold py-3.5 px-4 rounded-xl transition duration-200 shadow-sm hover:shadow-md text-xs tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  className="w-4 h-4"
                  alt="Google"
                />
              )}
              {isLoading ? 'Signing in…' : 'Continue with Google'}
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
              <span className="text-[10px] font-semibold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                secure sign in
              </span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: 'M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z', label: 'Google-secured login' },
                { icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125', label: 'Isolated Firestore DB' },
                { icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z', label: 'No credit card needed' },
                { icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', label: 'Free to use, always' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl px-3 py-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5 text-indigo-400 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-slate-300 dark:text-slate-500 text-center font-medium leading-relaxed">
            By signing in, you agree to our{' '}
            <button
              type="button"
              onClick={() => setLegalContent({
                title: "Terms of Service",
                text: "Welcome to PrepIQ. By authenticating with Google Sign-In and utilizing this platform, you agree that your data is processed entirely serverless via isolated Cloud Firestore instances. PrepIQ is a developmental technical interview preparation framework built for educational and benchmarking use. All generative insights are produced via the Gemini API as structural schema models."
              })}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 underline font-bold transition"
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
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 underline font-bold transition"
            >
              Privacy Policy
            </button>
            .
          </p>
        </div>

        {/* Footer note */}
        <div className="flex items-center gap-2 text-[10px] text-slate-300 dark:text-slate-600 font-semibold tracking-wide uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-slate-300 dark:text-slate-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          Secure serverless endpoint
        </div>
      </div>

      {/* RIGHT COLUMN — hidden on mobile */}
      <div className="hidden md:flex flex-1 bg-[#0A0E27] relative overflow-hidden items-center justify-center p-10 xl:p-16 select-none">

        {/* Aurora blobs */}
        {auroraBlobs.map((blob, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              ...blob.style,
              width: blob.size,
              height: blob.size,
              background: blob.color,
              filter: 'blur(80px)',
              mixBlendMode: 'screen',
              opacity: 0.45,
            }}
            animate={blob.animate}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: 'easeInOut' as const,
            }}
          />
        ))}

        {/* Grid backdrop */}
        {/* <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" /> */}

        {/* Dark overlay to isolate content from aurora glow */}
        <div className="absolute inset-0 bg-[#0A0E27]/60 backdrop-blur-[1px]" />

        {/* Content card */}
        <div className="max-w-md w-full relative z-10 space-y-6 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 backdrop-blur-sm shadow-2xl">

          {/* Quote / headline */}
          <div className="space-y-3 pb-6 border-b border-white/5">
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md inline-block">
              Platform summary
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
              Know your weak spots<br />
              <span className="text-indigo-400">before they do.</span>
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              PrepIQ reverse-engineers job descriptions with Gemini AI — mapping your exact knowledge gaps, evaluating your answers with instant AI grading, and building a custom study sprint to your interview date.
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
                <p className="text-xs font-semibold text-white">{h.label}</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-slate-600 ml-auto shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
            ))}
          </div>

          {/* Bottom meta */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <img src="/prepiq.svg" alt="PrepIQ" className="w-6 h-6 shrink-0" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PrepIQ</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">100% Free · Serverless</span>
          </div>
        </div>
      </div>

      {/* LEGAL POPUP OVERLAY */}
      {legalContent && (
        <LegalModal
          content={legalContent}
          onClose={() => setLegalContent(null)}
        />
      )}

    </div>
  );
}