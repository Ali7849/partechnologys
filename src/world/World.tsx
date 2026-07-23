'use client';

import { Environment, Lightformer } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Vignette,
} from '@react-three/postprocessing';
import { useEffect, useMemo } from 'react';
import { Vector2 } from 'three';

import { useWorld } from '@/state/useWorld';

import { CosmicEnvironment } from './CosmicEnvironment';
import { HeroCore } from './HeroCore';
import { WorldCamera } from './WorldCamera';

/**
 * THE WORLD — one persistent 3D space the entire experience takes place inside.
 *
 * It is mounted once, fixed, behind every piece of content, and never unmounts: scrolling
 * moves the camera through it rather than swapping sections. Reflections come from a
 * procedural lightformer rig (no HDRI fetch), so the core is lit by shapes we authored and
 * every camera move re-lights it.
 *
 * The post stack is what makes it read as film rather than WebGL: bloom on the emissive core
 * and nebula, depth of field so the world has a focal plane, a whisper of chromatic
 * aberration at the edges, and a vignette to hold the eye centre-frame.
 */

function Post() {
  const aberration = useMemo(() => new Vector2(0.0007, 0.0009), []);

  return (
    <EffectComposer multisampling={0}>
      <DepthOfField focusDistance={0.015} focalLength={0.05} bokehScale={3.5} height={480} />
      <Bloom intensity={1.15} luminanceThreshold={0.2} luminanceSmoothing={0.5} mipmapBlur />
      <ChromaticAberration offset={aberration} radialModulation modulationOffset={0.35} />
      <Vignette eskil={false} offset={0.25} darkness={0.75} />
    </EffectComposer>
  );
}

export function World() {
  const setMouse = useWorld((s) => s.setMouse);

  // Pointer feeds the store directly — no React state, so nothing re-renders on move.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setMouse((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [setMouse]);

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.8, 10.5], fov: 42, near: 0.1, far: 220 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <CosmicEnvironment />
        <WorldCamera />
        <HeroCore />

        {/* key + fill, kept low so the lightformer reflections do the describing */}
        <ambientLight intensity={0.28} />
        <directionalLight position={[6, 7, 5]} intensity={1.1} color="#CFE0FF" />
        <directionalLight position={[-7, -3, -4]} intensity={0.45} color="#4E6BA8" />

        {/* procedural reflection rig — authored shapes, no HDRI request */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={3.2} position={[0, 6, -8]} scale={[12, 6, 1]} color="#A9C6FF" />
          <Lightformer form="rect" intensity={2.1} position={[-8, 1, 4]} scale={[8, 8, 1]} rotation={[0, Math.PI / 2, 0]} color="#7AA2F7" />
          <Lightformer form="rect" intensity={1.6} position={[8, -2, 2]} scale={[8, 8, 1]} rotation={[0, -Math.PI / 2, 0]} color="#5A76B8" />
          <Lightformer form="ring" intensity={2.4} position={[3, 4, 6]} scale={5} color="#FFFFFF" />
        </Environment>

        <Post />
      </Canvas>
    </div>
  );
}
