'use client';

import { useRef } from 'react';

import { Annotation } from '@/components/Annotation/Annotation';
import { ensureGsap, gsap } from '@/motion/ticker';
import { useReveal } from '@/motion/useReveal';
import { Text } from '@/primitives/Text/Text';
import { useSceneStore } from '@/state/useSceneStore';
import { T } from '@/styles/tokens';
import { EASE_FN } from '@/motion/easing';

import { ANNOTATIONS, F03_BODY } from '../../content/placeholders';
import styles from './F03Inside.module.css';

/**
 * F03 — INSIDE. The subject turns from graphic to evidence. On entry the camera moves for
 * the first time (iso → section) and the light dims (1.0 → 0.7), both once, concurrently.
 * Annotations draw in with their leader lines; hovering one lights the linked 3D component
 * via the store — two reconciler trees, one source of truth, no raycast (BUILD_SPEC F03).
 *
 * Fires exactly once (useReveal disconnects); it never re-triggers on scroll-back.
 */

export function F03Inside() {
  const listRef = useRef<HTMLDListElement>(null);
  const hoveredId = useSceneStore((s) => s.hoveredId);
  const setHoveredId = useSceneStore((s) => s.setHoveredId);

  const frameRef = useReveal<HTMLElement>(() => {
    const store = useSceneStore.getState();
    store.setActiveFrame('F03');
    store.setStation('section');
    store.setLightIntensity(0.7);

    const list = listRef.current;
    if (!list) return;
    const leaders = list.querySelectorAll('[data-leader]');
    const items = list.children;

    if (store.capability >= 3) {
      gsap.set(leaders, { strokeDashoffset: 0 });
      return;
    }

    ensureGsap();
    gsap.from(items, {
      opacity: 0,
      y: 12,
      duration: T.considered,
      ease: EASE_FN.settle,
      stagger: 0.06,
    });
    gsap.to(leaders, {
      strokeDashoffset: 0,
      duration: T.considered,
      ease: EASE_FN.settle,
      stagger: 0.06,
    });
  });

  return (
    <section ref={frameRef} className={styles.frame} aria-labelledby="f03-heading">
      <div className={styles.copy}>
        <Text as="span" scale="m2" tone="prussian" className={styles.eyebrow}>
          F03 · Inside
        </Text>
        <Text as="h2" scale="h1" id="f03-heading" className={styles.heading}>
          A real object has an inside.
        </Text>
        <Text as="p" scale="b1" className={styles.body}>
          {F03_BODY}
        </Text>
      </div>

      <dl ref={listRef} className={styles.list}>
        {ANNOTATIONS.map((a) => (
          <Annotation
            key={a.id}
            label={a.label}
            value={a.value}
            active={hoveredId === a.id}
            onHoverChange={(hovered) => setHoveredId(hovered ? a.id : null)}
          />
        ))}
      </dl>
    </section>
  );
}
