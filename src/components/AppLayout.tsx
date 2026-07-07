import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DesktopSidebar from './layout/DesktopSidebar';
import MobileHeader from './layout/MobileHeader';
import LiquidBottomNav from "./layout/LiquidBottomNav";
import MoreMenu from "./layout/MoreMenu";
import { primaryNavigation, secondaryNavigation } from "../config/navigation";
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';

export default function AppLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const getCurrentPageTitle = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    if (pathnames.length <= 1) return routeLabels.dashboard;
    const last = pathnames[pathnames.length - 1];
    return routeLabels[last.toLowerCase()] || last;
  };

  // 1. Auto-close menu on route change
  useEffect(() => {
    setIsMoreMenuOpen(false);
  }, [location.pathname]);

  // 2. Accessibility: Close menu on Escape key press
  useEffect(() => {
    if (!isMoreMenuOpen) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && setIsMoreMenuOpen(false);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isMoreMenuOpen]);

  // 3. Automatically synchronize Browser Tab Titles on route shifts
  useEffect(() => {
    const pageTitle = getCurrentPageTitle();
    document.title = `${pageTitle} | PrepIQ`;
    // CLEANUP FUNCTION: Resets title back to index.html default on logout/unmount
    return () => {
      document.title = 'PrepIQ | AI Interview Prep';
    };
  }, [location.pathname]);

  // 3. Reset scroll position on route change — decoupled from popLayout's exit/enter
  // animation timing so it fires immediately instead of ~150ms late.
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [location.pathname]);

  if (!user) return null;

  const routeLabels: { [key: string]: string } = {
    dashboard: 'Dashboard',
    analyze: 'Analyze',
    questions: 'Question Bank',
    quiz: 'Quiz',
    'quiz-session': 'Quiz',
    'weak-spots': 'Weak Spots',
    'study-plan': 'Study Plan',
    profile: 'Profile'
  };

  // --- DYNAMIC BREADCRUMB BUILDER ENGINE ---
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);

    return pathnames.map((value, index) => {
      const last = index === pathnames.length - 1;
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = routeLabels[value.toLowerCase()] || value;
      return last ? (
        <span key={to} className="text-slate-800 dark:text-slate-200 font-semibold tracking-tight">
          {label}
        </span>
      ) : (
        <span key={to} className="flex items-center">
          <Link
            to={to}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition duration-150"
          >
            {label}
          </Link>
          <span className="mx-2 text-slate-300 dark:text-slate-600 select-none font-light">/</span>
        </span>
      );
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen md:h-screen md:overflow-hidden bg-brand-bg dark:bg-slate-900 flex flex-col md:flex-row font-sans antialiased text-slate-900 dark:text-slate-100 transition-colors">

        {/* 1. DESKTOP SIDEBAR: Visible on medium screens and up */}
        <DesktopSidebar
          user={user}
          menuItems={[...primaryNavigation, ...secondaryNavigation]}
          pathname={location.pathname}
          onLogout={() => logout().then(() => navigate('/'))}
        />

        {/* 2. MOBILE TOP NAVIGATION BAR */}
        <MobileHeader
          user={user}
          pathname={location.pathname}
          currentPageTitle={getCurrentPageTitle()}
        />

        {/* 3. MAIN WORKSPACE CONTAINER CONTENT WRAPPER */}
        <div className="flex-1 flex flex-col min-w-0 md:h-full md:overflow-y-auto pb-20 md:pb-0 relative">
          {/* Desktop Header panel elements */}
          <header className="hidden md:flex h-16 shrink-0 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 items-center justify-between px-8 sticky top-0 z-30 transition-colors">
            <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
              {generateBreadcrumbs()}
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </header>

          {/* Content Render Outlet — AnimatePresence for route transitions.
              Scroll reset is handled by the useEffect above, not onExitComplete,
              since popLayout runs enter/exit concurrently. */}
          <div className="flex-1 relative">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.main
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' as const }}
                className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto min-h-[60vh]"
              >
                <Outlet />
              </motion.main>
            </AnimatePresence>
          </div>
        </div>

        {/* 4. MOBILE BOTTOM TAB NAVIGATION BAR: Visible strictly on small screens */}
        <LiquidBottomNav
          items={primaryNavigation}
          moreItems={secondaryNavigation}
          pathname={location.pathname}
          onMoreClick={() => setIsMoreMenuOpen(true)}
          isMoreMenuOpen={isMoreMenuOpen}
        />

        <MoreMenu
          open={isMoreMenuOpen}
          items={secondaryNavigation}
          onClose={() => setIsMoreMenuOpen(false)}
          onLogout={() => {
            setIsMoreMenuOpen(false);
            logout().then(() => navigate("/"));
          }}
        />

      </div>
    </MotionConfig>
  );
}