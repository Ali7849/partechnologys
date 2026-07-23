'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, Color, type Points, type ShaderMaterial } from 'three';

import { useWorld } from '@/state/useWorld';

import { accentAt, birthAt } from './scenes';

/**
 * THE GALAXY — the opening. A procedural spiral of 140,000 glowing particles, simulated
 * entirely on the GPU: every particle's orbit, turbulence, dispersal and capture is solved in
 * the vertex shader from static attributes, so nothing is computed per-frame on the CPU.
 *
 * The sequence:
 *   · the spiral spins fast and decays to a slow drift over the first seconds
 *   · as the journey begins the arms break apart
 *   · ~8% of the mass is CAPTURED into tight energy streams orbiting the core
 *   · the remaining ~92% disperses outward and dissolves into the nebula
 *   · what is left is the core, wrapped in orbiting light
 *
 * Structure: differential rotation (inner particles orbit faster, as in a real disc), a dense
 * bulge, arm spread that widens with radius, and a disc that thins toward the rim.
 */

const COUNT = 140_000;
const ARMS = 4;
const RADIUS = 10.5;
const CAPTURE_FRACTION = 0.085; // the 5–10% that become orbiting energy streams

const vertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uSpin;
  uniform float uReveal;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3  uAccent;

  attribute vec3  aRandom;
  attribute float aSize;
  attribute float aRole;

  varying vec3  vColor;
  varying float vAlpha;

  vec3 rotY(vec3 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }

  // cheap curl-ish turbulence — enough to keep the gas from ever looking rigid
  vec3 turbulence(vec3 p, float t) {
    return vec3(
      sin(p.z * 0.35 + t * 0.7 + aRandom.x * 6.28),
      sin(p.x * 0.30 - t * 0.5 + aRandom.y * 6.28),
      sin(p.y * 0.40 + t * 0.6 + aRandom.z * 6.28)
    );
  }

  void main() {
    vec3 p = position;
    float r = length(p.xz);
    float rn = clamp(r / ${RADIUS.toFixed(1)}, 0.0, 1.0);

    // Differential rotation — the inner disc laps the rim, which is what sells it as a galaxy.
    float speed = uSpin * (1.6 / (0.55 + r * 0.42));
    p = rotY(p, uTime * speed);

    // Gas is never rigid.
    p += turbulence(p, uTime) * (0.06 + rn * 0.20);

    float captured = step(aRole, ${CAPTURE_FRACTION.toFixed(3)});

    // Captured mass: tight, fast streams wrapping the core.
    float orbR = 2.15 + aRandom.x * 1.35;
    float orbSpeed = 0.75 + aRandom.y * 0.75;
    float ang = uTime * orbSpeed + aRandom.z * 6.2831;
    vec3 orbit = vec3(
      cos(ang) * orbR,
      sin(ang * 1.7 + aRandom.x * 5.0) * 0.42 + (aRandom.y - 0.5) * 0.9,
      sin(ang) * orbR
    );

    // Everything else: pushed outward and thrown off the disc plane.
    vec3 disperse = p * (1.0 + uReveal * (1.1 + aRandom.x * 2.8));
    disperse.y += (aRandom.y - 0.5) * uReveal * 7.0;

    vec3 target = mix(disperse, orbit, captured);
    vec3 finalPos = mix(p, target, uReveal);

    vec4 mv = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Fast spin smears the disc: particles swell and dim rather than strobe.
    float smear = clamp((uSpin - 0.3) * 0.5, 0.0, 1.0);

    float size = aSize * uSize * (1.0 + smear * 1.1) * (1.0 + captured * 0.5);
    gl_PointSize = size * uPixelRatio * (260.0 / max(-mv.z, 0.1));

    // Hot bulge → blue-white disc → accent-tinted rim.
    vec3 hot = vec3(1.00, 0.93, 0.80);
    vec3 mid = vec3(0.64, 0.78, 1.00);
    vColor = mix(mix(hot, mid, smoothstep(0.0, 0.42, rn)), uAccent, smoothstep(0.42, 1.0, rn));
    vColor = mix(vColor, uAccent * 1.5 + 0.25, captured * uReveal);

    // Twinkle, then fade: dispersing mass dissolves, captured mass stays lit.
    float twinkle = 0.62 + 0.38 * sin(uTime * (1.4 + aRandom.z * 3.4) + aRandom.x * 24.0);
    float survive = mix(1.0, captured, uReveal);
    vAlpha = twinkle * survive * (1.0 - smear * 0.45);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Soft radial falloff with a hot centre — a glowing point, never a square.
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor * (0.65 + a * 0.9), a * vAlpha);
  }
`;

export function Galaxy() {
  const points = useRef<Points>(null);
  const material = useRef<ShaderMaterial>(null);
  const elapsed = useRef(0);
  const dpr = useThree((s) => s.viewport.dpr);

  // The disc is generated once: a bulged, four-armed spiral that thins toward the rim.
  const { positions, randoms, sizes, roles } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const randoms = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const roles = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // Concentrate mass toward the centre.
      const t = Math.random();
      const radius = Math.pow(t, 1.7) * RADIUS;
      const rn = radius / RADIUS;

      // Logarithmic arm sweep, with spread that widens as the arm unwinds.
      const arm = Math.floor(Math.random() * ARMS);
      const armAngle = (arm / ARMS) * Math.PI * 2;
      const sweep = radius * 0.46;
      const spread = (Math.random() - 0.5) * (0.28 + rn * 0.95);
      const angle = armAngle + sweep + spread;

      // Scatter — a few percent live between the arms, so the disc is not stencilled.
      const stray = Math.random() < 0.12 ? (Math.random() - 0.5) * 1.9 : 0;

      // Disc thins outward, bulges at the core.
      const thickness = (0.85 * Math.exp(-rn * 2.6) + 0.035) * (Math.random() - 0.5) * 2;

      positions[i * 3] = Math.cos(angle + stray) * radius;
      positions[i * 3 + 1] = thickness;
      positions[i * 3 + 2] = Math.sin(angle + stray) * radius;

      randoms[i * 3] = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();

      // Mostly dust, with occasional bright clusters.
      const bright = Math.random();
      sizes[i] = bright > 0.985 ? 5.5 + Math.random() * 4.5 : 0.7 + Math.random() * 1.5;

      roles[i] = Math.random();
    }

    return { positions, randoms, sizes, roles };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpin: { value: 2.4 },
      uReveal: { value: 0 },
      uSize: { value: 1.0 },
      uPixelRatio: { value: 1 },
      uAccent: { value: new Color('#7AA2F7') },
    }),
    [],
  );

  const accent = useMemo(() => new Color('#7AA2F7'), []);
  const accentB = useMemo(() => new Color(), []);

  useFrame((_, dt) => {
    if (!material.current) return;
    elapsed.current += dt;
    uniforms.uTime.value = elapsed.current;
    uniforms.uPixelRatio.value = dpr;

    // Spins fast on arrival, settling to a slow drift over the first few seconds.
    uniforms.uSpin.value = 0.16 + 2.3 * Math.exp(-elapsed.current * 0.55);

    const { progress } = useWorld.getState();
    uniforms.uReveal.value += (birthAt(progress) - uniforms.uReveal.value) * Math.min(1, dt * 2.6);

    const { from, to, blend } = accentAt(progress);
    accent.set(from);
    accentB.set(to);
    accent.lerp(accentB, blend);
    uniforms.uAccent.value.lerp(accent, Math.min(1, dt * 2));
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aRole" args={[roles, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
