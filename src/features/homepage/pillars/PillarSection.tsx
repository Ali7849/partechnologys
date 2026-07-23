'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { SplitText } from '@/components/SplitText/SplitText';
import { useReveal } from '@/motion/useReveal';
import { useExperience } from '@/state/useExperience';

import type { Pillar } from '../content/pillars';
import styles from './PillarSection.module.css';

/**
 * PILLAR SECTION — one world of the seven.
 *
 * Entering a pillar retints the entire environment: the section reports its accent to the
 * experience store and the fullscreen aurora shader eases toward it, so scrolling changes the
 * atmosphere rather than just moving content. The title arrives as kinetic type, and each
 * capability is an addressable cell that lights its own accent rule.
 */

export function PillarSection({ pillar }: { pillar: Pillar }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const accentRef = useRef<HTMLElement>(null);

  const ref = useReveal<HTMLElement>(() => setRevealed(true), { threshold: 0.15 });

  // Owns the environment while it holds the middle of the viewport.
  useEffect(() => {
    const el = accentRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
            useExperience.getState().setAccent(pillar.accent);
          }
        }
      },
      { threshold: [0.35, 0.6] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pillar.accent]);

  return (
    <section
      ref={(node) => {
        ref.current = node;
        accentRef.current = node;
      }}
      id={pillar.id}
      aria-labelledby={`${pillar.id}-title`}
      className={[styles.pillar, revealed ? styles.revealed : ''].filter(Boolean).join(' ')}
      style={{ '--accent': pillar.accent } as CSSProperties}
    >
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head}>
          <span className={styles.index}>{pillar.index}</span>
          <SplitText
            as="h2"
            id={`${pillar.id}-title`}
            text={pillar.title}
            revealed={revealed}
            className={styles.title}
            delay={0.05}
          />
          <p className={styles.lead}>{pillar.lead}</p>
        </header>

        <ul className={styles.capabilities}>
          {pillar.capabilities.map((capability, i) => (
            <li
              key={capability}
              className={[styles.cell, hovered === i ? styles.cellActive : '']
                .filter(Boolean)
                .join(' ')}
              style={{ '--i': String(i) } as CSSProperties}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
            >
              <span className={styles.cellIndex}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.cellLabel}>{capability}</span>
              <span className={styles.cellRule} aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
