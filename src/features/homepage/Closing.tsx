'use client';

import { useState } from 'react';

import { useReveal } from '@/motion/useReveal';

import { COMMISSION_EMAIL } from './content/pillars';
import styles from './Closing.module.css';

/**
 * CLOSING — the journey resolves. One statement, one address. The proof was the experience
 * itself; this is only where to reach the people who built it.
 */

export function Closing() {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const ref = useReveal<HTMLElement>(() => setRevealed(true), { threshold: 0.2 });

  const copy = () => {
    void navigator.clipboard
      ?.writeText(COMMISSION_EMAIL)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => undefined);
  };

  return (
    <section
      ref={ref}
      id="commission"
      aria-labelledby="closing-title"
      className={[styles.closing, revealed ? styles.revealed : ''].filter(Boolean).join(' ')}
    >
      <div className={styles.field} aria-hidden="true" />

      <div className={styles.inner}>
        <h2 id="closing-title" className={styles.title}>
          If we built this for ourselves,
          <br />
          imagine what we build for you.
        </h2>

        <div className={styles.actions}>
          <a className={styles.primary} href={`mailto:${COMMISSION_EMAIL}`}>
            Start a commission
          </a>
          <button type="button" className={styles.copy} onClick={copy}>
            <span className={styles.copyValue}>{COMMISSION_EMAIL}</span>
            <span className={styles.copyState}>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>

        <p className={styles.foot}>
          PAR TECHNOLOGYS — intelligence, software, infrastructure, and the experiences on top
          of them.
        </p>
      </div>
    </section>
  );
}
