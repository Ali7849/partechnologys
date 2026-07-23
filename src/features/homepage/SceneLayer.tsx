'use client';

import { CanvasBoundary } from '@/components/CanvasBoundary/CanvasBoundary';
import { useSceneStore } from '@/state/useSceneStore';
import { Stage } from '@/three/Stage';
import { NodeField } from '@/three/subjects/NodeField';
import { SubjectRig } from '@/three/subjects/SubjectRig';

/**
 * SCENE LAYER — the single WebGL canvas, mounted ONCE for the whole homepage and persistent
 * across all seven frames (re-creating a context per frame is disallowed, S4). It is a fixed
 * background layer; frame DOM sits above it with transparent grounds so the subject shows
 * through where the layout is open.
 *
 * Capability gate: at level 3/4 (static / reduced-motion / no WebGL2) the canvas is not
 * mounted at all — a hard React branch, not display:none — and each frame renders its static
 * axonometric instead. An unmounted canvas costs zero GPU (BUILD_SPEC S4 mobile behaviour).
 *
 * The node field is added to the scene graph only for F05's duration, then removed.
 */

export function SceneLayer() {
  const capability = useSceneStore((s) => s.capability);
  const activeFrame = useSceneStore((s) => s.activeFrame);

  if (capability >= 3) return null;

  return (
    <CanvasBoundary fallback={null}>
      <Stage>
        <SubjectRig />
        {activeFrame === 'F05' ? <NodeField /> : null}
      </Stage>
    </CanvasBoundary>
  );
}
