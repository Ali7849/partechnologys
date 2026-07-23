'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { BackSide, Color, type ShaderMaterial } from 'three';

import { useWorld } from '@/state/useWorld';

import { accentAt, actsAt } from './scenes';

/**
 * COSMIC ENVIRONMENT — a living world, not a backdrop.
 *
 * A vast inverted sphere carries a volumetric nebula built from 3D fbm noise, so the clouds
 * have real depth and shift as the camera flies through them (parallax comes free from the
 * geometry, not a fake offset). Inside it: an animated starfield, drifting space dust, and
 * scene fog for atmospheric perspective — distant nebula desaturates into the void exactly
 * as it should.
 *
 * The whole environment bleeds from one scene's accent toward the next as the camera travels.
 */

const vertexShader = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3  uAccentA;
  uniform vec3  uAccentB;
  uniform float uBlend;
  uniform float uNebula;  // act 3 — the nebula emerges AROUND the particles
  varying vec3  vPos;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 dir = normalize(vPos);
    float t = uTime * 0.012;

    // Domain-warped volumetric cloud — warping is what makes it read as gas, not marble.
    vec3 q = vec3(fbm(dir * 2.2 + vec3(0.0, t, 0.0)),
                  fbm(dir * 2.2 + vec3(4.1, -t, 1.7)),
                  fbm(dir * 2.2 + vec3(-2.3, t * 0.7, 3.4)));
    float cloud = fbm(dir * 3.4 + q * 2.1);

    float nebula = smoothstep(0.42, 0.95, cloud);
    float wisp   = smoothstep(0.30, 0.62, cloud);

    vec3 accent = mix(uAccentA, uAccentB, uBlend);

    // Deep space base, warmed by a second, cooler hue so it never looks flat-tinted.
    vec3 deep  = vec3(0.016, 0.020, 0.035);
    vec3 cool  = vec3(0.10, 0.16, 0.42);

    // The nebula opens the experience INVISIBLE — the vortex is alone in the dark — then
    // emerges around those same particles and stays for the rest of the journey. Light
    // scattering makes the cores bloom brighter than their edges.
    vec3 col = deep;
    col += (cool * wisp * 0.34
          + accent * nebula * 0.62
          + accent * pow(nebula, 3.0) * 0.5) * uNebula;

    // Vertical falloff so the world has a floor and a sky rather than uniform soup.
    float band = smoothstep(-0.85, 0.55, dir.y);
    col *= mix(0.55, 1.15, band);

    // Dither — kills banding across these very low-contrast gradients.
    col += (hash(vec3(gl_FragCoord.xy, uTime)) - 0.5) * 0.012;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function CosmicEnvironment() {
  const materialRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAccentA: { value: new Color('#7AA2F7') },
      uAccentB: { value: new Color('#7AA2F7') },
      uBlend: { value: 0 },
      uNebula: { value: 0 },
    }),
    [],
  );

  const colA = useMemo(() => new Color(), []);
  const colB = useMemo(() => new Color(), []);

  // Advances the nebula and bleeds it toward the accent of the scene the camera is entering.
  useFrame((_, dt) => {
    if (!materialRef.current) return;
    const step = Math.min(dt, 0.05);
    uniforms.uTime.value += step;

    const { progress } = useWorld.getState();

    // Act 3: emerges around the particles, never replacing them, and never leaves again.
    const target = actsAt(progress).nebula;
    uniforms.uNebula.value += (target - uniforms.uNebula.value) * Math.min(1, step * 2.2);

    const { from, to, blend } = accentAt(progress);
    colA.set(from);
    colB.set(to);
    uniforms.uAccentA.value.lerp(colA, Math.min(1, dt * 3));
    uniforms.uAccentB.value.lerp(colB, Math.min(1, dt * 3));
    uniforms.uBlend.value += (blend - uniforms.uBlend.value) * Math.min(1, dt * 4);
  });

  return (
    <>
      {/* atmospheric perspective — distance dissolves into the void */}
      <fog attach="fog" args={['#070A14', 14, 52]} />

      {/* the nebula shell the camera flies inside */}
      <mesh scale={90} renderOrder={-1}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={BackSide}
          depthWrite={false}
          fog={false}
        />
      </mesh>

      {/* Stars and dust are NOT separate systems — the 400k particle universe is both, so the
          vortex can own the opening completely and nothing else exists until it unfurls. */}
    </>
  );
}
