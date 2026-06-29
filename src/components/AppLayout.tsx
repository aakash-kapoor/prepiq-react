import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      label: 'HOME',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg>
      )
    },
    { 
      name: 'JD Analyzer', 
      path: '/dashboard/analyze', 
      label: 'ANALYZE',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
        </svg>
      )
    },
    { 
      name: 'Quiz Mode', 
      path: '/dashboard/quiz', 
      label: 'QUIZ',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    { 
      name: 'Weak Spots', 
      path: '/dashboard/weaknesses', 
      label: 'WEAK SPOTS',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    { 
      name: 'Study Plan', 
      path: '/dashboard/study-plan', 
      label: 'STUDY PLAN',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      )
    }
  ];

  // --- DYNAMIC BREADCRUMB BUILDER ENGINE ---
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    // Custom friendly mapping to match your high-fidelity UI specifications
    const routeLabels: { [key: string]: string } = {
      dashboard: 'Workspace',
      analyze: 'JD Analyzer',
      questions: 'Question Bank',
      quiz: 'Quiz Mode',
      weaknesses: 'Weak Spots',
      'study-plan': 'Study Plan'
    };

    return pathnames.map((value, index) => {
      const last = index === pathnames.length - 1;
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = routeLabels[value.toLowerCase()] || value;
      return last ? (
        <span key={to} className="text-slate-800 font-semibold tracking-tight">
          {label}
        </span>
      ) : (
        <span key={to} className="flex items-center">
          <Link 
            to={to} 
            className="text-indigo-600 hover:text-indigo-700 transition duration-150"
          >
            {label}
          </Link>
          <span className="mx-2 text-slate-300 select-none font-light">/</span>
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans antialiased text-slate-900">
      
      {/* 1. DESKTOP SIDEBAR: Visible on medium screens and up */}
      <aside className="hidden md:flex w-64 bg-[#0F172A] text-white flex-col fixed h-full z-20 shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#6366F1] rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shadow-indigo-500/20">
            IQ
          </div>
          <span className="font-bold text-lg tracking-tight">PrepIQ</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#6366F1] text-white shadow-lg shadow-indigo-500/10' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span className="text-slate-400 group-hover:text-white transition-colors">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Profile Badge Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src={user.photoURL || 'https://via.placeholder.com/150'} 
              className="w-9 h-9 rounded-full border border-slate-700 object-cover" 
              alt="profile" 
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate text-slate-200">{user.displayName}</span>
              <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
            </div>
          </div>
          {/* Clean SVG Profile Logout Action Trigger */}
            <button
                onClick={() => logout().then(() => navigate('/'))}
                className="text-slate-400 hover:text-red-400 p-2 rounded-xl hover:bg-slate-800/50 transition-all duration-150 group"
                title="Log Out"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                </svg>
            </button>
        </div>
      </aside>

      {/* 2. MOBILE TOP NAVIGATION BAR */}
      <header className="md:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#6366F1] rounded-lg flex items-center justify-center font-bold text-xs text-white">
            IQ
          </div>
          <span className="font-bold text-base text-slate-900 tracking-tight">PrepIQ</span>
        </div>
        
        {/* Mobile Profile & Logout Actions */}
        <div className="flex items-center gap-3">
          <img
              src={user.photoURL || 'https://via.placeholder.com/150'}
              className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
              alt="user avatar"
          />
          <button
              onClick={() => logout().then(() => navigate('/'))}
              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
              title="Log Out"
          >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5"
              >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
              </svg>
          </button>
        </div>
      </header>

      {/* 3. MAIN WORKSPACE CONTAINER CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 pb-20 md:pb-0">
        {/* Desktop Header panel elements */}
        <header className="hidden md:flex h-16 border-b border-gray-200 bg-white items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center text-xs font-medium text-slate-500">
            {generateBreadcrumbs()}
          </div>
          {/* <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              {user.displayName}
            </span>
          </div> */}
        </header>

        {/* Content Render Outlet */}
        <main className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto animate-fadeIn">
          <Outlet />
        </main>
      </div>

      {/* 4. MOBILE BOTTOM TAB NAVIGATION BAR: Visible strictly on small screens */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around px-2 z-30 shadow-2xl">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-[#6366F1]' : 'text-slate-400'
              }`}
            >
              <span className={isActive ? 'text-[#6366F1]' : 'text-slate-400'}>{item.icon}</span>
              <span className="text-[9px] font-bold tracking-wider uppercase">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}