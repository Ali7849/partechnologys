'use client';

import dynamic from 'next/dynamic';

import { CanvasBoundary } from '@/components/CanvasBoundary/CanvasBoundary';

/**
 * The aurora is client-only (WebGL has no server render) and code-split, so the environment
 * streams in after the content is already readable. If the context fails, the page keeps its
 * dark ground and lattice — the experience degrades, it never breaks.
 */

const AuroraField = dynamic(() => import('./AuroraField').then((m) => m.AuroraField), {
  ssr: false,
});

export function AuroraFieldLazy() {
  return (
    <CanvasBoundary fallback={null}>
      <AuroraField />
    </CanvasBoundary>
  );
}
