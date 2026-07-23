import styles from './Plate.module.css';

/**
 * Plate — NOT a card. A flat element resting on the surface, bounded by an edge.
 * Vellum surface, 1px edge, 2px radius, no shadow at any state (Design System Part 8).
 * Depth is surface + edge, never elevation. Used in tabular/index contexts — deliberately
 * absent from the homepage, present for /work and /record.
 *
 * If interactive, it is a real <a>, not a div with onClick.
 */

type Props = {
  href?: string;
  interactive?: boolean;
  className?: string | undefined;
  children: React.ReactNode;
};

export function Plate({ href, interactive = false, className, children }: Props) {
  const isInteractive = interactive || Boolean(href);
  const classes = [styles.plate, isInteractive ? styles.interactive : null, className]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return <article className={classes}>{children}</article>;
}
