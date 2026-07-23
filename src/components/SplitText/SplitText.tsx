'use client';

import { createElement, type CSSProperties, type ElementType } from 'react';

import styles from './SplitText.module.css';

/**
 * SPLIT TEXT — kinetic typography. Text is split into words and characters, each masked by an
 * overflow-hidden wrapper and lifted into place on a stagger, so a heading arrives as a
 * sequence rather than a fade. Words never break mid-word because the mask is per-word.
 *
 * Accessibility: the split spans are aria-hidden and the full string is exposed once via
 * aria-label, so a screen reader reads the sentence, not a stream of letters.
 */

type Props = {
  text: string;
  as?: ElementType;
  className?: string | undefined;
  revealed: boolean;
  /** Seconds before the first character moves. */
  delay?: number;
  /** Seconds between consecutive characters. */
  stagger?: number;
  id?: string | undefined;
};

export function SplitText({
  text,
  as = 'span',
  className,
  revealed,
  delay = 0,
  stagger = 0.022,
  id,
}: Props) {
  const words = text.split(' ');
  let charIndex = 0;

  return createElement(
    as,
    {
      id,
      className: [styles.split, revealed ? styles.revealed : '', className]
        .filter(Boolean)
        .join(' '),
      'aria-label': text,
    },
    <span aria-hidden="true">
      {words.map((word, w) => (
        <span key={`${word}-${w}`} className={styles.word}>
          {Array.from(word).map((char, c) => {
            const i = charIndex++;
            return (
              <span
                key={`${char}-${c}`}
                className={styles.char}
                style={{ '--d': `${delay + i * stagger}s` } as CSSProperties}
              >
                {char}
              </span>
            );
          })}
          {w < words.length - 1 ? <span className={styles.space}> </span> : null}
        </span>
      ))}
    </span>,
  );
}
