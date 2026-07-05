import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changelog } from '../config/changelog';

export default function ChangelogPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleBack = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 pb-16">
      {/* Frosted Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <span className="font-black text-lg text-slate-900 dark:text-slate-100 tracking-tight">PrepIQ Changelog</span>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl transition"
          >
            ← Back to App
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 mt-12 animate-fadeIn">
        <div className="space-y-4 text-center sm:text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">System Release History</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
            Keep track of features, engine revisions, and deployment metrics added to the PrepIQ ecosystem.
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-12 space-y-12 relative pl-6 sm:pl-8 border-l border-slate-200 dark:border-slate-800">
          {changelog.map((log, index) => (
            <div key={log.version} className="relative group">
              {/* Dot indicator */}
              <div 
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full ring-4 ring-slate-50 dark:ring-slate-950 transition-colors ${
                  index === 0 ? 'bg-indigo-500 ring-indigo-50 dark:ring-indigo-900' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400 dark:group-hover:bg-slate-600'
                }`} 
              />
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-2.5 py-0.5 rounded-lg">
                    {log.version}
                  </span>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    {log.date}
                  </span>
                </div>

                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {log.title}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
                  {log.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {log.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
