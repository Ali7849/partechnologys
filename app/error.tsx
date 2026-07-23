'use client';

import Link from 'next/link';
import { useEffect, type CSSProperties } from 'react';

/**
 * Route error boundary. The world may fail; the way out should not.
 */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  // Surfaces the error to logging without leaking details into the UI.
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main style={styles.main}>
      <span style={styles.eyebrow}>SYSTEM FAULT</span>
      <h1 style={styles.title}>Something in the world stopped responding.</h1>
      <p style={styles.lead}>
        This is on us, and it has been logged. Reloading the scene usually clears it.
      </p>
      <div style={styles.actions}>
        <button type="button" onClick={reset} style={styles.primary}>
          Reload the scene
        </button>
        <Link href="/" style={styles.secondary}>
          Return to the origin
        </Link>
      </div>
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
    color: '#F0A868',
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
  actions: { display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' },
  primary: {
    minHeight: 52,
    padding: '0 1.75rem',
    border: 'none',
    borderRadius: 4,
    background: '#F5F7FA',
    color: '#0B0D10',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8125rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  secondary: {
    display: 'inline-flex',
    alignItems: 'center',
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
