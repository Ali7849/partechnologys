'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, Color, type BufferGeometry, type ShaderMaterial } from 'three';

import { useWorld } from '@/state/useWorld';

import { accentAt, birthAt } from './scenes';

/**
 * THE STARFIELD — deep space, not a diagram.
 *
 * 500,000 tiny stars suspended inside the nebula. There are NO drawn arms: the distribution is
 * a volumetric galactic band plus a spherical halo, scattered through 60 units of depth and
 * gathered into soft clusters. The spiral is produced purely by DIFFERENTIAL ROTATION — inner
 * stars orbit faster than outer ones, so shear alone organises the field into streams over
 * time. The galaxy is implied by motion, never painted by particle placement.
 *
 * Stars are deliberately sub-pixel to a few pixels and hard-clamped, so the field reads as
 * dense premium dust rather than blobs. Colour runs cool blue-white with occasional warm
 * stars; brightness, size and twinkle phase are all derived in-shader from two attributes.
 *
 * Performance: one draw call, two attributes (12MB), zero per-frame allocation, and an
 * adaptive draw range that thins the field when framerate drops and restores it when it
 * recovers. Distant stars fade out, which is both atmospheric perspective and free LOD.
 */

const COUNT = 500_000;
const MIN_QUALITY_FRACTION = 0.35;

const vertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uSpin;
  uniform float uReveal;
  uniform float uPixelRatio;
  uniform vec3  uAccent;

  attribute vec3 aRandom;

  varying vec3  vColor;
  varying float vAlpha;

  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }

  vec3 rotY(vec3 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }

  void main() {
    vec3 p = position;
    float rd = length(p.xz);

    // DIFFERENTIAL ROTATION — the whole spiral impression comes from this shear and nothing
    // else. Inner stars lap outer ones, so streams organise themselves out of a uniform field.
    float speed = uSpin * (1.0 / (0.85 + rd * 0.16));
    p = rotY(p, uTime * speed);

    // Slow cosmic drift so the field never feels rigid. Cheap: three sines, no noise texture.
    p += vec3(
      sin(p.z * 0.09 + uTime * 0.16 + aRandom.x * 6.2831),
      sin(p.x * 0.08 - uTime * 0.13 + aRandom.y * 6.2831),
      sin(p.y * 0.10 + uTime * 0.15 + aRandom.z * 6.2831)
    ) * 0.35;

    // A small fraction is drawn into orbit around the core as it is born.
    float role = hash11(aRandom.x * 91.7 + aRandom.z * 17.3);
    float captured = step(role, 0.035);

    float orbR = 2.2 + hash11(aRandom.y * 41.0) * 1.4;
    float orbSpeed = 0.7 + aRandom.y * 0.7;
    float ang = uTime * orbSpeed + aRandom.z * 6.2831;
    vec3 orbit = vec3(
      cos(ang) * orbR,
      sin(ang * 1.6 + aRandom.x * 5.0) * 0.38 + (aRandom.y - 0.5) * 0.8,
      sin(ang) * orbR
    );

    // Everything else STAYS — the universe does not empty out to reveal the hero.
    vec3 rest = p * (1.0 + uReveal * 0.05);

    vec3 finalPos = mix(p, mix(rest, orbit, captured), uReveal);

    vec4 mv = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = max(-mv.z, 0.5);

    // Size: tiny and hard-clamped. Rare bright stars are still only a few pixels.
    float sizeSeed = aRandom.x;
    float bright = step(0.988, sizeSeed);
    float size = (0.30 + sizeSeed * 0.42) + bright * 1.15;
    float px = clamp(size * (95.0 / dist), 0.55, 3.4);
    gl_PointSize = px * uPixelRatio;

    // Colour: cool blue-white, a few warm stars, accent bleed at the far rim.
    float temp = aRandom.y;
    vec3 cool = vec3(0.70, 0.81, 1.00);
    vec3 white = vec3(0.98, 0.99, 1.00);
    vec3 warm = vec3(1.00, 0.80, 0.58);
    vec3 c = mix(cool, white, smoothstep(0.25, 0.80, temp));
    c = mix(c, warm, step(0.90, temp) * 0.9);
    c = mix(c, uAccent, smoothstep(45.0, 90.0, dist) * 0.35);
    c = mix(c, uAccent * 1.4 + 0.2, captured * uReveal);
    vColor = c;

    // Brightness varies per star; twinkle is a slow natural shimmer, not a strobe.
    float lum = 0.30 + pow(temp, 1.6) * 0.75 + bright * 0.5;
    float twinkle = 0.72 + 0.28 * sin(uTime * (0.6 + aRandom.z * 1.8) + aRandom.x * 30.0);

    // Distant stars fade — atmospheric perspective, and free LOD (no fill cost when invisible).
    float depthFade = 1.0 - smoothstep(52.0, 96.0, dist);
    // Very near stars ease off so nothing smears across the lens as the camera flies.
    float nearFade = smoothstep(1.2, 4.0, dist);

    vAlpha = lum * twinkle * depthFade * nearFade;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Crisp: a hard little core with only a hint of falloff. Cheap, and it keeps stars
    // reading as points of light rather than soft blobs.
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.16, 0.5, d);
    if (a <= 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

export function Starfield() {
  const geometry = useRef<BufferGeometry>(null);
  const material = useRef<ShaderMaterial>(null);
  const elapsed = useRef(0);
  const drawn = useRef(COUNT);
  const dpr = useThree((s) => s.viewport.dpr);

  // Generated once. A galactic band + halo, scattered through depth and softly clustered —
  // density variation comes from clustering, never from drawn arms.
  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const randoms = new Float32Array(COUNT * 3);

    // Soft cluster seeds give the field structure without ever forming a shape.
    const CLUSTERS = 240;
    const cx = new Float32Array(CLUSTERS);
    const cy = new Float32Array(CLUSTERS);
    const cz = new Float32Array(CLUSTERS);
    for (let c = 0; c < CLUSTERS; c++) {
      const cr = 8 + Math.pow(Math.random(), 0.7) * 54;
      const ct = Math.random() * Math.PI * 2;
      cx[c] = Math.cos(ct) * cr;
      cy[c] = (Math.random() - 0.5) * cr * 0.22;
      cz[c] = Math.sin(ct) * cr;
    }

    for (let i = 0; i < COUNT; i++) {
      let x: number;
      let y: number;
      let z: number;

      if (Math.random() < 0.28) {
        // Cluster member — jitters around a seed, giving dense knots of stars.
        const c = (Math.random() * CLUSTERS) | 0;
        const spread = 1.5 + Math.random() * 5.5;
        x = (cx[c] ?? 0) + (Math.random() - 0.5) * spread;
        y = (cy[c] ?? 0) + (Math.random() - 0.5) * spread * 0.5;
        z = (cz[c] ?? 0) + (Math.random() - 0.5) * spread;
      } else {
        // Field star — volumetric, spread through 60 units of depth.
        const radius = 6 + Math.pow(Math.random(), 0.62) * 60;
        const theta = Math.random() * Math.PI * 2;
        const cosPhi = Math.random() * 2 - 1;
        const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));

        // Most stars belong to the galactic band; the rest form a spherical halo.
        const flatten = Math.random() < 0.7 ? 0.1 + Math.random() * 0.14 : 0.5 + Math.random() * 0.5;

        x = radius * sinPhi * Math.cos(theta);
        z = radius * sinPhi * Math.sin(theta);
        y = radius * cosPhi * flatten;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      randoms[i * 3] = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();
    }

    return { positions, randoms };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpin: { value: 1.4 },
      uReveal: { value: 0 },
      uPixelRatio: { value: 1 },
      uAccent: { value: new Color('#7AA2F7') },
    }),
    [],
  );

  const accent = useMemo(() => new Color('#7AA2F7'), []);
  const accentB = useMemo(() => new Color(), []);

  useFrame((_, dt) => {
    if (!material.current) return;
    const step = Math.min(dt, 0.05); // never let a stall throw the simulation
    elapsed.current += step;
    uniforms.uTime.value = elapsed.current;
    uniforms.uPixelRatio.value = dpr;

    // Spins quickly on arrival, settling into slow cosmic drift over the first seconds.
    uniforms.uSpin.value = 0.13 + 1.35 * Math.exp(-elapsed.current * 0.42);

    const { progress, quality } = useWorld.getState();
    uniforms.uReveal.value += (birthAt(progress) - uniforms.uReveal.value) * Math.min(1, step * 2.6);

    const { from, to, blend } = accentAt(progress);
    accent.set(from);
    accentB.set(to);
    accent.lerp(accentB, blend);
    uniforms.uAccent.value.lerp(accent, Math.min(1, step * 2));

    // Adaptive density — thin the field under load, restore it when headroom returns.
    const target =
      Math.round(
        (COUNT * (MIN_QUALITY_FRACTION + (1 - MIN_QUALITY_FRACTION) * quality)) / 10_000,
      ) * 10_000;
    if (target !== drawn.current && geometry.current) {
      drawn.current = target;
      geometry.current.setDrawRange(0, target);
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geometry}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        fog={false}
      />
    </points>
  );
}
