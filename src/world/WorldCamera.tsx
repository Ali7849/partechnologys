'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Vector3 } from 'three';

import { useWorld } from '@/state/useWorld';

import { CAMERA_PATH, LOOK_TARGETS, SCENE_COUNT, resolveActs } from './scenes';

/**
 * WORLD CAMERA — one continuous shot from the first frame to the last.
 *
 *   ACT 1  holds on the elliptical vortex, orbiting it slowly, leaning with the pointer
 *   ACT 2  flies THROUGH the vortex as it unfurls, so the viewer enters the universe
 *   ACT 4  hands off to the Catmull-Rom spline and the journey proper
 *
 * The handoff is a blend, not a cut: the intro camera and the spline are crossfaded by the
 * hero act, so there is no frame where the shot changes.
 */

export function WorldCamera() {
  const camera = useThree((s) => s.camera);
  const eased = useRef(0);
  const time = useRef(0);

  const splinePos = useMemo(() => new Vector3(), []);
  const introPos = useMemo(() => new Vector3(), []);
  const pos = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  const lookEased = useMemo(() => new Vector3(0, 0, 0), []);

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05);
    const { progress, mouseX, mouseY, variant } = useWorld.getState();
    time.current += step;

    const acts = resolveActs(progress, variant);

    // Damp toward the scroll position — weight, not snap.
    eased.current += (progress - eased.current) * Math.min(1, step * 3.2);
    const p = Math.min(1, Math.max(0, eased.current));

    // ── The intro camera ────────────────────────────────────────────────────
    // Frames the oval vortex, then drives straight through it as it expands.
    const dolly = 13.5 - acts.expand * 9.5; // 13.5 → 4.0: we pass through the field
    const orbit = time.current * 0.05;
    introPos.set(Math.sin(orbit) * 1.6, 1.6 - acts.expand * 1.1, Math.cos(orbit) * dolly);

    // ── The journey camera ──────────────────────────────────────────────────
    CAMERA_PATH.getPointAt(p, splinePos);

    // Crossfade: no cut, ever.
    pos.copy(introPos).lerp(splinePos, acts.hero);

    // Pointer parallax — a lean, never a swing. Strongest while the vortex owns the frame.
    const lean = 1 - acts.hero * 0.5;
    pos.x += mouseX * 0.62 * lean;
    pos.y += mouseY * 0.42 * lean;

    camera.position.lerp(pos, Math.min(1, step * 4));

    // Look target drifts between scenes so the core is never locked dead-centre.
    const t = p * (SCENE_COUNT - 1);
    const i = Math.min(SCENE_COUNT - 2, Math.floor(t));
    const f = t - i;
    const a = LOOK_TARGETS[i] ?? [0, 0, 0];
    const b = LOOK_TARGETS[i + 1] ?? a;
    look.set(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f);
    lookEased.lerp(look, Math.min(1, step * 3));
    camera.lookAt(lookEased);
  });

  return null;
}
