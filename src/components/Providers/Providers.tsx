'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

import { useCapability } from '@/motion/useCapability';
import { ensureGsap, gsap, ScrollTrigger } from '@/motion/ticker';

/**
 * Providers — the one client boundary that runs page-wide setup, rendering no DOM of its
 * own beyond its children. It (1) resolves the capability level into the store, and
 * (2) initialises smooth scroll.
 *
 * Note on Lenis: the original architecture rejected it; per the founder's stack decision
 * it is included, but gated — it is DISABLED under prefers-reduced-motion, and it is driven
 * from the single GSAP ticker (not its own rAF) with ScrollTrigger kept in sync, so the
 * "one rAF loop" rule holds. Native keyboard scroll and anchors continue to function.
 */

export function Providers({ children }: { children: React.ReactNode }) {
  useCapability();

  // Sets up GSAP + Lenis smooth scroll, synchronised on a single ticker. Torn down on unmount.
  useEffect(() => {
    ensureGsap();

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
