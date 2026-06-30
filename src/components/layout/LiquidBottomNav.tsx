import { Link } from "react-router-dom";
import type { NavigationItem } from "../../config/navigation";

type LiquidBottomNavProps = {
  items: NavigationItem[];
  pathname: string;
};

export default function LiquidBottomNav({
    items,
    pathname
}: LiquidBottomNavProps) {
return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-stretch px-1 z-30 shadow-2xl">
        {items.map((item) => {
          const isActive = pathname === item.path || (item.name === 'Quiz Mode' && pathname === '/dashboard/quiz-session');
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
)
}