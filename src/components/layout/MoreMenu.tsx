import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import type { NavigationItem } from "../../config/navigation";

type MoreMenuProps = {
  open: boolean;
  items: NavigationItem[];
  onClose: () => void;
  onLogout: () => void;
};

export default function MoreMenu({
  open,
  items,
  onClose,
  onLogout,
}: MoreMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{
                opacity: open ? 1 : 0,
                pointerEvents: open ? "auto" : "none",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Floating Glass Sheet */}
          <motion.div
            className="fixed inset-x-4 bottom-4 z-50"
            style={{
                willChange: "transform, opacity",
            }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 400, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 30,
            }}
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                border border-white/40
                bg-white/60
                backdrop-blur-[24px]
                backdrop-saturate-150
                shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(255,255,255,0.1),0_20px_60px_rgba(15,23,42,0.2)]
              "
            >
              {/* Glass Highlight — top-down light wash */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-b
                  from-white/25
                  via-white/5
                  to-transparent
                  pointer-events-none
                "
              />
              {/* Thin bright rim along the very top edge — specular catch */}
              <div
                className="
                  absolute
                  inset-x-8
                  top-0
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-white/85
                  to-transparent
                  pointer-events-none
                "
              />

              <div className="relative p-6">
                {/* Drag Handle */}
                <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/60 shadow-[0_1px_1px_rgba(255,255,255,0.6)]" />

                {/* Title */}
                <h2 className="mb-5 text-center text-lg font-semibold text-slate-800">
                  More
                </h2>

                {/* Navigation */}
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.05,
                      }}
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className="
                          flex
                          items-center
                          gap-4
                          rounded-2xl
                          px-4
                          py-3
                          border border-transparent
                          transition-all
                          duration-200
                          hover:bg-white/25
                          hover:border-white/40
                          hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]
                          active:scale-[0.98]
                        "
                      >
                        <span className="text-[#6366F1]">
                          {item.icon}
                        </span>

                        <span className="font-medium text-slate-700">
                          {item.name}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-white/30" />

                {/* Logout */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-4
                    rounded-2xl
                    px-4
                    py-3
                    text-left
                    border border-transparent
                    transition-all
                    duration-200
                    hover:bg-red-500/10
                    hover:border-red-500/20
                    active:scale-[0.98]
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="font-medium text-red-500">
                    Logout
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}