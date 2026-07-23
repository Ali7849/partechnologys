'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, Color, Vector2, type BufferGeometry, type ShaderMaterial } from 'three';

import { useWorld } from '@/state/useWorld';

import { accentAt, actsAt } from './scenes';

/**
 * THE PARTICLE UNIVERSE — one system that plays every act of the opening.
 *
 * The SAME 400,000 particles are the vortex, the volumetric field, and the energy streams
 * around the hero. Nothing is ever swapped out or re-spawned; each particle simply carries two
 * forms and is interpolated between them, which is what makes the sequence read as one
 * continuous evolution rather than a series of effects.
 *
 *   ACT 1  an elliptical vortex alone in the dark — breathing, stretching, swirling
 *   ACT 2  it accelerates and unfurls outward into a volumetric field, orbital motion intact
 *   ACT 3  the nebula wraps around these same particles
 *   ACT 4  ~3.5% are captured into streams orbiting the core; the rest remain as the universe
 *
 * Motion is never plain rotation: a vortex field (tangential velocity with a gravitational
 * inward pull, differential by radius) is layered with curl-style procedural flow, so the
 * particles behave like a fluid under a force rather than points on a spinning disc.
 *
 * Performance: one draw call, two attributes (~9.6MB), zero per-frame allocation, adaptive
 * draw range, and distance fade that doubles as free LOD.
 */

const COUNT = 400_000;
const MIN_QUALITY_FRACTION = 0.35;

const vertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uSpin;
  uniform float uExpand;   // act 2 — vortex unfurls into the volumetric field
  uniform float uHero;     // act 4 — capture into orbiting streams
  uniform float uPixelRatio;
  uniform vec2  uMouse;
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
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }
  vec3 rotX(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
  }
  vec3 rotZ(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
  }

  // Curl-style procedural flow — cheap, divergence-free in feel, and it keeps the field
  // behaving like moving gas instead of a rigid body.
  vec3 curlish(vec3 p, float t) {
    return vec3(
      sin(p.y * 1.7 + t) * cos(p.z * 1.3 - t * 0.7),
      sin(p.z * 1.5 - t * 0.8) * cos(p.x * 1.9 + t * 0.6),
      sin(p.x * 1.3 + t * 0.9) * cos(p.y * 1.6 - t * 0.5)
    );
  }

  void main() {
    // ── ACT 1 · the elliptical vortex ────────────────────────────────────────
    // An oval ring: stretched in X, thin in Y, thickening toward its outer edge. It breathes
    // and stretches on slow offset cycles so it never settles into a fixed shape.
    float ang    = aRandom.z * 6.2831;
    float radial = pow(aRandom.x, 0.6);
    float ringR  = 1.35 + radial * 3.30;

    float breathe = 1.0 + 0.10 * sin(uTime * 0.33);
    float stretch = 1.0 + 0.14 * sin(uTime * 0.21 + 1.3);
    float squash  = 1.0 + 0.09 * sin(uTime * 0.27 + 2.1);

    vec3 vortex = vec3(
      cos(ang) * ringR * 2.05 * stretch * breathe,
      (aRandom.y - 0.5) * (0.28 + radial * 0.55) * squash,
      sin(ang) * ringR * 0.92 * breathe
    );

    // ── ACT 2 · unfurl into the volumetric field ─────────────────────────────
    // The position attribute holds the expanded form. The vortex evolves into it, never swaps.
    vec3 p = mix(vortex, position, uExpand);

    // ── Vortex field ─────────────────────────────────────────────────────────
    // Differential orbital motion, preserved through the expansion, plus a gravitational
    // pull toward the centre that slackens as the field opens out.
    float rr = max(length(p.xz), 0.001);
    float orbital = uSpin * (1.35 / (0.55 + rr * 0.22));
    p = rotY(p, uTime * orbital);

    vec2 inward = -p.xz / rr;
    float gravity = 0.55 * (1.0 - uExpand) * (0.3 + radial);
    p.xz += inward * gravity;

    // Orbital turbulence — stronger as the field opens, so expansion feels energetic.
    p += curlish(p * 0.17, uTime * 0.4) * (0.16 + uExpand * 0.85);

    // Mouse tilts the whole force, strongest while the vortex owns the frame.
    float lean = 1.0 - uExpand * 0.55;
    p = rotX(p, uMouse.y * 0.16 * lean);
    p = rotZ(p, -uMouse.x * 0.13 * lean);

    // ── ACT 4 · capture ──────────────────────────────────────────────────────
    float role = hash11(aRandom.x * 91.7 + aRandom.z * 17.3);
    float captured = step(role, 0.035);

    float orbR = 2.2 + hash11(aRandom.y * 41.0) * 1.4;
    float oa = uTime * (0.7 + aRandom.y * 0.7) + aRandom.z * 6.2831;
    vec3 orbit = vec3(
      cos(oa) * orbR,
      sin(oa * 1.6 + aRandom.x * 5.0) * 0.38 + (aRandom.y - 0.5) * 0.8,
      sin(oa) * orbR
    );

    // Everything not captured STAYS — the universe never empties to reveal the hero.
    vec3 finalPos = mix(p, orbit, captured * uHero);

    vec4 mv = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = max(-mv.z, 0.5);

    // ── Look ─────────────────────────────────────────────────────────────────
    // Microscopic and hard-clamped: premium dust, never blobs.
    float sizeSeed = aRandom.x;
    float bright = step(0.988, sizeSeed);
    float size = (0.26 + sizeSeed * 0.38) + bright * 1.0;
    gl_PointSize = clamp(size * (95.0 / dist), 0.5, 2.8) * uPixelRatio;

    // Cool blue-white, occasional warm stars, accent bleeding in at depth.
    float temp = aRandom.y;
    vec3 c = mix(vec3(0.70, 0.81, 1.00), vec3(0.98, 0.99, 1.00), smoothstep(0.25, 0.80, temp));
    c = mix(c, vec3(1.00, 0.80, 0.58), step(0.90, temp) * 0.9);
    c = mix(c, uAccent, smoothstep(45.0, 90.0, dist) * 0.35);
    c = mix(c, uAccent * 1.5 + 0.25, captured * uHero);

    // HDR: push the brightest stars above 1.0 so bloom has something real to catch.
    float lum = 0.30 + pow(temp, 1.6) * 0.75 + bright * 0.55;
    vColor = c * (0.85 + bright * 1.9);

    float twinkle = 0.72 + 0.28 * sin(uTime * (0.6 + aRandom.z * 1.8) + aRandom.x * 30.0);
    float depthFade = 1.0 - smoothstep(52.0, 96.0, dist);
    float nearFade = smoothstep(1.0, 3.5, dist);

    vAlpha = lum * twinkle * depthFade * nearFade;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Razor-sharp: a hard core with the barest falloff, and dead fragments thrown away early
    // so transparent overdraw costs as little fill as possible.
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.14, 0.5, d);
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

  // The EXPANDED form, generated once: a volumetric galactic band plus spherical halo,
  // scattered through depth and softly clustered. No arms — structure comes from motion.
  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const randoms = new Float32Array(COUNT * 3);

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
        const c = (Math.random() * CLUSTERS) | 0;
        const spread = 1.5 + Math.random() * 5.5;
        x = (cx[c] ?? 0) + (Math.random() - 0.5) * spread;
        y = (cy[c] ?? 0) + (Math.random() - 0.5) * spread * 0.5;
        z = (cz[c] ?? 0) + (Math.random() - 0.5) * spread;
      } else {
        const radius = 6 + Math.pow(Math.random(), 0.62) * 60;
        const theta = Math.random() * Math.PI * 2;
        const cosPhi = Math.random() * 2 - 1;
        const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
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
      uSpin: { value: 1.0 },
      uExpand: { value: 0 },
      uHero: { value: 0 },
      uPixelRatio: { value: 1 },
      uMouse: { value: new Vector2(0, 0) },
      uAccent: { value: new Color('#7AA2F7') },
    }),
    [],
  );

  const accent = useMemo(() => new Color('#7AA2F7'), []);
  const accentB = useMemo(() => new Color(), []);

  useFrame((_, dt) => {
    if (!material.current) return;
    const step = Math.min(dt, 0.05); // a stall must never throw the simulation
    elapsed.current += step;
    uniforms.uTime.value = elapsed.current;
    uniforms.uPixelRatio.value = dpr;

    const { progress, quality, mouseX, mouseY } = useWorld.getState();
    const acts = actsAt(progress);

    // The vortex is energetic on arrival, settles, then accelerates again as it unfurls.
    const settle = 0.55 + 0.85 * Math.exp(-elapsed.current * 0.35);
    uniforms.uSpin.value = settle + acts.expand * 0.9;

    uniforms.uExpand.value += (acts.expand - uniforms.uExpand.value) * Math.min(1, step * 2.4);
    uniforms.uHero.value += (acts.hero - uniforms.uHero.value) * Math.min(1, step * 2.4);

    uniforms.uMouse.value.x += (mouseX - uniforms.uMouse.value.x) * Math.min(1, step * 1.8);
    uniforms.uMouse.value.y += (mouseY - uniforms.uMouse.value.y) * Math.min(1, step * 1.8);

    const { from, to, blend } = accentAt(progress);
    accent.set(from);
    accentB.set(to);
    accent.lerp(accentB, blend);
    uniforms.uAccent.value.lerp(accent, Math.min(1, step * 2));

    // Adaptive density — thin under load, restore when headroom returns. Draw range only,
    // never a reallocation.
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
