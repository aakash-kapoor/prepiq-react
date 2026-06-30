import { Link } from "react-router-dom";
import type { User } from "firebase/auth";

type MenuItem = {
    name: string;
    path: string;
    label: string;
    icon: React.ReactNode;
};

type DesktopSidebarProps = {
    user: User;
    menuItems: MenuItem[];
    pathname: string;
    onLogout: () => void;
};

export default function DesktopSidebar({
    user,
    menuItems,
    pathname,
    onLogout,
}: DesktopSidebarProps) {
    return (
        <aside className="hidden md:flex w-64 bg-[#0F172A] text-white flex-col fixed h-full z-20 shadow-xl">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#6366F1] rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shadow-indigo-500/20">
                    IQ
                </div>
                <span className="font-bold text-lg tracking-tight">PrepIQ</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path || (item.name === 'Quiz Mode' && pathname === '/dashboard/quiz-session');
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
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
                    onClick={onLogout}
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
    );
}
