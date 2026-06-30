import { Link } from "react-router-dom";
import type { NavigationItem } from "../../config/navigation";

type LiquidBottomNavProps = {
  items: NavigationItem[];
  pathname: string;
};

export default function LiquidBottomNav({
  items,
  pathname,
}: LiquidBottomNavProps) {
  return (
    <nav
      className="
      md:hidden
      fixed
      bottom-4
      left-4
      right-4
      z-40
      h-16
      rounded-full
      border border-white/20
      bg-white/10
      backdrop-blur-[24px]
      backdrop-saturate-150
      shadow-[0_8px_32px_rgba(15,23,42,0.15)]
      overflow-hidden
      select-none
      px-2"
    >
      <div
        className="
        absolute
        inset-0
        rounded-full
        bg-gradient-to-b
        from-white/35
        via-white/10
        to-transparent
        pointer-events-none
        "
      />
      <div className="relative flex h-full w-full items-center">
        {items.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.name === "Quiz Mode" &&
              pathname === "/dashboard/quiz-session");
          return (
            <div
              key={item.path}
              className="relative flex flex-1 items-center justify-center"
            >
              {/* Active Glass Pill will go here */}
              <Link
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 min-w-0 px-0.5 h-full transition-all duration-300 ease-out ${
                  isActive ? "text-[#6366F1]" : "text-slate-400"
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-[10px] font-bold tracking-wide uppercase truncate w-full text-center mt-0.5">
                  {item.label}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
