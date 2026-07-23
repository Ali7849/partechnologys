'use client';

import { useEffect, useRef, useState } from 'react';

import { useExperience } from '@/state/useExperience';

import styles from './Opening.module.css';

const OPENING_ACCENT = '#7AA2F7';

/**
 * OPENING — the entry into PAR//OS. Not a hero section: a system coming online. The wordmark
 * resolves, the thesis states itself, and the visitor is handed the command interface rather
 * than a navigation bar. Everything below is one continuous journey through the seven pillars.
 */

const THESIS = 'We do not sell services. We build the systems other companies are built on — and this is the proof.';

export function Opening() {
  const [live, setLive] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Comes online just after mount, so the entry reads as a system booting rather than a page load.
  useEffect(() => {
    const id = window.setTimeout(() => setLive(true), 80);
    return () => window.clearTimeout(id);
  }, []);

  // Returns the environment to the opening's accent whenever it holds the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
            useExperience.getState().setAccent(OPENING_ACCENT);
          }
        }
      },
      { threshold: [0.35, 0.6] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={[styles.opening, live ? styles.live : ''].filter(Boolean).join(' ')}
      aria-labelledby="opening-title"
    >
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.inner}>
        <span className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          SYSTEM ONLINE
        </span>

        <h1 id="opening-title" className={styles.wordmark}>
          <span className={styles.par}>PAR</span>
          <span className={styles.slash} aria-hidden="true">
            {'//'}
          </span>
          <span className={styles.tech}>TECHNOLOGYS</span>
        </h1>

        <p className={styles.thesis}>{THESIS}</p>

        <div className={styles.enter}>
          <kbd className={styles.kbd}>⌘K</kbd>
          <span className={styles.enterLabel}>to open the command interface</span>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollLine} />
        SCROLL
      </div>
    </section>
  );
}
