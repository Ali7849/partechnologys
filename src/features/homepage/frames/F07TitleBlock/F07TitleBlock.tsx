'use client';

import { Button } from '@/primitives/Button/Button';
import { EASE_FN } from '@/motion/easing';
import { ensureGsap, gsap } from '@/motion/ticker';
import { useReveal } from '@/motion/useReveal';
import { Text } from '@/primitives/Text/Text';
import { useSceneStore } from '@/state/useSceneStore';
import { T } from '@/styles/tokens';

import { COMMISSION_EMAIL } from '../../content/placeholders';
import styles from './F07TitleBlock.module.css';

/**
 * F07 — TITLE BLOCK. Resolve. The opening sentence repeats, one control, one email — full
 * stop. This is the one frame with no entrance choreography beyond a simple opacity fade:
 * "every animation on the page has ended" by this point (BUILD_SPEC F07). After it settles
 * the page is at rest — zero scripted activity, the verification point for the whole film.
 */

export function F07TitleBlock() {
  const ref = useReveal<HTMLElement>(() => {
    const store = useSceneStore.getState();
    store.setActiveFrame('F07');
    store.setStation('iso');
    store.setLightIntensity(1);

    if (store.capability >= 3) return;
    ensureGsap();
    gsap.from(ref.current?.children ?? [], {
      opacity: 0,
      duration: T.standard,
      ease: EASE_FN.settle,
      stagger: 0.06,
    });
  });

  return (
    <section ref={ref} className={styles.frame} aria-labelledby="f07-heading">
      <Text as="h2" scale="d3" id="f07-heading" className={styles.headline}>
        We build systems that hold.
      </Text>

      <div className={styles.actions}>
        <Button tier="primary" href="/commission">
          Start a commission
        </Button>
        <a href={`mailto:${COMMISSION_EMAIL}`} className={styles.email} data-mono>
          {COMMISSION_EMAIL}
        </a>
      </div>
    </section>
  );
}
