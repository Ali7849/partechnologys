import styles from './Button.module.css';

/**
 * Button — three tiers, no fourth. Renders a real <button> or <a>, never a styled div.
 *
 * Universal button law (Design System Part 8 / Motion Part 8): buttons DO NOT MOVE.
 * No translate, no scale, no shadow, no glow, no magnetic lean. The surface changes
 * state via the detent — entry is faster than exit (80ms in / 160ms out), fill/border/
 * underline only. That asymmetry is the whole feel: responds immediately, lets go slowly.
 */

type Tier = 'primary' | 'secondary' | 'tertiary';

type Props = {
  tier?: Tier;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  children: React.ReactNode;
  className?: string | undefined;
};

const tierClass: Record<Tier, string> = {
  primary: styles.primary ?? '',
  secondary: styles.secondary ?? '',
  tertiary: styles.tertiary ?? '',
};

export function Button({ tier = 'primary', href, onClick, type = 'button', children, className }: Props) {
  const classes = [styles.button, tierClass[tier], className].filter(Boolean).join(' ');

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
