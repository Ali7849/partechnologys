import styles from './SubjectStatic.module.css';

/**
 * The static axonometric subject — a hand-authored drawing, not an auto-generated render.
 * It is the degradation-level-3/4 fallback the docs require ("it is a drawing, and it appears
 * on the page of a company that claims to draw") and the placeholder shown before the WebGL
 * subject resolves. True isometric, one implied sun (top face lightest), 2px-feel line work.
 *
 * Decorative: aria-hidden. F01 carries the real text description alongside it.
 */

export function SubjectStatic() {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 400 400"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {/* faces — matte solid under one north light */}
      <polygon points="200,80 320,150 200,220 80,150" fill="var(--vellum)" />
      <polygon points="80,150 200,220 200,330 80,260" fill="var(--cured)" />
      <polygon points="320,150 200,220 200,330 320,260" fill="var(--zinc-30)" />

      {/* edges — thin, dark, machined */}
      <g fill="none" stroke="var(--substrate)" strokeWidth="1.25" strokeLinejoin="round">
        <polygon points="200,80 320,150 200,220 80,150" />
        <path d="M80,150 L80,260 L200,330 L320,260 L320,150" />
        <line x1="200" y1="220" x2="200" y2="330" />
      </g>

      {/* one interior division line, hinting the object has an inside */}
      <line
        x1="140"
        y1="185"
        x2="260"
        y2="185"
        stroke="var(--zinc)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
    </svg>
  );
}
