'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, Color, Vector2, type BufferGeometry, type ShaderMaterial } from 'three';

import { useWorld } from '@/state/useWorld';

import { accentAt, resolveActs } from './scenes';

/**
 * THE PARTICLE UNIVERSE — one system that plays every act.
 *
 * The SAME 400,000 particles are the vortex, the volumetric field, and the energy streams
 * around the core. Each carries two forms and is interpolated between them, so the sequence is
 * one continuous evolution rather than effects swapping over.
 *
 *   ACT 1  a vertically-stretched elliptical vortex — an eye, not a ring — sitting right of
 *          centre, swirling in its own plane, breathing and stretching on offset cycles
 *   ACT 2  it opens and unfurls outward into the volumetric field; the camera enters it
 *   ACT 3  the nebula wraps around these same particles
 *   ACT 4  ~8% are captured into permanent orbiting streams; the rest remain as the universe
 *
 * NOTHING EVER FREEZES: the vortex swirls, the field rotates differentially, curl flow runs
 * continuously, and the captured streams orbit forever — the universe stays alive for the
 * entire journey, not just the intro.
 *
 * On particle SIZE — a deliberate engineering note. Below ~1 device pixel a point cannot get
 * visually smaller; the GPU still rasterises roughly one pixel, it just aliases. So making
 * particles "imperceptible" is not a size problem, it is a DENSITY × ALPHA problem: each
 * particle contributes very little light, and the glow is built by additive accumulation of
 * thousands of them. That is how film-grade volumetrics are actually made, and it is why the
 * per-particle alpha here is low and the falloff is smooth rather than hard-edged.
 */

const COUNT = 400_000;
const MIN_QUALITY_FRACTION = 0.35;

const vertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uSpin;
  uniform float uExpand;   // act 2 — the vortex opens into the field
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

  // Curl-style procedural flow — keeps the field behaving like moving gas, never a rigid body.
  vec3 curlish(vec3 p, float t) {
    return vec3(
      sin(p.y * 1.7 + t) * cos(p.z * 1.3 - t * 0.7),
      sin(p.z * 1.5 - t * 0.8) * cos(p.x * 1.9 + t * 0.6),
      sin(p.x * 1.3 + t * 0.9) * cos(p.y * 1.6 - t * 0.5)
    );
  }

  void main() {
    // ── ACT 1 · the iris ─────────────────────────────────────────────────────
    // A COSMIC IRIS: a circular annulus of particles orbiting a perfectly black void. The
    // pupil is empty geometry — nothing is ever placed inside it, so it emits exactly zero
    // and reads as an event horizon. All visible energy comes from the particles around it.
    // Density is weighted toward the inner edge, the way an accretion disc actually loads.
    float band   = pow(aRandom.x, 1.7);           // 0 = inner rim, 1 = outer edge
    float radial = band;

    float breathe = 1.0 + 0.055 * sin(uTime * 0.33);

    float rad = 1.62 + band * 3.55;               // void radius 1.62 → outer 5.17

    // Differential 360° rotation: the inner rim laps the outer, so the ring shears into
    // streams on its own rather than turning like a solid wheel.
    float t = aRandom.z * 6.2831 + uTime * uSpin * (1.15 / (0.45 + rad * 0.30));

    // Built face-on to the camera, very slightly elliptical, thin in depth.
    vec3 vortex = vec3(
      cos(t) * rad * breathe,
      sin(t) * rad * breathe * 0.94,
      (aRandom.y - 0.5) * (0.10 + band * 0.62)
    );

    // Sits right of centre, drifting back to centre as it opens into the gateway.
    vortex.x += 2.15 * (1.0 - uExpand * 0.85);

    // ── ACT 2 · the volumetric field ─────────────────────────────────────────
    vec3 field = position;
    float fr = max(length(field.xz), 0.001);
    field = rotY(field, uTime * uSpin * (1.05 / (0.55 + fr * 0.22)));

    // The vortex OPENS into the field — the same particles, never replaced.
    vec3 p = mix(vortex, field, uExpand);

    // Gravitational pull toward the centre, slackening as the field opens out.
    vec2 rc = p.xz;
    float rr = max(length(rc), 0.001);
    p.xz += (-rc / rr) * (0.5 * (1.0 - uExpand) * (0.3 + radial));

    // Orbital turbulence — stronger as the field expands, so opening feels energetic.
    p += curlish(p * 0.17, uTime * 0.4) * (0.14 + uExpand * 0.8);

    // Mouse tilts the whole force, strongest while the vortex owns the frame.
    float lean = 1.0 - uExpand * 0.55;
    p = rotX(p, uMouse.y * 0.15 * lean);
    p = rotZ(p, -uMouse.x * 0.12 * lean);

    // ── ACT 4 · permanent orbiting streams ───────────────────────────────────
    float role = hash11(aRandom.x * 91.7 + aRandom.z * 17.3);
    float captured = step(role, 0.08);

    float orbR = 2.1 + hash11(aRandom.y * 41.0) * 1.5;
    float oa = uTime * (0.7 + aRandom.y * 0.7) + aRandom.z * 6.2831;
    vec3 orbit = vec3(
      cos(oa) * orbR,
      sin(oa * 1.6 + aRandom.x * 5.0) * 0.40 + (aRandom.y - 0.5) * 0.8,
      sin(oa) * orbR
    );

    vec3 finalPos = mix(p, orbit, captured * uHero);

    vec4 mv = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = max(-mv.z, 0.5);

    // ── Look ─────────────────────────────────────────────────────────────────
    // Microscopic. Roughly a fifth of the previous footprint, which is also the single
    // largest saving in blended fill rate.
    // TEMPORAL STABILITY — the floor of 1.0 device pixel is deliberate. A point smaller than
    // one pixel does not render smaller, it flickers as it drifts across the sample grid, and
    // with 400k of them that shimmer is the single worst artefact in the frame. Clamping to a
    // whole pixel and carrying brightness in alpha instead keeps the field rock steady.
    float sizeSeed = aRandom.x;
    float bright = step(0.991, sizeSeed);
    float size = (0.09 + sizeSeed * 0.15) + bright * 0.32;
    gl_PointSize = max(clamp(size * (95.0 / dist), 0.0, 2.6) * uPixelRatio, 1.0);

    // Cinematic grade: deep saturated blue → cyan → violet, with white held back for only
    // the rarest highlights. Previously most of the field sat near white, which is exactly
    // what washed the scene out — saturation is what makes it read as expensive.
    float temp = aRandom.y;
    vec3 c = vec3(0.10, 0.28, 0.92);                                        // deep blue
    c = mix(c, vec3(0.18, 0.70, 1.00), smoothstep(0.00, 0.44, temp));       // cyan
    c = mix(c, vec3(0.52, 0.44, 1.00), smoothstep(0.44, 0.80, temp));       // violet
    c = mix(c, vec3(0.94, 0.97, 1.00), smoothstep(0.93, 1.00, temp));       // white, rare
    c = mix(c, uAccent, smoothstep(45.0, 90.0, dist) * 0.30);
    c = mix(c, uAccent * 1.6 + 0.3, captured * uHero);

    // HDR — the brightest particles sit well above 1.0 so bloom has real energy to gather.
    // The particles make the light; the background contributes none.
    vColor = c * (1.15 + bright * 3.2);

    float lum = 0.26 + pow(temp, 1.7) * 0.62 + bright * 0.5;
    // Gentler twinkle — high amplitude on a 400k field reads as noise, not stars.
    float twinkle = 0.86 + 0.14 * sin(uTime * (0.6 + aRandom.z * 1.8) + aRandom.x * 30.0);
    float depthFade = 1.0 - smoothstep(52.0, 96.0, dist);
    float nearFade = smoothstep(1.0, 3.5, dist);

    // Low per-particle contribution: the glow is built by accumulation, not by any one dot.
    vAlpha = lum * twinkle * depthFade * nearFade * 0.42;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // A single tight core, no wide halo. The halo lobe was what smeared white haze across
    // the frame once thousands of particles accumulated — bloom should build the glow, not
    // the sprite. Polynomial falloff instead of exp(): same curve shape, materially cheaper
    // per fragment, and this shader runs on every blended pixel in the scene.
    vec2 uv = gl_PointCoord - 0.5;
    float d2 = dot(uv, uv);
    if (d2 > 0.25) discard;
    float a = 1.0 - d2 * 4.0;   // 1 at centre → 0 at the rim
    a *= a;                      // sharpen: crisp point, no soft wash
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

    const { progress, quality, mouseX, mouseY, variant } = useWorld.getState();
    const acts = resolveActs(progress, variant);

    // Settles from its arrival energy, then accelerates again as it opens. Never reaches zero.
    const settle = 0.62 + 0.75 * Math.exp(-elapsed.current * 0.35);
    uniforms.uSpin.value = settle + acts.expand * 0.85;

    uniforms.uExpand.value += (acts.expand - uniforms.uExpand.value) * Math.min(1, step * 2.4);
    uniforms.uHero.value += (acts.hero - uniforms.uHero.value) * Math.min(1, step * 2.4);

    uniforms.uMouse.value.x += (mouseX - uniforms.uMouse.value.x) * Math.min(1, step * 1.8);
    uniforms.uMouse.value.y += (mouseY - uniforms.uMouse.value.y) * Math.min(1, step * 1.8);

    const { from, to, blend } = accentAt(progress);
    accent.set(from);
    accentB.set(to);
    accent.lerp(accentB, blend);
    uniforms.uAccent.value.lerp(accent, Math.min(1, step * 2));

    // Adaptive density — thin under load, restore when headroom returns. Draw range only.
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
