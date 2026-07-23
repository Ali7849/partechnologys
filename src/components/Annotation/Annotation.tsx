'use client';

import { Text } from '@/primitives/Text/Text';

import styles from './Annotation.module.css';

/**
 * ANNOTATION (F03) — one row of the interior specification, rendered as a real <dt>/<dd>
 * pairing inside the frame's <dl>. Focusable, so keyboard focus triggers the same 3D
 * component highlight as pointer hover (the link is one-directional: text drives 3D).
 *
 * Lives in components/, not the F03 feature, because the "rule of two" applies — it is reused
 * by future case-study pages. The leader line is aria-hidden and drawn by F03's timeline
 * (which selects it via [data-leader]); the <dl> alone carries the real, complete content.
 */

type Props = {
  label: string;
  value: string;
  active: boolean;
  onHoverChange: (hovered: boolean) => void;
  linksTo?: string | undefined;
};

export function Annotation({ label, value, active, onHoverChange, linksTo }: Props) {
  return (
    <div
      className={[styles.item, active ? styles.active : ''].filter(Boolean).join(' ')}
      tabIndex={0}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onFocus={() => onHoverChange(true)}
      onBlur={() => onHoverChange(false)}
    >
      <svg className={styles.leader} viewBox="0 0 64 8" aria-hidden="true" focusable="false">
        <line
          data-leader
          x1="0"
          y1="4"
          x2="60"
          y2="4"
          pathLength={1}
          className={styles.leaderLine}
        />
        <circle cx="62" cy="4" r="2" className={styles.leaderDot} />
      </svg>

      <Text as="dt" scale="m2" className={styles.label}>
        {label}
      </Text>
      <Text as="dd" scale="m1" className={styles.value}>
        {linksTo ? (
          <a href={linksTo} className={styles.link}>
            {value}
          </a>
        ) : (
          <span data-mono>{value}</span>
        )}
      </Text>
    </div>
  );
}
