import { TitleBlock } from '@/components/TitleBlock/TitleBlock';

import { SceneLayerLazy } from './SceneLayerLazy';
import { F01Sheet } from './frames/F01Sheet/F01Sheet';
import { F02Descent } from './frames/F02Descent/F02Descent';
import { F03Inside } from './frames/F03Inside/F03Inside';
import { F04Tolerances } from './frames/F04Tolerances/F04Tolerances';
import { F05Turn } from './frames/F05Turn/F05Turn';
import { F06Return } from './frames/F06Return/F06Return';
import { F07TitleBlock } from './frames/F07TitleBlock/F07TitleBlock';

/**
 * Homepage — the seven-frame film. The Stage (S4) mounts once via SceneLayer as a fixed layer
 * behind the DOM and persists across every frame, so the WebGL context is never re-created;
 * each frame changes what it renders and where the camera looks, never the canvas itself.
 * The frames follow in dependency order (F01 → F07); the S2 TitleBlock closes the document.
 *
 *   F01 Sheet · F02 Descent · F03 Inside · F04 Tolerances · F05 Turn · F06 Return · F07 Close
 */

export function Homepage() {
  return (
    <>
      <SceneLayerLazy />
      <F01Sheet />
      <F02Descent />
      <F03Inside />
      <F04Tolerances />
      <F05Turn />
      <F06Return />
      <F07TitleBlock />
      <TitleBlock />
    </>
  );
}
