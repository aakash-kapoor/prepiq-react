import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
    /** Controls whether the simulated progress is running */
    isActive: boolean;
    message?: string;
}

/**
 * Simulates progress for operations with no real progress signal (e.g. an AI API call).
 * Eases toward ~90% while active, then snaps to 100% and fades out once isActive flips false.
 * This avoids the dishonesty of a determinate bar with fake precision while still feeling alive.
 */
export default function ProgressBar({ isActive, message = 'Processing...' }: ProgressBarProps) {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isActive) {
            setVisible(true);
            setProgress(8);
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev;
                    // Slows down as it approaches 90 — classic "almost done" feel
                    const remaining = 90 - prev;
                    return prev + remaining * 0.08;
                });
            }, 200);
            return () => clearInterval(interval);
        } else {
            setProgress(100);
            const timeout = setTimeout(() => setVisible(false), 400);
            return () => clearTimeout(timeout);
        }
    }, [isActive]);

    if (!visible) return null;

    return (
        <div className="w-full space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{message}</span>
                <span className="text-xs font-bold text-indigo-600 tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-[#6366F1] rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', damping: 25, stiffness: 80 }}
                />
            </div>
        </div>
    );
}
