'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';

import { damp, requestRender } from '@/motion/ticker';
import { useSceneStore } from '@/state/useSceneStore';
import type { FrameId } from '@/types/scene';

import { PlaceholderSubject } from './PlaceholderSubject';

/**
 * SUBJECT RIG — the single persistent subject, transformed (never remounted) across the
 * seven frames. The section cut itself lives in PlaceholderSubject (scroll-driven clip);
 * this wrapper owns the cross-frame scale and position the storyboard calls for:
 *
 *   F01–F03  whole, centred          the object under inspection
 *   F04      30%, pushed to the edge  "the page has stopped asking for anything"
 *   F05      one node among the field small, at plan
 *   F06–F07  whole, centred again     the return home
 *
 * Only transform is animated (Motion Law), eased frame-rate-independently inside the shared
 * demand loop — a station change moves the camera; this moves the subject within the scene.
 */

type Pose = { scale: number; x: number };

const POSE: Record<FrameId, Pose> = {
  F01: { scale: 1, x: 0 },
  F02: { scale: 1, x: 0 },
  F03: { scale: 1, x: 0 },
  F04: { scale: 0.32, x: 2.6 },
  F05: { scale: 0.5, x: 0 },
  F06: { scale: 1, x: 0 },
  F07: { scale: 1, x: 0 },
};

export function SubjectRig() {
  const group = useRef<Group>(null);
  const scale = useRef(1);
  const x = useRef(0);

  // Eases the group toward the active frame's pose; redraws only while it is still moving.
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const pose = POSE[useSceneStore.getState().activeFrame];
    const nextScale = damp(scale.current, pose.scale, 6, dt);
    const nextX = damp(x.current, pose.x, 6, dt);
    const moving = Math.abs(nextScale - pose.scale) > 0.001 || Math.abs(nextX - pose.x) > 0.001;

    scale.current = moving ? nextScale : pose.scale;
    x.current = moving ? nextX : pose.x;
    g.scale.setScalar(scale.current);
    g.position.x = x.current;

    if (moving) requestRender();
  });

  return (
    <group ref={group}>
      <PlaceholderSubject />
    </group>
  );
}
