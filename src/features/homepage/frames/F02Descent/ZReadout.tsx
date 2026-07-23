import type { RefObject } from 'react';

import { Text } from '@/primitives/Text/Text';

import styles from './F02Descent.module.css';

/**
 * Z READOUT — the live section-plane coordinate, in the subject's own model units. It is
 * aria-live="off": a value that changes every frame must never be announced (the persistent
 * hidden subject description from S4 carries the real, static equivalent). F02 writes the
 * value straight to the span via ref, never through React state — no re-render per frame.
 */

export function ZReadout({ valueRef }: { valueRef: RefObject<HTMLSpanElement | null> }) {
  return (
    <div className={styles.readout} aria-live="off">
      <Text as="span" scale="m3" tone="zinc">
        SECTION Z
      </Text>
      <span ref={valueRef} className={styles.readoutValue} data-mono>
        +1.50u
      </span>
    </div>
  );
}
