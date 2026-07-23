'use client';

import { useState, type CSSProperties } from 'react';

import { useReveal } from '@/motion/useReveal';
import type { Pillar } from '../content/pillars';

import styles from './PillarSection.module.css';

/**
 * PILLAR SECTION — one world of the seven. Each carries its own accent and its own
 * environment (an accent field behind it), so moving down the page reads as travelling
 * through distinct worlds rather than stacked sections.
 *
 * Capabilities are not a list of bullets: each is an addressable cell that responds, and the
 * hovered cell drives the whole section's accent field — the section reacts to where you are.
 */

export function PillarSection({ pillar }: { pillar: Pillar }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const ref = useReveal<HTMLElement>(() => setRevealed(true), { threshold: 0.15 });

  return (
    <section
      ref={ref}
      id={pillar.id}
      aria-labelledby={`${pillar.id}-title`}
      className={[styles.pillar, revealed ? styles.revealed : ''].filter(Boolean).join(' ')}
      style={{ '--accent': pillar.accent } as CSSProperties}
    >
      {/* the world: an accent field that follows the active capability */}
      <div className={styles.field} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head}>
          <span className={styles.index}>{pillar.index}</span>
          <h2 id={`${pillar.id}-title`} className={styles.title}>
            {pillar.title}
          </h2>
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
              <span className={styles.cellIndex}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.cellLabel}>{capability}</span>
              <span className={styles.cellRule} aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
