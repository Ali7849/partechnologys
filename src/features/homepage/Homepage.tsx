import { WorldLazy } from '@/world/WorldLazy';

import { ScrollStage } from './ScrollStage';

/**
 * PAR // TECHNOLOGYS — one continuous cinematic journey.
 *
 * There is no page structure here, deliberately. A single persistent 3D world is mounted once
 * and never unmounts; scrolling flies the camera along one spline through it, and each scene's
 * content emerges from the environment as the camera arrives. The previous section-based
 * homepage is retired — scenes connected by camera movement, not blocks stacked vertically.
 */

export function Homepage() {
  return (
    <>
      <WorldLazy />
      <ScrollStage />
    </>
  );
}
