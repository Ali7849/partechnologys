'use client';

import { useEffect, type RefObject } from 'react';

import { useSceneStore } from '@/state/useSceneStore';
import { ensureGsap, requestRender, ScrollTrigger } from './ticker';

/**
 * useScrollProgress — binds native scroll position to a 0–1 progress value across a target
 * element, and writes it to the store. Used by F02's section-cut scrub.
 *
 * Native scroll is NEVER touched (no preventDefault, no scrollTo). ScrollTrigger samples
 * scroll on the shared GSAP ticker — not a scroll event listener — and `scrub` gives the
 * smoothing the section plane needs while the page itself stays instant (ARCHITECTURE
 * Part 0: lerp the value, not the scroll).
 */

export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  options?: { scrub?: number; onUpdate?: (progress: number) => void; disabled?: boolean },
): void {
  const setScrollProgress = useSceneStore((s) => s.setScrollProgress);

  // Creates a scrubbed ScrollTrigger over the target; disposes it on unmount.
  useEffect(() => {
    const el = target.current;
    if (!el || options?.disabled) return;

    ensureGsap();
    const scrub = options?.scrub ?? 0.3;
    const onUpdate = options?.onUpdate;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub,
      onUpdate: (self) => {
        const progress = self.progress;
        setScrollProgress(progress);
        onUpdate?.(progress);
        requestRender();
      },
    });

    return () => trigger.kill();
  }, [target, options?.scrub, options?.onUpdate, options?.disabled, setScrollProgress]);
}
