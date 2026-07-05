import { useState } from "react";
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
    // 1. Add state to manage collapsed status
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={`hidden md:flex flex-col bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700 shadow-sm shrink-0 transition-all duration-300 ease-in-out ${
                isCollapsed ? "w-20" : "w-64"
            }`}
        >
            {/* Added overflow-x-hidden to keep content from spilling during animation */}
            <div className="flex flex-col justify-between flex-1 w-full overflow-y-auto overflow-x-hidden">
                <div>
                    {/* Header: adapts to vertical layout when collapsed */}
                    <div
                        className={`pt-6 pb-4 px-4 border-slate-100 dark:border-slate-700 flex ${
                            isCollapsed
                                ? "flex-col items-center gap-4"
                                : "items-center justify-between"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 shrink-0 bg-[#6366F1] rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shadow-indigo-500/20">
                                IQ
                            </div>
                            {!isCollapsed && (
                                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                    PrepIQ
                                </span>
                            )}
                        </div>

                        {/* Toggle Button */}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                {isCollapsed ? (
                                    // Hamburger Menu Icon
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                ) : (
                                    // Sidebar Panel Icon
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 5.25h16.5a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5Zm7.5 0v13.5"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>

                    <nav className={`p-4 space-y-2 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
                        {menuItems.map((item) => {
                            const isActive = isNavItemActive(item, pathname);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    title={isCollapsed ? item.name : undefined}
                                    className={`relative flex items-center rounded-xl text-sm font-medium transition-colors duration-150 ${
                                        isCollapsed
                                            ? "justify-center w-12 h-12"
                                            : "gap-3 px-4 py-3 w-full"
                                    } ${
                                        isActive
                                            ? "text-white"
                                            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active-pill"
                                            className="absolute inset-0 bg-[#6366F1] rounded-xl shadow-lg shadow-indigo-500/20"
                                            transition={{
                                                type: "spring",
                                                stiffness: 380,
                                                damping: 34,
                                            }}
                                        />
                                    )}
                                    <span className="relative z-10 shrink-0 transition-colors">
                                        {item.icon}
                                    </span>
                                    {!isCollapsed && (
                                        <span className="relative z-10 whitespace-nowrap">
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer */}
                <div
                    className={`p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 flex mt-auto ${
                        isCollapsed
                            ? "flex-col items-center justify-center gap-4"
                            : "items-center justify-between"
                    }`}
                >
                    <Link
                        to="/dashboard/profile"
                        className={`flex items-center overflow-hidden rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors p-1 -m-1 ${
                            isCollapsed ? "justify-center" : "gap-3"
                        }`}
                        title={isCollapsed ? "Profile" : undefined}
                    >
                        <img
                            src={user.photoURL || "https://via.placeholder.com/150"}
                            className="w-9 h-9 shrink-0 rounded-full border border-slate-200 dark:border-slate-600 object-cover"
                            alt="profile"
                        />
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden whitespace-nowrap">
                                <span className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">
                                    {user.displayName}
                                </span>
                                <span className="text-[10px] text-slate-400 truncate">
                                    {user.email}
                                </span>
                            </div>
                        )}
                    </Link>

                    <motion.button
                        whileHover={{ x: isCollapsed ? 0 : 2, scale: isCollapsed ? 1.05 : 1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={onLogout}
                        className="text-slate-400 shrink-0 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150 group"
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
            </div>
        </aside>
    );
}