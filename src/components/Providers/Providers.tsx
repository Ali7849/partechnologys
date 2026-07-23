'use client';

import { useEffect } from 'react';

import { ensureGsap } from '@/motion/ticker';
import { useCapability } from '@/motion/useCapability';

/**
 * Providers — the one client boundary that runs page-wide setup, rendering no DOM of its own.
 * It (1) resolves the capability level into the store and (2) registers the single GSAP ticker.
 *
 * Native scroll is never touched (Motion Bible / CLAUDE.md Motion Law IV): no smooth-scroll
 * library, no scroll hijacking, no second rAF loop. ScrollTrigger samples native scroll on the
 * shared ticker; the only value ever smoothed is the animated one itself — F02's section-cut
 * scrub — not the page scroll. Lenis was removed here because the documentation rejects it and
 * no documented interaction requires it.
 */

export function Providers({ children }: { children: React.ReactNode }) {
  useCapability();

  // Registers the single GSAP ticker + ScrollTrigger once, page-wide.
  useEffect(() => {
    ensureGsap();
  }, []);

  return <>{children}</>;
}
