import { Link } from "react-router-dom";
import type { NavigationItem } from "../../config/navigation";
import { LayoutGroup, motion } from "motion/react";

type LiquidBottomNavProps = {
    items: NavigationItem[];
    moreItems: NavigationItem[];
    pathname: string;
    onMoreClick: () => void;
    isMoreMenuOpen: boolean;
};

const MotionLink = motion.create(Link);

const MoreIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

export default function LiquidBottomNav({
  items,
  moreItems,
  pathname,
  onMoreClick,
  isMoreMenuOpen,
}: LiquidBottomNavProps) {
  const isMoreSectionActive =
    isMoreMenuOpen ||
    moreItems.some(
      (item) =>
        pathname === item.path ||
        (item.name === "Quiz Mode" && pathname === "/dashboard/quiz-session")
    );

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
      border border-white/25
      bg-white/12
      backdrop-blur-[24px]
      backdrop-saturate-150
      overflow-hidden
      select-none
      px-2
      shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.05),0_8px_32px_rgba(15,23,42,0.18)]
      "
    >
      {/* Top-down light wash — the "glass has volume" cue */}
      <div
        className="
        absolute
        inset-0
        rounded-full
        bg-gradient-to-b
        from-white/35
        via-white/8
        to-transparent
        pointer-events-none
        "
      />
      {/* Thin bright rim along the very top edge — specular catch */}
      <div
        className="
        absolute
        inset-x-3
        top-0
        h-px
        bg-gradient-to-r
        from-transparent
        via-white/80
        to-transparent
        pointer-events-none
        "
      />

      <LayoutGroup>
        <div className="relative flex h-full w-full items-center">
          {items.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.name === "Quiz Mode" &&
                pathname === "/dashboard/quiz-session");
            return (
              <div
                key={item.path}
                className="relative flex flex-1 items-center justify-center h-full"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="
                    absolute
                    left-1
                    right-1
                    top-2
                    bottom-2
                    rounded-full
                    border-t border-t-white/70
                    border-b border-b-white/15
                    bg-gradient-to-b
                    from-white/45
                    to-white/15
                    backdrop-blur-md
                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),inset_0_-2px_3px_rgba(255,255,255,0.12),0_4px_14px_rgba(99,102,241,0.18)]
                  "
                    animate={{
                      boxShadow: [
                        "...small...",
                        "...larger...",
                        "...small..."
                      ]
                    }}
                  />
                )}
                <MotionLink
                  whileTap={{ scale: 0.94 }}
                  to={item.path}
                  className={`relative z-10 flex flex-col items-center justify-center flex-1 min-w-0 px-0.5 h-full transition-all duration-300 ease-out ${isActive ? "text-[#6366F1]" : "text-slate-400"
                    }`}
                >
                  <motion.span
                    animate={{
                      scale: isActive ? 1.12 : 1,
                      y: isActive ? -1 : 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className={isActive ? "drop-shadow-[0_0_6px_rgba(99,102,241,0.45)]" : ""}
                  >
                    {item.icon}
                  </motion.span>
                  <motion.span
                    animate={{
                      opacity: isActive ? 1 : 0.7,
                      y: isActive ? 0 : 1,
                    }}
                    className="text-[10px] font-bold tracking-wide uppercase truncate w-full text-center mt-0.5"
                  >
                    {item.label}
                  </motion.span>
                </MotionLink>
              </div>
            );
          })}

          <div className="relative flex flex-1 items-center justify-center h-full">
            {isMoreSectionActive && (
              <motion.div
                layoutId="active-pill"
                className="
                absolute
                left-1
                right-1
                top-2
                bottom-2
                rounded-full
                border-t border-t-white/70
                border-b border-b-white/15
                bg-gradient-to-b
                from-white/45
                to-white/15
                backdrop-blur-md
                shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),inset_0_-2px_3px_rgba(255,255,255,0.12),0_4px_14px_rgba(99,102,241,0.18)]
              "
                animate={{
                  boxShadow: [
                    "...small...",
                    "...larger...",
                    "...small..."
                  ]
                }}
              />
            )}
            <button
              onClick={onMoreClick}
              className={`
              relative z-10
              flex flex-1 flex-col
              items-center justify-center
              gap-0.5
              h-full
              transition-all duration-300
              ${isMoreSectionActive ? "text-[#6366F1]" : "text-slate-400"}
              `}
            >
              <motion.span
                animate={{
                  scale: isMoreSectionActive ? 1.12 : 1,
                  y: isMoreSectionActive ? -1 : 0,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut"
                }}
                className={isMoreSectionActive ? "drop-shadow-[0_0_6px_rgba(99,102,241,0.45)]" : ""}
              >
                {MoreIcon}
              </motion.span>
              <span className="text-[10px] font-bold tracking-wide uppercase mt-0.5">
                More
              </span>
            </button>
          </div>
        </div>
      </LayoutGroup>
    </nav>
  );
}