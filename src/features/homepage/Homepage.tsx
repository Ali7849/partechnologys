import { WorldLazy } from '@/world/WorldLazy';
import type { WorldVariant } from '@/world/scenes';

import { ScrollStage } from './ScrollStage';

/**
 * PAR // TECHNOLOGYS — one continuous cinematic journey.
 *
 * There is no page structure here, deliberately. A single persistent 3D world is mounted once
 * and never unmounts; scrolling flies the camera along one spline through it, and each scene's
 * content emerges from the environment as the camera arrives.
 *
 * `variant` selects which preserved concept is shown, so earlier directions stay comparable
 * instead of being overwritten — see WorldVariant.
 */

export function Homepage({ variant = 'fragment-journey' }: { variant?: WorldVariant }) {
  return (
    <>
      <WorldLazy variant={variant} />
      <ScrollStage />
    </>
  );
}
