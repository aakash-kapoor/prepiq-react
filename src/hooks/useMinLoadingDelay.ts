import { useState, useRef, useCallback } from 'react';

/**
 * Guarantees the loading state stays true for at least minMs milliseconds.
 * If data arrives before the minimum time, the skeleton stays visible for the
 * remainder. If data takes longer, the skeleton disappears immediately on arrival.
 *
 * Usage:
 *   const { loading, markDone, cancelTimer } = useMinLoadingDelay(600);
 *   // call markDone() inside your Firestore onSnapshot callback
 *   // call cancelTimer() in your useEffect cleanup
 */
export function useMinLoadingDelay(minMs = 600) {
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef(Date.now());

  const markDone = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const elapsed = Date.now() - startRef.current;
    const remaining = Math.max(0, minMs - elapsed);
    timerRef.current = setTimeout(() => setLoading(false), remaining);
  }, [minMs]);

  const cancelTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { loading, markDone, cancelTimer };
}
