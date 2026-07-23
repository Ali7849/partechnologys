import { createElement } from 'react';

import type { TypeScale } from '@/styles/tokens';

import styles from './Text.module.css';

/**
 * Text IS the type scale. There is no other way to set type in this system.
 *
 * It accepts no `size`, `weight`, or colour-via-style prop for typography — the `scale`
 * prop is a closed union of the eleven design-system steps, and `tone` is a closed union
 * of the permitted text colours. This is the mechanism that stops a sixty-token system
 * from degrading into four hundred one-off values (ARCHITECTURE Part 2).
 */

type TextElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'li'
  | 'dt'
  | 'dd'
  | 'figcaption'
  | 'blockquote';

type Tone = 'substrate' | 'zinc' | 'prussian' | 'cured' | 'fault';

type Props = {
  scale: TypeScale;
  as?: TextElement;
  tone?: Tone;
  className?: string | undefined;
  id?: string | undefined;
  children: React.ReactNode;
};

const toneClass: Record<Tone, string> = {
  substrate: styles.toneSubstrate ?? '',
  zinc: styles.toneZinc ?? '',
  prussian: styles.tonePrussian ?? '',
  cured: styles.toneCured ?? '',
  fault: styles.toneFault ?? '',
};

export function Text({ scale, as = 'span', tone, className, id, children }: Props) {
  // No tone → no colour class: the text inherits the ground colour, so it follows the
  // page's Cured↔Substrate transition (F04/F06) automatically. An explicit tone opts out.
  const classes = [styles.text, styles[scale], tone ? toneClass[tone] : '', className]
    .filter(Boolean)
    .join(' ');

  return createElement(as, { className: classes, id }, children);
}
