'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Vector3 } from 'three';

import { useWorld } from '@/state/useWorld';

import { CAMERA_PATH, LOOK_TARGETS, SCENE_COUNT, birthAt } from './scenes';

/**
 * WORLD CAMERA — the single continuous shot.
 *
 * Scroll is not paging; it is position along one Catmull-Rom spline that orbits the core. On
 * arrival (before any scroll) the camera keeps a slow autonomous orbit and a gentle dolly so
 * the opening breathes instead of sitting still; as soon as the journey begins, the path takes
 * over and the idle motion fades out. Pointer movement adds a small parallax lean on top of
 * everything, so the world always responds to the visitor.
 *
 * Position is damped rather than snapped, which is what gives the move its weight.
 */

export function WorldCamera() {
  const camera = useThree((s) => s.camera);
  const eased = useRef(0);
  const time = useRef(0);

  const pos = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  const lookEased = useMemo(() => new Vector3(0, 0, 0), []);

  useFrame((_, dt) => {
    const { progress, mouseX, mouseY } = useWorld.getState();
    time.current += dt;

    // Damp toward the scroll position — weight, not snap.
    eased.current += (progress - eased.current) * Math.min(1, dt * 3.2);
    const p = Math.min(1, Math.max(0, eased.current));

    CAMERA_PATH.getPointAt(p, pos);

    // THE APPROACH — at rest the camera sits far out with the whole spiral in frame, then
    // closes on the core as the galaxy gives birth to it, arriving exactly as the path begins.
    const reveal = birthAt(progress);
    pos.multiplyScalar(1 + (1 - reveal) * 1.55);

    // Autonomous orbit + dolly while the galaxy still holds the frame.
    const idle = 1 - reveal;
    if (idle > 0.001) {
      const a = time.current * 0.06 * idle;
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      const x = pos.x * cos - pos.z * sin;
      const z = pos.x * sin + pos.z * cos;
      pos.set(x, pos.y, z);
      // occasional dolly toward the object
      pos.multiplyScalar(1 - 0.055 * idle * (0.5 + 0.5 * Math.sin(time.current * 0.22)));
    }

    // Pointer parallax — a lean, never a swing.
    pos.x += mouseX * 0.55;
    pos.y += mouseY * 0.38;

    camera.position.lerp(pos, Math.min(1, dt * 4));

    // Look target drifts between scenes so the core is never locked dead-centre.
    const t = p * (SCENE_COUNT - 1);
    const i = Math.min(SCENE_COUNT - 2, Math.floor(t));
    const f = t - i;
    const a = LOOK_TARGETS[i] ?? [0, 0, 0];
    const b = LOOK_TARGETS[i + 1] ?? a;
    look.set(
      a[0] + (b[0] - a[0]) * f,
      a[1] + (b[1] - a[1]) * f,
      a[2] + (b[2] - a[2]) * f,
    );
    lookEased.lerp(look, Math.min(1, dt * 3));
    camera.lookAt(lookEased);
  });

  return null;
}
