import { Link } from "react-router-dom";
import type { User } from "firebase/auth";

type MobileHeaderProps = {
  user: User;
  pathname: string;
  currentPageTitle: string;
};

export default function MobileHeader({
  user,
  pathname,
  currentPageTitle
}: MobileHeaderProps) {
  return (
    <header className="md:hidden bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-30 shadow-sm transition-colors">
      <div className="h-14 flex items-center justify-between px-4 gap-2">
        <Link to="/dashboard" className="w-28 flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-[#6366F1] rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0">
            IQ
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight truncate max-w-[64px]">PrepIQ</span>
        </Link>

        <div className="flex-1 min-w-0 text-center px-1">
          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
            {pathname === '/dashboard' ? 'Dashboard' : 'Workspace'}
          </p>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{currentPageTitle}</p>
        </div>

        {/* Mobile Profile */}
        <div className="w-28 flex items-center justify-end gap-2 shrink-0">
          <Link to="/dashboard/profile">
            <img
              src={user.photoURL || 'https://via.placeholder.com/150'}
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-600 shadow-sm"
              alt="user avatar"
            />
          </Link>
        </div>
      </div>
    </header>
  )
}