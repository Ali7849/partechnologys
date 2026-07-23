import Link from 'next/link';
import type { CSSProperties } from 'react';

export default function NotFound() {
  return (
    <main style={styles.main}>
      <span style={styles.eyebrow}>404 · NO SUCH COORDINATE</span>
      <h1 style={styles.title}>There is nothing at this position.</h1>
      <p style={styles.lead}>
        Whatever you were looking for is not part of this world. Head back to the origin.
      </p>
      <Link href="/" style={styles.secondary}>
        Return to the origin
      </Link>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '1.25rem',
    padding: 'clamp(1.5rem, 6vw, 7rem)',
    maxWidth: '62ch',
  },
  eyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6875rem',
    letterSpacing: '0.34em',
    color: 'rgba(238, 242, 250, 0.5)',
  },
  title: {
    margin: 0,
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.9rem, 4vw, 3.2rem)',
    fontWeight: 500,
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    color: '#F4F6FA',
  },
  lead: {
    margin: 0,
    fontSize: '1.05rem',
    lineHeight: 1.6,
    color: 'rgba(238, 242, 250, 0.62)',
  },
  secondary: {
    alignSelf: 'flex-start',
    display: 'inline-flex',
    alignItems: 'center',
    marginTop: '0.5rem',
    minHeight: 52,
    padding: '0 1.5rem',
    border: '1px solid rgba(255,255,255,0.16)',
    borderRadius: 4,
    color: 'rgba(238,242,250,0.86)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8125rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    textDecoration: 'none',
  },
};
