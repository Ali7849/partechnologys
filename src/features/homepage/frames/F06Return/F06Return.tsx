'use client';

import { useRef } from 'react';

import { SectionGround } from '@/components/SectionGround/SectionGround';
import { EASE_FN } from '@/motion/easing';
import { ensureGsap, gsap, requestRender } from '@/motion/ticker';
import { useReveal } from '@/motion/useReveal';
import { Text } from '@/primitives/Text/Text';
import { useSceneStore } from '@/state/useSceneStore';
import { T } from '@/styles/tokens';

import { REFUSALS, TERMS } from '../../content/placeholders';
import styles from './F06Return.module.css';

/**
 * F06 — THE RETURN. Camera and frame return home (plan → iso, full bleed → bounded, rail
 * returns) and the subject reassembles — the clip plane that has been open since F02 closes,
 * the same section shader run in reverse. Terms and refusals are stated in a 7:4 asymmetric
 * layout: the film's confidence beat, no motion drama (BUILD_SPEC F06).
 *
 * The engagement floor is a public commercial commitment (Data Contract D5) and reads PENDING
 * until founder-approved — shipping a placeholder number here would be worse than not shipping.
 */

export function F06Return() {
  const gridRef = useRef<HTMLDivElement>(null);

  const frameRef = useReveal<HTMLElement>(() => {
    const store = useSceneStore.getState();
    store.setActiveFrame('F06'); // node field unmounts; subject rig eases back to full scale
    store.setStation('iso');
    store.setLightIntensity(1);
    delete document.body.dataset.frame; // rail returns (reverse of F05 expansion)

    const reduced = store.capability >= 3;

    // Reassemble: close the clip (scrollProgress 1 → 0), the F02 section shader in reverse.
    if (reduced) {
      store.setScrollProgress(0);
      requestRender();
    } else {
      const proxy = { v: store.scrollProgress };
      gsap.to(proxy, {
        v: 0,
        duration: 0.8,
        ease: EASE_FN.settle,
        onUpdate: () => {
          store.setScrollProgress(proxy.v);
          requestRender();
        },
      });
    }

    const grid = gridRef.current;
    if (!grid || reduced) return;
    ensureGsap();
    gsap.from(grid.querySelectorAll('[data-reveal]'), {
      opacity: 0,
      duration: T.standard,
      ease: EASE_FN.settle,
      stagger: 0.06,
    });
  });

  return (
    <section ref={frameRef} className={styles.frame} aria-labelledby="f06-terms-heading">
      <SectionGround target="cured" />

      <div ref={gridRef} className={styles.grid}>
        <section className={styles.terms} aria-labelledby="f06-terms-heading">
          <Text as="span" scale="m2" tone="prussian" data-reveal className={styles.eyebrow}>
            F06 · The return
          </Text>
          <Text as="h2" scale="h2" id="f06-terms-heading" data-reveal>
            How we work.
          </Text>
          <ul className={styles.list}>
            {TERMS.bullets.map((bullet) => (
              <li key={bullet} data-reveal>
                <Text as="span" scale="b1">
                  {bullet}
                </Text>
              </li>
            ))}
          </ul>
          <div className={styles.floor} data-reveal>
            <Text as="span" scale="m2" tone="zinc">
              Engagement floor
            </Text>
            <Text as="span" scale="h3">
              {TERMS.engagementFloor}
            </Text>
          </div>
        </section>

        <section className={styles.refusals} aria-labelledby="f06-refusals-heading">
          <Text as="h2" scale="h2" id="f06-refusals-heading" data-reveal>
            What we do not take on.
          </Text>
          <ul className={styles.list}>
            {REFUSALS.map((refusal) => (
              <li key={refusal} data-reveal>
                <Text as="span" scale="b1">
                  {refusal}
                </Text>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
