'use client';

import { useEffect, useRef } from 'react';

import { ensureGsap, gsap } from '@/motion/ticker';

import styles from './PlotterText.module.css';

/**
 * The plotter reveal — the ONLY display-scale text animation in the system (Motion Part 11).
 * A clip-path inset uncovers the line left→right at CONSTANT velocity ("a plotter has one
 * speed" — no easing on the wipe), with a 1px Prussian rule travelling at the leading edge
 * and fading over the final 120ms. D1/D2 only, once per page.
 *
 * The text node is real and present from t=0 — the animation is purely visual, so assistive
 * tech reads the headline immediately, never progressively.
 */

type Props = {
  children: string;
  className?: string | undefined;
  delay?: number;
};

export function PlotterText({ children, className, delay = 0 }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  // Runs the constant-velocity clip reveal after mount; instant under reduced motion.
  useEffect(() => {
    ensureGsap();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rule = wrap.querySelector<HTMLSpanElement>(`.${styles.rule}`);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(wrap, { clipPath: 'inset(0 0% 0 0)' });
      if (rule) gsap.set(rule, { opacity: 0 });
      return;
    }

    const tl = gsap.timeline({ delay });
    tl.fromTo(
      wrap,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 0.48, ease: 'none' },
    );
    if (rule) {
      tl.fromTo(rule, { left: '0%', opacity: 1 }, { left: '100%', duration: 0.48, ease: 'none' }, 0);
      tl.to(rule, { opacity: 0, duration: 0.12 }, 0.36);
    }
    return () => {
      tl.kill();
    };
  }, [delay]);

  return (
    <span ref={wrapRef} className={[styles.plotter, className].filter(Boolean).join(' ')}>
      {children}
      <span className={styles.rule} aria-hidden="true" />
    </span>
  );
}
