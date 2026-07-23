import styles from './Rule.module.css';

/**
 * Rule — the hairline. Every mark is a measurement (Design System Law III): a rule is a
 * statement that one thing ended and another began. Decorative/structural, so aria-hidden.
 */

type Props = {
  tone?: 'zinc-30' | 'zinc' | 'substrate-80' | 'vellum-hair';
  className?: string | undefined;
};

const toneClass = {
  'zinc-30': 'toneZinc30',
  zinc: 'toneZinc',
  'substrate-80': 'toneSubstrate80',
  'vellum-hair': 'toneVellumHair',
} as const;

export function Rule({ tone = 'zinc-30', className }: Props) {
  const classes = [styles.rule, styles[toneClass[tone]], className].filter(Boolean).join(' ');
  return <hr aria-hidden="true" className={classes} />;
}
