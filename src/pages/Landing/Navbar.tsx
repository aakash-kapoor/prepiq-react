interface NavbarProps {
    user: any;
    onCTA: () => void;
}

export default function Navbar({ user, onCTA }: NavbarProps) {
    return (
        <header className="sticky top-0 z-50 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-gray-100/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#6366F1] rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shadow-indigo-500/20">
                        IQ
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-900">PrepIQ</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <a
                        href="#how-it-works"
                        className="hidden md:inline text-[10px] sm:text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                    >
                        How it works
                    </a>
                    <a
                        href="#features"
                        className="hidden md:inline text-[10px] sm:text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                    >
                        Features
                    </a>
                    <button
                        onClick={onCTA}
                        className="text-[10px] sm:text-xs font-bold bg-[#6366F1] hover:bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-xl shadow-sm shadow-indigo-500/20 transition shrink-0 whitespace-nowrap"
                    >
                        {user ? 'Go to workspace →' : 'Get started free'}
                    </button>
                </div>
            </div>
        </header>
    );
}
