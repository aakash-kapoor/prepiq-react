import { Link } from "react-router-dom";
import type { User } from "firebase/auth";

type MobileHeaderProps = {
  user: User;
  pathname: string;
  currentPageTitle: string;
  onLogout: () => void;
};

export default function MobileHeader({
  user,
  pathname,
  currentPageTitle,
  onLogout
}: MobileHeaderProps) {
    return (
        <header className="md:hidden bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="h-14 flex items-center justify-between px-4 gap-2">
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0 min-w-0">
            <div className="w-7 h-7 bg-[#6366F1] rounded-lg flex items-center justify-center font-bold text-xs text-white">
              IQ
            </div>
            <span className="font-bold text-sm text-slate-900 tracking-tight truncate max-w-[72px] sm:max-w-none">PrepIQ</span>
          </Link>

          <div className="flex-1 min-w-0 text-center px-1">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider truncate">
              {pathname === '/dashboard' ? 'Dashboard' : 'Workspace'}
            </p>
            <p className="text-xs font-bold text-slate-900 truncate">{currentPageTitle}</p>
          </div>

          {/* Mobile Profile & Logout Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src={user.photoURL || 'https://via.placeholder.com/150'}
              className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
              alt="user avatar"
            />
            <button
              onClick={onLogout}
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
        </div>
      </header>
    )
}