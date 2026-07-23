import { AuroraFieldLazy } from '@/three/AuroraFieldLazy';

import { Closing } from './Closing';
import { Opening } from './Opening';
import { PILLARS } from './content/pillars';
import { PillarSection } from './pillars/PillarSection';

/**
 * PAR//OS — the homepage as one continuous journey, not stacked sections.
 *
 * The visitor enters a system coming online, then travels through the seven capability
 * pillars, each its own world with its own accent and atmosphere, and resolves at a single
 * address. Navigation is by command (⌘K), not a nav bar.
 *
 * Rebuilt from first principles; the previous seven-frame concept is retired.
 */

export function Homepage() {
  return (
    <>
      <AuroraFieldLazy />
      <Opening />
      {PILLARS.map((pillar) => (
        <PillarSection key={pillar.id} pillar={pillar} />
      ))}
      <Closing />
    </>
  );
}
