'use client';

import { Environment, Lightformer, PerformanceMonitor, Preload } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';
import { useEffect, useMemo } from 'react';
import { ACESFilmicToneMapping, HalfFloatType, Vector2 } from 'three';

import { useWorld } from '@/state/useWorld';

import { CosmicEnvironment } from './CosmicEnvironment';
import { Fragments } from './Fragments';
import { HeroCore } from './HeroCore';
import { Starfield } from './Starfield';
import { WorldCamera } from './WorldCamera';
import type { WorldVariant } from './scenes';

/**
 * THE WORLD — one persistent 3D space the entire experience takes place inside. Mounted once,
 * fixed, behind every piece of content, never unmounted.
 *
 * Render quality targets a 4K panel: ACES Filmic tone mapping so highlights roll off like film
 * instead of clipping, half-float targets so bloom has real HDR headroom, 4× MSAA, and pixel
 * ratio up to 2 — but every one of those is governed at runtime (below) rather than fixed, so
 * the experience stays at framerate on weaker GPUs instead of looking good and running badly.
 */

/**
 * Adaptive quality. Measures real framerate and walks pixel ratio and starfield density up or
 * down gradually — never in a visible jump. Recovery is automatic when headroom returns.
 */
function Governor() {
  const setDpr = useThree((s) => s.setDpr);
  const setQuality = useWorld((s) => s.setQuality);

  return (
    <PerformanceMonitor
      ms={200}
      iterations={6}
      step={0.15}
      onChange={({ factor }) => {
        // 1 → 2 in small increments so the resolution shift is imperceptible.
        setDpr(Math.round((1 + factor) * 20) / 20);
        setQuality(factor);
      }}
      onFallback={() => {
        setDpr(1);
        setQuality(0);
      }}
    />
  );
}

function Post() {
  const aberration = useMemo(() => new Vector2(0.0004, 0.0006), []);

  // PROFILE NOTE — with additive points the bottleneck is fill rate and the post chain, not
  // vertex count. The two most expensive passes were MSAA resolve on a half-float target and
  // depth of field (multi-pass). Both are gone: MSAA does almost nothing for sub-2px points,
  // and DOF was the direct cause of the softness. Removing them buys back significant frame
  // time AND sharpens the image — the rare case where the fix serves both.
  return (
    <EffectComposer multisampling={0} frameBufferType={HalfFloatType}>
      {/* High threshold: ONLY the HDR particles bloom. The background contributes no light,
          so blacks stay black and the glow reads as optical rather than a wash. */}
      <Bloom intensity={1.15} luminanceThreshold={0.62} luminanceSmoothing={0.12} radius={0.5} mipmapBlur />
      <ChromaticAberration offset={aberration} radialModulation modulationOffset={0.5} />
      <Vignette eskil={false} offset={0.22} darkness={0.78} />
    </EffectComposer>
  );
}

export function World({ variant = 'fragment-journey' }: { variant?: WorldVariant }) {
  const setMouse = useWorld((s) => s.setMouse);
  const setVariant = useWorld((s) => s.setVariant);

  // The variant lives in the store so every useFrame consumer can read it without props.
  useEffect(() => {
    setVariant(variant);
  }, [variant, setVariant]);

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
        camera={{ position: [0, 1.6, 13.5], fov: 42, near: 0.1, far: 400 }}
        gl={{
          antialias: false, // the composer's MSAA does this better
          alpha: false,
          stencil: false,
          depth: true,
          powerPreference: 'high-performance',
          toneMapping: ACESFilmicToneMapping,
          // Pulled below 1 so the toe of the ACES curve crushes to true black rather than
          // lifting into grey — contrast comes from the HDR particles, not from exposure.
          toneMappingExposure: 0.92,
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 1)}
      >
        <Governor />

        <CosmicEnvironment />
        <WorldCamera />
        <Starfield />
        <HeroCore />
        {/* The capability fragments ARE the pillars — only the full journey carries them. */}
        {variant === 'fragment-journey' ? <Fragments /> : null}

        {/* key + fill, kept low so the lightformer reflections do the describing */}
        <ambientLight intensity={0.24} />
        <directionalLight position={[6, 7, 5]} intensity={1.25} color="#CFE0FF" />
        <directionalLight position={[-7, -3, -4]} intensity={0.5} color="#4E6BA8" />

        {/* procedural reflection rig — authored shapes, no HDRI request */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={3.4} position={[0, 6, -8]} scale={[12, 6, 1]} color="#A9C6FF" />
          <Lightformer form="rect" intensity={2.2} position={[-8, 1, 4]} scale={[8, 8, 1]} rotation={[0, Math.PI / 2, 0]} color="#7AA2F7" />
          <Lightformer form="rect" intensity={1.7} position={[8, -2, 2]} scale={[8, 8, 1]} rotation={[0, -Math.PI / 2, 0]} color="#5A76B8" />
          <Lightformer form="ring" intensity={2.6} position={[3, 4, 6]} scale={5} color="#FFFFFF" />
        </Environment>

        <Post />

        {/* Compiles every shader before the first frame — no hitching during the intro. */}
        <Preload all />
      </Canvas>
    </div>
  );
}
