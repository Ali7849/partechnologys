'use client';

import { ScreenQuad } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useEffect, useMemo, useRef } from 'react';
import { Color, Vector2, type ShaderMaterial } from 'three';

import { useExperience } from '@/state/useExperience';

/**
 * AURORA FIELD — the environment. A single fullscreen GLSL pass running a flowing fbm field
 * that tints toward the accent of whichever pillar you are inside, so scrolling doesn't move
 * through sections, it changes the atmosphere. Mouse position parallaxes the field; bloom
 * lifts the ribbons.
 *
 * Everything is driven from `useExperience` via getState() inside useFrame — the environment
 * updates every frame without ever re-rendering React.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3  uColor;
  uniform vec2  uMouse;
  uniform vec2  uResolution;
  varying vec2  vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2((vUv.x - 0.5) * aspect, vUv.y - 0.5);

    // mouse parallax — the field leans toward the pointer
    p += uMouse * 0.05;

    float t = uTime * 0.05;

    // domain-warped flow field
    vec2 q = vec2(fbm(p * 1.5 + vec2(0.0, t)), fbm(p * 1.5 + vec2(3.2, -t)));
    float f = fbm(p * 2.1 + q * 1.5 + t * 0.4);

    float ribbon = smoothstep(0.34, 0.92, f);
    float glow = pow(ribbon, 2.0);

    // keep the centre calm so content stays legible
    float d = length(p * vec2(0.8, 1.3));
    float vig = smoothstep(1.15, 0.1, d);

    vec3 base = vec3(0.031, 0.035, 0.043);
    vec3 col = base + uColor * glow * 0.6 * vig + uColor * ribbon * 0.09 * vig;

    // fine grain so gradients never band
    col += (hash(vUv * uResolution + t) - 0.5) * 0.014;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function FieldPass() {
  const materialRef = useRef<ShaderMaterial>(null);
  const size = useThree((s) => s.size);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new Color('#7AA2F7') },
      uMouse: { value: new Vector2(0, 0) },
      uResolution: { value: new Vector2(1, 1) },
    }),
    [],
  );

  // Keep the shader's idea of the viewport in sync.
  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  const target = useMemo(() => new Color('#7AA2F7'), []);

  // Drives time, eases the accent toward the active pillar, and damps the pointer parallax.
  useFrame((_, dt) => {
    const material = materialRef.current;
    if (!material) return;
    const { accent, mouseX, mouseY } = useExperience.getState();

    uniforms.uTime.value += dt;

    target.set(accent);
    uniforms.uColor.value.lerp(target, Math.min(1, dt * 1.2));

    const m = uniforms.uMouse.value;
    m.x += (mouseX - m.x) * Math.min(1, dt * 2.2);
    m.y += (mouseY - m.y) * Math.min(1, dt * 2.2);
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}

export function AuroraField() {
  const setMouse = useExperience((s) => s.setMouse);

  // Pointer feeds the store directly — no React state, so nothing re-renders on move.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setMouse(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [setMouse]);

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      >
        <FieldPass />
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.22} luminanceSmoothing={0.5} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
