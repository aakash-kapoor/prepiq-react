import { Link } from "react-router-dom";
import type { User } from "firebase/auth";
import type { NavigationItem } from "../../config/navigation";
import { isNavItemActive } from "../../config/navigation";
import { motion } from "motion/react";

type DesktopSidebarProps = {
    user: User;
    menuItems: NavigationItem[];
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
        <aside className="hidden md:flex w-64 bg-white text-slate-900 flex-col fixed h-full z-20 border-r border-slate-200 shadow-sm">
            <div className="p-6 border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#6366F1] rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shadow-indigo-500/20">
                    IQ
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-900">PrepIQ</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = isNavItemActive(item, pathname);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150 ${
                                isActive
                                    ? 'text-white'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            {/* Sliding active pill — layoutId lets Motion animate it between nav items */}
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active-pill"
                                    className="absolute inset-0 bg-[#6366F1] rounded-xl shadow-lg shadow-indigo-500/20"
                                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                                />
                            )}
                            <span className="relative z-10 transition-colors">{item.icon}</span>
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Desktop Profile Badge Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                 <Link
                     to="/dashboard/profile"
                     className="flex items-center gap-3 overflow-hidden rounded-xl hover:bg-slate-100 transition-colors p-1 -m-1"
                 >
                    <img
                        src={user.photoURL || 'https://via.placeholder.com/150'}
                        className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                        alt="profile"
                    />
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate text-slate-800">{user.displayName}</span>
                        <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
                    </div>
                </Link>
                {/* Clean SVG Profile Logout Action Trigger */}
                <motion.button
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={onLogout}
                    className="text-slate-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors duration-150 group"
                    title="Log Out"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                        />
                    </svg>
                </motion.button>
            </div>
        </aside>
    );
}