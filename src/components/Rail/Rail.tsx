'use client';

import { useSceneStore } from '@/state/useSceneStore';

import styles from './Rail.module.css';

/**
 * Rail — the persistent 64px annotation margin, taken from an engineering drawing sheet.
 * Carries position, not links (IA Part 4): section reference, revision, sequence.
 *
 * The metadata block is aria-hidden — it is supplementary drawing-sheet information, never
 * the sole carrier of navigable content. The sound toggle is a real focusable control and
 * therefore lives OUTSIDE the aria-hidden block (an aria-hidden ancestor would hide it).
 */

type Props = {
  side: 'left' | 'right';
};

const FRAME_SECTION: Record<string, string> = {
  F01: 'SEC 01',
  F02: 'SEC 02',
  F03: 'SEC 03',
  F04: 'SEC 04',
  F05: 'SEC 05',
  F06: 'SEC 06',
  F07: 'SEC 07',
};

export function Rail({ side }: Props) {
  const activeFrame = useSceneStore((s) => s.activeFrame);
  const soundEnabled = useSceneStore((s) => s.soundEnabled);
  const toggleSound = useSceneStore((s) => s.toggleSound);

  return (
    <div className={[styles.rail, side === 'left' ? styles.left : styles.right].join(' ')}>
      <div aria-hidden="true" className={styles.meta}>
        {side === 'left' ? (
          <>
            <span className={styles.top}>{FRAME_SECTION[activeFrame] ?? 'SEC 01'}</span>
            <span className={styles.bottom}>SHEET 01 / 09</span>
          </>
        ) : (
          <>
            <span className={styles.top}>REV 1.0</span>
            <span className={styles.bottom}>ISSUED 2026-07</span>
          </>
        )}
      </div>

      {side === 'left' ? (
        <button
          type="button"
          className={styles.sound}
          aria-pressed={soundEnabled}
          onClick={toggleSound}
        >
          {`SOUND ${soundEnabled ? '●' : '○'}`}
        </button>
      ) : null}
    </div>
  );
}
