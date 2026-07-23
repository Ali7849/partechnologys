'use client';

import dynamic from 'next/dynamic';

import { CanvasBoundary } from '@/components/CanvasBoundary/CanvasBoundary';

import type { WorldVariant } from './scenes';

/**
 * The world is client-only (WebGL has no server render) and code-split, so the copy is
 * readable before the environment streams in. If the context is unavailable the page keeps
 * its dark ground and the scene captions still tell the whole story.
 */

const World = dynamic(() => import('./World').then((m) => m.World), { ssr: false });

export function WorldLazy({ variant = 'fragment-journey' }: { variant?: WorldVariant }) {
  return (
    <CanvasBoundary fallback={null}>
      <World variant={variant} />
    </CanvasBoundary>
  );
}
