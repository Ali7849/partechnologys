'use client';

import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, BackSide, Color, type Group, type Mesh, type MeshBasicMaterial, type MeshStandardMaterial } from 'three';

import { useWorld } from '@/state/useWorld';

import { accentAt, birthAt } from './scenes';

/**
 * HERO CORE — the heart of the world.
 *
 * A machined polyhedral core that turns continuously through 360° and floats, wrapped in a
 * counter-rotating lattice shell and a soft additive halo. The body is a polished metal that
 * takes its reflections from the surrounding lightformers, so every camera move re-lights it;
 * the inner emissive shard is what bloom catches, and it takes the colour of whichever scene
 * the camera is travelling through.
 *
 * It never leaves the origin — the camera orbits it, which is what makes the journey read as
 * one continuous shot rather than a sequence of pages.
 */

export function HeroCore() {
  const root = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const shell = useRef<Group>(null);
  const emissive = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  const born = useRef(0);

  const accentColor = useMemo(() => new Color('#7AA2F7'), []);
  const target = useMemo(() => new Color(), []);
  const targetB = useMemo(() => new Color(), []);

  // Continuous rotation + counter-rotating shell, and the emissive shard takes the scene accent.
  useFrame((_, dt) => {
    // The core is born out of the galaxy: it only begins to exist once the spiral has broken
    // apart, then scales up as the captured particles wrap it.
    const reveal = birthAt(useWorld.getState().progress);
    const t = Math.min(1, Math.max(0, (reveal - 0.32) / 0.68));
    born.current += (t * t * (3 - 2 * t) - born.current) * Math.min(1, dt * 3);
    if (root.current) {
      root.current.scale.setScalar(Math.max(0.0001, born.current));
      root.current.visible = born.current > 0.01;
    }

    if (spin.current) {
      spin.current.rotation.y += dt * 0.22;
      spin.current.rotation.x += dt * 0.05;
    }
    if (shell.current) {
      shell.current.rotation.y -= dt * 0.14;
      shell.current.rotation.z += dt * 0.06;
    }

    const { from, to, blend } = accentAt(useWorld.getState().progress);
    target.set(from);
    targetB.set(to);
    target.lerp(targetB, blend);
    accentColor.lerp(target, Math.min(1, dt * 2.5));

    const shard = emissive.current?.material as MeshStandardMaterial | undefined;
    if (shard) {
      shard.color.copy(accentColor);
      shard.emissive.copy(accentColor);
    }
    const glow = halo.current?.material as MeshBasicMaterial | undefined;
    if (glow) glow.color.copy(accentColor);
  });

  return (
    <Float speed={1.1} rotationIntensity={0.16} floatIntensity={0.7} floatingRange={[-0.14, 0.14]}>
      <group ref={root}>
        {/* polished core — reflections come entirely from the lightformer rig */}
        <group ref={spin}>
          <mesh castShadow receiveShadow>
            <icosahedronGeometry args={[1.55, 1]} />
            <meshPhysicalMaterial
              color="#161A22"
              metalness={1}
              roughness={0.17}
              clearcoat={1}
              clearcoatRoughness={0.22}
              envMapIntensity={1.9}
              flatShading
            />
          </mesh>

          {/* the shard inside — what bloom picks up */}
          <mesh ref={emissive} scale={0.62}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#7AA2F7"
              emissive="#7AA2F7"
              emissiveIntensity={2.6}
              toneMapped={false}
              roughness={0.4}
            />
          </mesh>
        </group>

        {/* counter-rotating lattice shell */}
        <group ref={shell}>
          <mesh scale={2.25}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial color="#5C7FB8" wireframe transparent opacity={0.16} />
          </mesh>
        </group>

        {/* soft additive halo so the core sits in light rather than on top of the nebula */}
        <mesh ref={halo} scale={3.4}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#7AA2F7"
            transparent
            opacity={0.055}
            side={BackSide}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Float>
  );
}
