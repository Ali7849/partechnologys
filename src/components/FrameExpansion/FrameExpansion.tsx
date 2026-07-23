'use client';

import { useState } from 'react';

import { useReveal } from '@/motion/useReveal';
import { useSceneStore } from '@/state/useSceneStore';

import styles from './FrameExpansion.module.css';

/**
 * FRAME EXPANSION (F05) — the one full-bleed moment on the entire site: the content field
 * widens from the bounded 12-column grid to full bleed and the Rail retracts, so the node
 * field reads at the scale of the whole operation. F06 reverses it (rail returns).
 *
 * Deliberately NOT attempted at mobile width or under reduced motion — per the wireframe,
 * forcing an IMAX expansion into a 375px viewport is "an imitation of the effect." There the
 * subject simply shrinks to a node in place (SubjectRig's F05 pose) with no width/rail change.
 */

export function FrameExpansion({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  const ref = useReveal<HTMLDivElement>(() => {
    const reduced = useSceneStore.getState().capability >= 3;
    const isDesktop = window.matchMedia('(min-width: 901px)').matches;
    if (reduced || !isDesktop) return;
    setExpanded(true);
    document.body.dataset.frame = 'full';
  });

  return (
    <div
      ref={ref}
      className={[styles.container, expanded ? styles.expanded : ''].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}
