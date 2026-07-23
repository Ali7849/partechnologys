'use client';

import { useRef } from 'react';

import { FrameExpansion } from '@/components/FrameExpansion/FrameExpansion';
import { EASE_FN } from '@/motion/easing';
import { ensureGsap, gsap } from '@/motion/ticker';
import { useReveal } from '@/motion/useReveal';
import { Text } from '@/primitives/Text/Text';
import { useSceneStore } from '@/state/useSceneStore';
import { T } from '@/styles/tokens';

import { NODES, NODE_LEGEND } from '../../content/placeholders';
import { Legend } from './Legend';
import styles from './F05Turn.module.css';

/**
 * F05 — THE TURN. Everything recontextualises: the camera pulls to plan, the frame expands
 * to full bleed (the one time on the whole site), and the subject shrinks to a single node
 * among the entire real deployment field. The camera move, frame expansion, light lift, and
 * (when built) sub-bass swell are frame-synchronised — "the simultaneity is the entire
 * effect" — so they share one start and one duration (BUILD_SPEC F05).
 *
 * The field itself is an InstancedMesh in the Stage (mounted only while F05 is active). Its
 * data is synthetic and blocked (D4); the complete, screen-reader-navigable list below is the
 * frame's real persuasive content and must never exist only as an unlabeled visual field.
 */

export function F05Turn() {
  const contentRef = useRef<HTMLDivElement>(null);

  const frameRef = useReveal<HTMLElement>(() => {
    const store = useSceneStore.getState();
    store.setActiveFrame('F05'); // mounts the node field in the Stage
    store.setStation('plan');
    store.setLightIntensity(1);

    const content = contentRef.current;
    if (!content || store.capability >= 3) return;

    ensureGsap();
    gsap.from(content.children, {
      opacity: 0,
      duration: T.standard,
      ease: EASE_FN.settle,
      stagger: 0.06,
      delay: 0.12,
    });
  });

  return (
    <section ref={frameRef} className={styles.frame} aria-labelledby="f05-heading">
      <FrameExpansion>
        <div ref={contentRef} className={styles.content}>
          <Text as="p" scale="d3" id="f05-heading" className={styles.sentence}>
            Software firms study operations. We run one.
          </Text>
          <Legend
            subjectName={NODE_LEGEND.subjectName}
            parSystems={NODE_LEGEND.parSystems}
            pontisSites={NODE_LEGEND.pontisSites}
          />
        </div>
      </FrameExpansion>

      {/* The real content of the frame for assistive tech — the field is decorative without it. */}
      <div className="visually-hidden">
        <h2 id="f05-list-heading">The deployment field</h2>
        <p>
          Placeholder field — real deployment count and positions are pending project material
          (Data Contract D4). The list below is synthetic.
        </p>
        <ul aria-labelledby="f05-list-heading">
          {NODES.map((node) => (
            <li key={node.id}>
              {node.type === 'pontis-site' ? 'Pontis site' : 'PAR system'}
              {node.isSubject ? ' — the subject shown above' : ''}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
