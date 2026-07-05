import { motion } from 'motion/react';

interface CTAProps {
    user: any;
    onCTA: () => void;
}

const blobs = [
    {
        color: '#6366F1',
        size: '60%',
        style: { top: '-10%', left: '-10%' },
        animate: { x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.15, 1] },
        duration: 14,
    },
    {
        color: '#8B5CF6',
        size: '60%',
        style: { bottom: '-15%', right: '-5%' },
        animate: { x: [0, -40, 0], y: [0, -50, 0], scale: [1, 0.9, 1] },
        duration: 18,
    },
    {
        color: '#22D3B6',
        size: '40%',
        style: { top: '20%', right: '15%' },
        animate: { x: [0, -70, 0], y: [0, 50, 0], scale: [1, 1.2, 1] },
        duration: 11,
    },
];

export default function CTA({ user, onCTA }: CTAProps) {
    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
            <div className="rounded-3xl px-6 sm:px-12 py-12 sm:py-16 text-center relative overflow-hidden bg-indigo-950">

                {/* Aurora blobs */}
                {blobs.map((blob, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            ...blob.style,
                            width: blob.size,
                            height: blob.size,
                            background: blob.color,
                            filter: 'blur(70px)',
                            mixBlendMode: 'screen',
                            opacity: 0.75,
                        }}
                        animate={blob.animate}
                        transition={{
                            duration: blob.duration,
                            repeat: Infinity,
                            ease: 'easeInOut' as const,
                        }}
                    />
                ))}

                {/* Subtle grid overlay */}
                {/* <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px',
                    }}
                /> */}

                {/* Content */}
                <div className="relative z-10">
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-indigo-300 mb-4">
                        Ready to prep smarter?
                    </p>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto mb-6">
                        Your next interview is a<br className="hidden sm:block" /> system you can reverse-engineer.
                    </h2>
                    <p className="text-sm text-indigo-200 max-w-md mx-auto mb-8 leading-relaxed">
                        Sign in with Google and start in under 60 seconds. No credit card, no setup, no fuss.
                    </p>
                    <button
                        onClick={onCTA}
                        className="bg-white text-indigo-700 font-bold text-sm px-8 py-4 rounded-xl hover:bg-indigo-50 transition shadow-lg shadow-indigo-900/40 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {user ? 'Go to workspace →' : "Get started — it's free"}
                    </button>
                </div>
            </div>
        </section>
    );
}
