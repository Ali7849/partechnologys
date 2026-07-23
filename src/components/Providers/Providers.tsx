'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

import { setLenis } from '@/motion/lenis';
import { ensureGsap, gsap, ScrollTrigger } from '@/motion/ticker';

/**
 * Providers — page-wide setup, rendering no DOM of its own.
 *
 * Lenis gives the experience its cinematic scroll: the page interpolates rather than jumps,
 * which is what makes scroll-driven storytelling read as camera movement instead of paging.
 * It is driven from the single GSAP ticker (never its own rAF) and kept in sync with
 * ScrollTrigger, so there is exactly one animation clock. Disabled entirely under
 * prefers-reduced-motion, where native scroll is the honest behaviour.
 */

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureGsap();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    setLenis(lenis);

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
