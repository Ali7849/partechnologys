import type Lenis from 'lenis';

/**
 * Lenis singleton. Smooth scroll is the spine of the cinematic feel, so anything that moves
 * the page (the command palette, in-page links) must go THROUGH it — a native scrollTo would
 * fight the interpolation and snap. Falls back to native smooth scroll when Lenis is absent
 * (reduced motion, or before mount).
 */

let instance: Lenis | null = null;

export function setLenis(next: Lenis | null): void {
  instance = next;
}

/** Scroll to an element selector or an absolute Y offset. */
export function scrollToTarget(target: string | number, duration = 1.5): void {
  if (instance) {
    instance.scrollTo(target, { duration });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
    return;
  }
  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
