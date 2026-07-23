import { Text } from '@/primitives/Text/Text';

import styles from './F05Turn.module.css';

/**
 * LEGEND (F05) — the drawing-sheet key for the node field: the subject marked with the
 * Prussian diamond ("the one you were just inside"), and the counts of PAR systems and
 * Pontis sites. Counts are blocked (Data Contract D4) and read as em-dashes until real
 * deployment data is provided.
 */

type Props = { subjectName: string; parSystems: string; pontisSites: string };

export function Legend({ subjectName, parSystems, pontisSites }: Props) {
  return (
    <dl className={styles.legend}>
      <div className={styles.legendRow}>
        <span className={[styles.marker, styles.markerSubject].join(' ')} aria-hidden="true" />
        <Text as="dt" scale="m2" className={styles.legendLabel}>
          Subject
        </Text>
        <Text as="dd" scale="m1" className={styles.legendValue}>
          {subjectName}
        </Text>
      </div>
      <div className={styles.legendRow}>
        <span className={styles.marker} aria-hidden="true" />
        <Text as="dt" scale="m2" className={styles.legendLabel}>
          PAR systems
        </Text>
        <Text as="dd" scale="m1" className={styles.legendValue} tone="zinc">
          {parSystems}
        </Text>
      </div>
      <div className={styles.legendRow}>
        <span className={styles.marker} aria-hidden="true" />
        <Text as="dt" scale="m2" className={styles.legendLabel}>
          Pontis sites
        </Text>
        <Text as="dd" scale="m1" className={styles.legendValue} tone="zinc">
          {pontisSites}
        </Text>
      </div>
    </dl>
  );
}
