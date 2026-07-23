'use client';

import { useEffect, useRef, useState } from 'react';

import { ensureGsap, ScrollTrigger } from '@/motion/ticker';
import { useWorld } from '@/state/useWorld';
import { COMMISSION_EMAIL } from '@/features/homepage/content/pillars';
import { SCENES, SCENE_COUNT } from '@/world/scenes';

import styles from './ScrollStage.module.css';

/**
 * SCROLL STAGE — the journey's only DOM.
 *
 * There are no sections. This renders one tall, empty scroll track whose sole job is to give
 * the camera something to travel along, plus a fixed overlay where each scene's content
 * emerges as the camera arrives at its waypoint and dissolves as it leaves.
 *
 * Scroll position is written to the world store every frame (off the shared GSAP ticker, in
 * sync with Lenis) and read by the camera and environment inside useFrame — so the 3D updates
 * at framerate while React only re-renders when the active scene actually changes.
 */

export function ScrollStage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // The galaxy gets the opening to itself — no copy competes with it for the first beats.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 3400);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    ensureGsap();

    const setProgress = useWorld.getState().setProgress;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        setProgress(self.progress);
        const nearest = Math.round(self.progress * (SCENE_COUNT - 1));
        setActive((current) => (current === nearest ? current : nearest));
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <>
      {/* the track: pure scroll length, no content — the world is the content */}
      <div
        ref={trackRef}
        className={styles.track}
        style={{ height: `${SCENE_COUNT * 100}vh` }}
        aria-hidden="true"
      />

      <div className={styles.stage}>
        {SCENES.map((scene, i) => (
          <article
            key={scene.id}
            id={scene.id}
            className={[
              styles.caption,
              ready && i === active ? styles.active : '',
              scene.kind === 'close' ? styles.centred : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ ['--accent' as string]: scene.accent }}
            aria-hidden={i === active ? undefined : true}
          >
            <span className={styles.eyebrow}>{scene.eyebrow}</span>

            <h2 className={styles.title}>
              {scene.title.split('\n').map((line, l) => (
                <span key={l} className={styles.line}>
                  <span className={styles.lineInner}>{line}</span>
                </span>
              ))}
            </h2>

            {scene.kind === 'close' ? (
              <a className={styles.mail} href={`mailto:${COMMISSION_EMAIL}`}>
                {COMMISSION_EMAIL}
              </a>
            ) : (
              <p className={styles.lead}>{scene.lead}</p>
            )}

            {scene.capabilities.length > 0 ? (
              <ul className={styles.manifest}>
                {scene.capabilities.map((c, ci) => (
                  <li
                    key={c}
                    className={styles.manifestItem}
                    style={{ ['--i' as string]: String(ci) }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </>
  );
}
