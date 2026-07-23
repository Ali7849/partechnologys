'use client';

import { useEffect } from 'react';

import { Button } from '@/primitives/Button/Button';
import { Text } from '@/primitives/Text/Text';

/**
 * Route error boundary. Failure is reported first, factually, with the correction in motion —
 * the fifth value, applied to the interface itself.
 */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  // Surfaces the error to logging without leaking details into the UI.
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <section
      style={{
        minBlockSize: '100vh',
        display: 'grid',
        placeContent: 'center',
        gap: 'var(--m-6)',
        paddingInline: 'calc(var(--grid-rail) + var(--m-6))',
      }}
    >
      <Text as="span" scale="m3" tone="fault">
        FAULT · UNHANDLED EXCEPTION
      </Text>
      <Text as="h1" scale="d3">
        Something did not hold.
      </Text>
      <Text as="p" scale="b2" tone="zinc">
        This is on us. The error is logged. Try again, or return to the title sheet.
      </Text>
      <div style={{ display: 'flex', gap: 'var(--m-3)' }}>
        <Button tier="primary" onClick={reset}>
          Try again
        </Button>
        <Button tier="secondary" href="/">
          Back to home
        </Button>
      </div>
    </section>
  );
}
