import styles from './ScrollCue.module.css';

/**
 * The scroll cue — one only, in Act I, after the 2s hold. A 1px Zinc dimension line, 32px
 * tall, whose lower 8px travels down and fades every 3.2s (Motion System Part 3). Not a
 * bouncing chevron, not a mouse icon — a measurement mark. Hidden from assistive tech (it is
 * a visual affordance, not information) and it disappears permanently on first scroll.
 */

export function ScrollCue() {
  return (
    <div className={styles.cue} aria-hidden="true">
      <span className={styles.line} />
      <span className={styles.tick} />
    </div>
  );
}
