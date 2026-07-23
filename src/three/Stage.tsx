'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';

import { setRenderRequester } from '@/motion/ticker';

import { CameraRig } from './CameraRig';
import { Sun } from './lighting/Sun';
import { STATIONS } from './stations';

/**
 * The Stage — the R3F canvas, mounted ONCE at the homepage root and persistent across all
 * seven frames (re-creating a WebGL context per frame is disallowed). `frameloop="demand"`:
 * a locked camera on a static scene costs zero GPU — the render policy translation of the
 * motion system's "stillness is the default". Each frame supplies what the scene renders.
 *
 * Fixed, full-viewport, behind the DOM content; it never captures pointer events.
 */

function RenderBridge() {
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);

  // Enables local clipping (for the section cut) and wires the canvas's invalidate into the
  // shared render-request bus, so scroll-driven code can schedule exactly one frame.
  useEffect(() => {
    gl.localClippingEnabled = true;
    setRenderRequester(invalidate);
    return () => setRenderRequester(null);
  }, [invalidate, gl]);

  return null;
}

export function Stage({ children }: { children?: React.ReactNode }) {
  const iso = STATIONS.iso;

  return (
    <Canvas
      orthographic
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, stencil: true, powerPreference: 'high-performance' }}
      camera={{ position: iso.position, zoom: iso.zoom, near: 0.01, far: 200 }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}
    >
      <RenderBridge />
      <Sun />
      <CameraRig />
      {children}
    </Canvas>
  );
}
