'use client';

import { useEffect } from 'react';

import { gsap } from '@/motion/ticker';
import { useReveal } from '@/motion/useReveal';
import { useSceneStore } from '@/state/useSceneStore';

import styles from './SectionGround.module.css';

/**
 * SECTION GROUND — drives the page ground between Cured and Substrate. Shared because F04
 * sets it to Substrate (the film's dark, silent middle) and F06 reverses it to Cured. The
 * ground is the whole page, not a box, so the fixed 3D subject stays visible above it.
 *
 * The ground colour changes first; the text ink follows 80ms later — the exact offset the
 * storyboard specifies, applied in both directions for consistency (BUILD_SPEC F04/F06).
 * Under reduced motion both switch instantly, no offset.
 */

type Props = { target: 'cured' | 'substrate' };

const IDLE = 'cured';

export function SectionGround({ target }: Props) {
  const ref = useReveal<HTMLDivElement>(() => {
    const reduced = useSceneStore.getState().capability >= 3;
    const body = document.body;

    if (target === 'substrate') {
      body.dataset.ground = 'substrate';
      if (reduced) body.dataset.ink = 'substrate';
      else gsap.delayedCall(0.08, () => (body.dataset.ink = 'substrate'));
    } else {
      body.dataset.ground = IDLE;
      if (reduced) delete body.dataset.ink;
      else gsap.delayedCall(0.08, () => delete body.dataset.ink);
    }
  });

  // Safety: if the homepage unmounts (route change) while the dark ground is set, restore it.
  useEffect(() => {
    return () => {
      delete document.body.dataset.ground;
      delete document.body.dataset.ink;
    };
  }, []);

  return <div ref={ref} className={styles.sentinel} aria-hidden="true" />;
}
