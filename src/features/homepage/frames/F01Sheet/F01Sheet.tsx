'use client';

import { useEffect } from 'react';

import { Text } from '@/primitives/Text/Text';
import { useSceneStore } from '@/state/useSceneStore';

import { SUBJECT, SUBJECT_LINE } from '../../content/placeholders';
import { PlotterText } from './PlotterText';
import { ScrollCue } from './ScrollCue';
import { SubjectStatic } from './SubjectStatic';
import styles from './F01Sheet.module.css';

/**
 * F01 — THE SHEET. Asymmetric opposition: text on columns 2–6, object on 7–12, extending
 * slightly past the right boundary so it reads as an object placed on the sheet, not an
 * image in a box. No paragraph, no subheading, no badges, no CTA — the absence of a call to
 * action IS the positioning statement (Wireframe F01).
 *
 * The 3D subject mounts here later via the Stage slot; until then (and at capability 3/4)
 * the hand-drawn static axonometric stands in.
 */

export function F01Sheet() {
  const setActiveFrame = useSceneStore((s) => s.setActiveFrame);
  // At capability 1–2 the persistent WebGL subject shows through this slot from the Scene
  // layer behind the DOM; the static axonometric is the level-3/4 (and no-WebGL) stand-in.
  const hasCanvas = useSceneStore((s) => s.capability <= 2);

  // Marks F01 as the active frame so the rail shows the correct section reference.
  useEffect(() => {
    setActiveFrame('F01');
  }, [setActiveFrame]);

  return (
    <section className={styles.frame} aria-labelledby="f01-heading">
      <div className={styles.text}>
        <Text as="h1" scale="d1" id="f01-heading" className={styles.headline}>
          <PlotterText>We build systems that hold.</PlotterText>
        </Text>
        <Text as="p" scale="m3" tone="zinc" className={styles.subject}>
          {SUBJECT_LINE}
        </Text>
      </div>

      <div className={styles.object}>
        {hasCanvas ? null : <SubjectStatic />}
        <p className="visually-hidden">
          {`Axonometric drawing of the subject system (${SUBJECT.name}). The real system is
          pending project material; this is a placeholder object.`}
        </p>
      </div>

      <div className={styles.cue}>
        <ScrollCue />
      </div>
    </section>
  );
}
