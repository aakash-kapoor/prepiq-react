interface CTAProps {
    user: any;
    onCTA: () => void;
}

export default function CTA({ user, onCTA }: CTAProps) {
    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
            <div className="bg-[#6366F1] rounded-3xl px-6 sm:px-12 py-12 sm:py-16 text-center relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />

                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-indigo-200 mb-4">Ready to prep smarter?</p>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto mb-6">
                    Your next interview is a<br className="hidden sm:block" /> system you can reverse-engineer.
                </h2>
                <p className="text-sm text-indigo-200 max-w-md mx-auto mb-8 leading-relaxed">
                    Sign in with Google and start in under 60 seconds. No credit card, no setup, no fuss.
                </p>
                <button
                    onClick={onCTA}
                    className="bg-white text-indigo-700 font-bold text-sm px-8 py-4 rounded-xl hover:bg-indigo-50 transition shadow-lg shadow-indigo-900/20 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    {user ? 'Go to workspace →' : "Get started — it's free"}
                </button>
            </div>
        </section>
    );
}
