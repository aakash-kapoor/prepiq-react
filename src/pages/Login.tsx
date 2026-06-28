import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Login() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  // Redirect instantly if already logged in to prevent component update flashes
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

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans antialiased text-slate-900">
      
      {/* LEFT COLUMN: INTERACTIVE AUTHENTICATION PANEL */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 md:max-w-xl xl:max-w-2xl bg-white z-10">
        
        {/* Top Navbar Brand Badge Link */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-[#6366F1] rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shadow-indigo-500/20">
            IQ
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">PrepIQ</span>
        </div>

        {/* Central Core Login Action Module */}
        <div className="w-full max-w-sm mx-auto space-y-6 my-auto py-12">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Welcome back</h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Log into your automated workspace ledger to review tracking metrics, practice flash drills, and optimize gaps.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-gray-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition duration-200 shadow-sm text-xs uppercase tracking-wider"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google Token" />
              Sign In with Google Account
            </button>
            
            <p className="text-[10px] text-slate-400 text-center font-medium px-4 leading-normal">
              By authenticating, you establish a secure, isolated Cloud Firestore ledger workspace container.
            </p>
          </div>
        </div>

        {/* Lower Privacy Gate Notification */}
        <div className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
          🔒 Secure Serverless Endpoint Node
        </div>
      </div>

      {/* RIGHT COLUMN: PREMIUM GRAPHIC SHOWCASE PANEL (Hidden on Mobile viewports) */}
      <div className="hidden md:flex flex-1 bg-slate-950 relative overflow-hidden items-center justify-center p-12 select-none">
        
        {/* Abstract Technical Background Vector Grid Backdrops */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Soft Radial Ambient Glow */}
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -top-20 -right-20 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-3xl -bottom-10 -left-10 pointer-events-none" />

        {/* Floating Value Framework Spotlight Block */}
        <div className="max-w-md w-full bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-8 space-y-6 shadow-2xl relative z-10 animate-fadeIn">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md inline-block">
              Platform Summary
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Know Your Weak Spots Before They Do.</h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              PrepIQ uses advanced model tokenization to reverse-engineer target roles, log dynamic personal scores, and auto-generate structured study timelines.
            </p>
          </div>

          {/* Micro-Telemetry Feature Previews */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl">
              <div className="w-7 h-7 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 text-xs">🔍</div>
              <p className="text-xs font-semibold text-slate-300">Automated Job Description Analysis</p>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl">
              <div className="w-7 h-7 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 text-xs">🎯</div>
              <p className="text-xs font-semibold text-slate-300">Adaptive Mock Confidence Mapping</p>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl">
              <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 text-xs">📅</div>
              <p className="text-xs font-semibold text-slate-300">Dynamic Timeline Interval Scheduling</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}