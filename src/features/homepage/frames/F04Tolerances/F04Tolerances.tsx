'use client';

import { useRef } from 'react';

import { SectionGround } from '@/components/SectionGround/SectionGround';
import { EASE_FN } from '@/motion/easing';
import { ensureGsap, gsap } from '@/motion/ticker';
import { useReveal } from '@/motion/useReveal';
import { Text } from '@/primitives/Text/Text';
import { useSceneStore } from '@/state/useSceneStore';
import { T } from '@/styles/tokens';

import { TOLERANCES } from '../../content/placeholders';
import styles from './F04Tolerances.module.css';

/**
 * F04 — THE TOLERANCES. The ground turns to Substrate, the page goes silent, and four real,
 * stated limits are presented as a specification sheet — no interaction, no CTA. This is the
 * page's quietest, most legible, and cheapest frame; a QA pass that finds any interactive
 * affordance here is a defect (BUILD_SPEC F04).
 *
 * The fourth row — "What we refused" — is called out across three documents as the single
 * most persuasive element on the homepage, and must not ship a fabricated value. It reads
 * PENDING until a real refusal is provided.
 */

export function F04Tolerances() {
  const listRef = useRef<HTMLDListElement>(null);

  const frameRef = useReveal<HTMLElement>(() => {
    const store = useSceneStore.getState();
    store.setActiveFrame('F04');
    // Station and light are unchanged from F03 — the camera does not move here.

    const list = listRef.current;
    if (!list || store.capability >= 3) return;

    ensureGsap();
    gsap.from(list.children, {
      opacity: 0,
      duration: T.considered,
      ease: EASE_FN.settle,
      stagger: 0.06,
    });
  });

  return (
    <section ref={frameRef} className={styles.frame} aria-labelledby="f04-heading">
      <SectionGround target="substrate" />

      <div className={styles.inner}>
        <Text as="span" scale="m2" tone="zinc" className={styles.eyebrow}>
          F04 · Tolerances
        </Text>
        <Text as="h2" scale="h2" id="f04-heading" className={styles.heading}>
          Stated limits.
        </Text>

        <dl ref={listRef} className={styles.specs}>
          {TOLERANCES.map((t, i) => (
            <div
              key={t.label}
              className={[styles.row, i === TOLERANCES.length - 1 ? styles.refusal : '']
                .filter(Boolean)
                .join(' ')}
            >
              <Text as="dt" scale="m2" tone="zinc" className={styles.label}>
                {t.label}
              </Text>
              <Text as="dd" scale="b1" className={styles.value}>
                {t.value}
              </Text>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
