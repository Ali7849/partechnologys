'use client';

import { useRef } from 'react';

import { requestRender } from '@/motion/ticker';
import { useReveal } from '@/motion/useReveal';
import { useScrollProgress } from '@/motion/useScrollProgress';
import { Text } from '@/primitives/Text/Text';
import { useSceneStore } from '@/state/useSceneStore';

import { ZReadout } from './ZReadout';
import styles from './F02Descent.module.css';

/**
 * F02 — THE DESCENT. Scroll stops being navigation and becomes instrumentation: a cutting
 * plane descends through the subject, driven 1:1 by native scroll, with zero copy. This is
 * the page's entire scrub budget, spent here in full — the only scrubbed frame, and the only
 * frame with no GSAP timeline (BUILD_SPEC F02).
 *
 * The stencil section-cut uniform in the 3D subject reads scrollProgress from the store inside
 * useFrame; here the same value drives a drafting instrument in the DOM — a graduated Z-scale
 * and a coordinate callout that rides the descending cut line — written straight to the DOM
 * (no per-frame React render). Native scroll is never touched.
 */

// Model-space clip coordinate the plane travels through (mirrors PlaceholderSubject).
const Z_TOP = 2.0;
const Z_RANGE = 2.9;

// Static graduations for the drafting scale (top → bottom of travel).
const TICKS = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
  f,
  label: (Z_TOP - f * Z_RANGE).toFixed(1),
}));

export function F02Descent() {
  const lineRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const reduced = useSceneStore((s) => s.capability >= 3);

  // Marks F02 active on entry (not on mount — that would override F01 at the top of the page).
  // Under reduced motion the cut jumps straight to its sectioned end-state, no scrub.
  const frameRef = useReveal<HTMLElement>(() => {
    const store = useSceneStore.getState();
    store.setActiveFrame('F02');
    if (store.capability >= 3) {
      store.setScrollProgress(1);
      if (lineRef.current) lineRef.current.style.transform = 'translateY(100%)';
      if (valueRef.current) valueRef.current.textContent = `${(Z_TOP - Z_RANGE).toFixed(2)}u`;
      requestRender();
    }
  });

  // The single scrub. Positions the DOM cut line and writes the Z value directly, off the ticker.
  useScrollProgress(frameRef, {
    disabled: reduced,
    onUpdate: (progress) => {
      if (lineRef.current) lineRef.current.style.transform = `translateY(${progress * 100}%)`;
      if (valueRef.current) {
        valueRef.current.textContent = `${(Z_TOP - progress * Z_RANGE).toFixed(2)}u`;
      }
    },
  });

  return (
    <section ref={frameRef} className={styles.frame} aria-labelledby="f02-heading">
      <div className={styles.sticky}>
        <h2 id="f02-heading" className="visually-hidden">
          The system, shown in section
        </h2>

        {/* graduated Z-scale — the fixed reference the cut travels against */}
        <div className={styles.scale} aria-hidden="true">
          {TICKS.map((t) => (
            <div key={t.f} className={styles.tick} style={{ top: `${t.f * 100}%` }}>
              <span className={styles.tickMark} />
              <span className={styles.tickLabel} data-mono>
                {t.label}
              </span>
            </div>
          ))}
        </div>

        {/* the descending cut line — carries the plane tag and the coordinate callout */}
        <div className={styles.track}>
          <div ref={lineRef} className={styles.plane}>
            <Text as="span" scale="m3" tone="prussian" className={styles.planeTag}>
              SECTION PLANE
            </Text>
            <span className={styles.arrow} aria-hidden="true" />
            <div className={styles.callout}>
              <ZReadout valueRef={valueRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
