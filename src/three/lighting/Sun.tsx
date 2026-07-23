import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { DirectionalLight } from 'three';

import { requestRender } from '@/motion/ticker';
import { useSceneStore } from '@/state/useSceneStore';

/**
 * One sun. A single directional source, high and slightly forward-left — the angle of north
 * studio light — fixed for the life of the brand. Only INTENSITY is ever animated
 * (1.0 ↔ 0.7), never position, colour, or count (Design System Part 4 / Motion Part 12).
 *
 * The low neutral ambient is sky fill (bounce), not a second directional source — it carries
 * no direction and no colour, so the doctrine "no element is lit from a different angle" holds.
 */

export function Sun() {
  const ref = useRef<DirectionalLight>(null);

  // Eases the sun's intensity toward the store target; only redraws while it is changing.
  useFrame((_, dt) => {
    const light = ref.current;
    if (!light) return;
    const target = useSceneStore.getState().lightIntensity;
    const current = light.intensity;
    if (Math.abs(current - target) > 0.002) {
      light.intensity = current + (target - current) * Math.min(1, dt * 6);
      requestRender();
    } else if (light.intensity !== target) {
      light.intensity = target;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight ref={ref} position={[-6, 11, 7]} intensity={1.1} />
    </>
  );
}
