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
import { ACESFilmicToneMapping, HalfFloatType, Vector2 } from 'three';

import { useWorld } from '@/state/useWorld';

import { CosmicEnvironment } from './CosmicEnvironment';
import { Galaxy } from './Galaxy';
import { HeroCore } from './HeroCore';
import { WorldCamera } from './WorldCamera';

/**
 * THE WORLD — one persistent 3D space the entire experience takes place inside.
 *
 * Mounted once, fixed, behind every piece of content, and never unmounted: scrolling moves the
 * camera through it rather than swapping sections.
 *
 * Render quality is tuned for a 4K panel rather than a demo: ACES Filmic tone mapping so
 * highlights roll off like film instead of clipping, half-float render targets so the bloom
 * has real HDR headroom to work from, 4× MSAA in the composer, and pixel ratio allowed up to
 * 2 (clamped, so a 4K display gets true resolution without melting a laptop GPU).
 *
 * The post stack is deliberately restrained: bloom that GLOWS rather than washes, a shallow
 * depth of field that keeps the core crisp, and only a whisper of aberration at the edges.
 */

function Post() {
  const aberration = useMemo(() => new Vector2(0.0004, 0.0006), []);

  return (
    <EffectComposer multisampling={4} frameBufferType={HalfFloatType}>
      {/* shallow — atmosphere at depth, never a blurred subject */}
      <DepthOfField focusDistance={0.008} focalLength={0.018} bokehScale={1.1} height={700} />
      {/* tight radius + high threshold: only genuinely hot pixels bloom */}
      <Bloom intensity={0.85} luminanceThreshold={0.42} luminanceSmoothing={0.18} radius={0.62} mipmapBlur />
      <ChromaticAberration offset={aberration} radialModulation modulationOffset={0.45} />
      <Vignette eskil={false} offset={0.3} darkness={0.62} />
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
        dpr={[1, 2]}
        camera={{ position: [0, 2.4, 26], fov: 42, near: 0.1, far: 400 }}
        gl={{
          antialias: false, // the composer's MSAA does this better
          alpha: false,
          stencil: false,
          powerPreference: 'high-performance',
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <CosmicEnvironment />
        <WorldCamera />
        <Galaxy />
        <HeroCore />

        {/* key + fill, kept low so the lightformer reflections do the describing */}
        <ambientLight intensity={0.24} />
        <directionalLight position={[6, 7, 5]} intensity={1.25} color="#CFE0FF" />
        <directionalLight position={[-7, -3, -4]} intensity={0.5} color="#4E6BA8" />

        {/* procedural reflection rig — authored shapes, no HDRI request */}
        <Environment resolution={512}>
          <Lightformer form="rect" intensity={3.4} position={[0, 6, -8]} scale={[12, 6, 1]} color="#A9C6FF" />
          <Lightformer form="rect" intensity={2.2} position={[-8, 1, 4]} scale={[8, 8, 1]} rotation={[0, Math.PI / 2, 0]} color="#7AA2F7" />
          <Lightformer form="rect" intensity={1.7} position={[8, -2, 2]} scale={[8, 8, 1]} rotation={[0, -Math.PI / 2, 0]} color="#5A76B8" />
          <Lightformer form="ring" intensity={2.6} position={[3, 4, 6]} scale={5} color="#FFFFFF" />
        </Environment>

        <Post />
      </Canvas>
    </div>
  );
}
