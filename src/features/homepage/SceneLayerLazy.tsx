'use client';

import dynamic from 'next/dynamic';

/**
 * The 3D stack (three + R3F + drei) is code-split behind a client-only dynamic import, so it
 * never enters the initial bundle or blocks LCP — the subject is lazy, non-blocking, exactly
 * as F01 requires. `ssr: false` because WebGL has no server render; the DOM frames carry the
 * full experience until the canvas arrives (and at capability 3/4 it never does).
 */

export const SceneLayerLazy = dynamic(
  () => import('./SceneLayer').then((m) => ({ default: m.SceneLayer })),
  { ssr: false },
);
