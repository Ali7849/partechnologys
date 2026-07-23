'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * useReveal — fire-once scroll reveal via IntersectionObserver (Mode A, the default 95%
 * of cases). Enters at 20% viewport intrusion, animates once, and NEVER re-triggers on
 * scroll-back (Motion System Part 3). No scroll event listener.
 *
 * Returns a ref to attach to the target. `onReveal` runs exactly once.
 */

export function useReveal<T extends HTMLElement>(
  onReveal: () => void,
  options?: { threshold?: number; disabled?: boolean },
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const firedRef = useRef(false);
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  // Observes the element and calls onReveal a single time when it crosses the threshold.
  useEffect(() => {
    const el = ref.current;
    if (!el || options?.disabled) return;

    const threshold = options?.threshold ?? 0.2;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedRef.current) {
            firedRef.current = true;
            onRevealRef.current();
            observer.disconnect();
          }
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.disabled]);

  return ref;
}
