import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DesktopSidebar from './layout/DesktopSidebar';
import MobileHeader from './layout/MobileHeader';

export default function AppLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const routeLabels: { [key: string]: string } = {
    dashboard: 'Workspace',
    analyze: 'JD Analyzer',
    questions: 'Question Bank',
    quiz: 'Quiz Mode',
    'quiz-session': 'Quiz Mode',
    weaknesses: 'Weak Spots',
    'study-plan': 'Study Plan'
  };

  const getCurrentPageTitle = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    if (pathnames.length <= 1) return routeLabels.dashboard;
    const last = pathnames[pathnames.length - 1];
    return routeLabels[last.toLowerCase()] || last;
  };

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
      name: 'Question Bank', 
      path: '/dashboard/questions', 
      label: 'BANK',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm0 5.25h.007v.008H3.75v-.008Zm0 5.25h.007v.008H3.75v-.008Z" />
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
      label: 'WEAK',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    { 
      name: 'Study Plan', 
      path: '/dashboard/study-plan', 
      label: 'PLAN',
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
      <DesktopSidebar
        user={user}
        menuItems={menuItems}
        pathname={location.pathname}
        onLogout={() => logout().then(() => navigate('/'))}
      />

      {/* 2. MOBILE TOP NAVIGATION BAR */}
      <MobileHeader
        user={user}
        pathname={location.pathname}
        currentPageTitle={getCurrentPageTitle()}
        onLogout={() => logout().then(() => navigate('/'))}
      />

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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-stretch px-1 z-30 shadow-2xl">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.name === 'Quiz Mode' && location.pathname === '/dashboard/quiz-session');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 min-w-0 px-0.5 h-full transition-colors ${
                isActive ? 'text-[#6366F1]' : 'text-slate-400'
              }`}
            >
              <span className={isActive ? 'text-[#6366F1]' : 'text-slate-400'}>{item.icon}</span>
              <span className="text-[8px] font-bold tracking-wide uppercase truncate w-full text-center mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}