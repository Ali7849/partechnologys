'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  type InstancedMesh,
  type Mesh,
  type ShaderMaterial,
} from 'three';

import { useWorld } from '@/state/useWorld';

import { FRAGMENT_ANCHORS, SCENE_COUNT } from './scenes';

/**
 * NEBULA FRAGMENTS — the pillars, and the only content system in the world.
 *
 * There is no separate section architecture: each of PAR's capabilities IS a fragment of the
 * nebula, hanging in space just inboard of the camera's flight path. As the camera approaches
 * one, the fragment's cloud thickens and a holographic panel flies IN from the surrounding
 * nebula — decelerating into place rather than fading up, so it reads as a physical object
 * arriving rather than a UI element appearing.
 *
 * The cloud is a single instanced draw call for every fragment combined (view-space
 * billboards, additive, no depth write). Panels are seven small meshes. Presence is derived
 * from scroll position, not distance checks, so it is deterministic and costs nothing.
 */

const CLOUD_PER_FRAGMENT = 22;
const FRAGMENT_COUNT = FRAGMENT_ANCHORS.length;
const CLOUD_TOTAL = FRAGMENT_COUNT * CLOUD_PER_FRAGMENT;

/* ── The cloud ───────────────────────────────────────────────────────────── */

const cloudVertex = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uPresence[${FRAGMENT_COUNT}];

  attribute vec3  aAnchor;
  attribute vec3  aTint;
  attribute vec4  aSeed;   // x: size, y: phase, z: drift, w: fragment index

  varying vec2  vUv;
  varying vec3  vTint;
  varying float vFade;

  void main() {
    vUv = uv;
    vTint = aTint;

    float presence = uPresence[int(aSeed.w)];

    // Slow independent drift so no two puffs ever sit still together.
    vec3 drift = vec3(
      sin(uTime * 0.13 + aSeed.y * 6.28),
      cos(uTime * 0.11 + aSeed.y * 4.11),
      sin(uTime * 0.09 + aSeed.y * 5.37)
    ) * aSeed.z;

    vec3 world = aAnchor + drift;

    // View-space billboard: always faces camera, no per-frame CPU orientation work.
    vec4 mv = modelViewMatrix * vec4(world, 1.0);
    float size = aSeed.x * (0.55 + presence * 0.75);
    mv.xy += position.xy * size;

    gl_Position = projectionMatrix * mv;
    vFade = presence;
  }
`;

const cloudFragment = /* glsl */ `
  precision highp float;

  varying vec2  vUv;
  varying vec3  vTint;
  varying float vFade;

  void main() {
    // Soft volumetric puff — wide gaussian, no edge whatsoever.
    vec2 p = vUv - 0.5;
    float d2 = dot(p, p);
    if (d2 > 0.25) discard;
    float a = exp(-d2 * 11.0) - 0.06;
    if (a <= 0.0) discard;
    gl_FragColor = vec4(vTint, a * vFade * 0.30);
  }
`;

/* ── The holographic panel ───────────────────────────────────────────────── */

const panelVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const panelFragment = /* glsl */ `
  precision highp float;

  uniform vec3  uAccent;
  uniform float uPresence;
  uniform float uTime;
  varying vec2  vUv;

  // Rounded-rectangle signed distance — gives the panel machined corners.
  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(2.0, 1.25);
    float d = roundedBox(p, vec2(0.94, 0.56), 0.10);
    if (d > 0.0) discard;

    // Glass body: faint, cool, and darker toward the bottom so it has weight.
    float body = 0.055 + 0.05 * (1.0 - vUv.y);

    // Machined edge, lit in the capability's accent — this is what bloom catches.
    float edge = smoothstep(0.030, 0.0, abs(d)) * 1.15;

    // Holographic readout: scanlines plus a slow sweep, suggesting a live interface
    // without ever faking specific data.
    float scan = 0.5 + 0.5 * sin(vUv.y * 210.0);
    float sweep = smoothstep(0.36, 0.0, abs(fract(vUv.y * 0.5 - uTime * 0.10) - 0.5));

    // Abstract instrument bars — geometry, not invented numbers.
    float bars = step(0.72, fract(vUv.x * 7.0)) * step(vUv.y, 0.30) * step(0.10, vUv.y);

    vec3 col = vec3(body);
    col += uAccent * edge;
    col += uAccent * scan * 0.020;
    col += uAccent * sweep * 0.14;
    col += uAccent * bars * 0.28;

    float alpha = (0.30 + edge * 0.85 + bars * 0.30 + sweep * 0.12) * uPresence;
    gl_FragColor = vec4(col, alpha);
  }
`;

function Panel({
  index,
  anchor,
  accent,
}: {
  index: number;
  anchor: [number, number, number];
  accent: string;
}) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const shown = useRef(0);

  const uniforms = useMemo(
    () => ({
      uAccent: { value: new Color(accent) },
      uPresence: { value: 0 },
      uTime: { value: 0 },
    }),
    [accent],
  );

  // Where the panel flies in FROM — further out in the nebula, off to one side.
  const origin = useMemo<[number, number, number]>(
    () => [anchor[0] * 1.9 + 5.5, anchor[1] + 3.4, anchor[2] * 1.9 - 4.5],
    [anchor],
  );

  useFrame(({ camera }, dt) => {
    const m = mesh.current;
    if (!m || !material.current) return;
    const step = Math.min(dt, 0.05);

    const { progress } = useWorld.getState();
    const u = (index + 1) / (SCENE_COUNT - 1);
    const w = 1 / (SCENE_COUNT - 1);
    const dist = Math.abs(progress - u) / w;
    const t = Math.min(1, Math.max(0, 1 - (dist - 0.3) / 0.95));
    const presence = t * t * (3 - 2 * t);

    // Decelerating arrival — fast out of the nebula, easing into place. Never a fade-up.
    shown.current += (presence - shown.current) * Math.min(1, step * 2.2);
    const e = shown.current;

    m.position.set(
      origin[0] + (anchor[0] - origin[0]) * e,
      origin[1] + (anchor[1] - origin[1]) * e,
      origin[2] + (anchor[2] - origin[2]) * e,
    );

    // Continuous float — nothing in this world is ever perfectly still.
    const bob = Math.sin(performance.now() * 0.00042 + index) * 0.16;
    m.position.y += bob;

    m.scale.setScalar(0.72 + e * 0.28);
    m.lookAt(camera.position); // always presents itself to the viewer

    uniforms.uPresence.value = e;
    uniforms.uTime.value += step;
    material.current.visible = e > 0.01;
  });

  return (
    <mesh ref={mesh} visible={false}>
      <planeGeometry args={[3.1, 1.95]} />
      <shaderMaterial
        ref={material}
        vertexShader={panelVertex}
        fragmentShader={panelFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ── The system ──────────────────────────────────────────────────────────── */

export function Fragments() {
  const cloud = useRef<InstancedMesh>(null);
  const cloudMat = useRef<ShaderMaterial>(null);

  const { anchors, tints, seeds } = useMemo(() => {
    const anchors = new Float32Array(CLOUD_TOTAL * 3);
    const tints = new Float32Array(CLOUD_TOTAL * 3);
    const seeds = new Float32Array(CLOUD_TOTAL * 4);
    const c = new Color();

    let i = 0;
    FRAGMENT_ANCHORS.forEach((fragment, f) => {
      c.set(fragment.accent);
      for (let k = 0; k < CLOUD_PER_FRAGMENT; k++) {
        // Puffs scatter around the anchor into an irregular, torn-looking fragment.
        const spread = 1.6 + Math.random() * 3.4;
        anchors[i * 3] = fragment.position[0] + (Math.random() - 0.5) * spread * 1.6;
        anchors[i * 3 + 1] = fragment.position[1] + (Math.random() - 0.5) * spread * 0.8;
        anchors[i * 3 + 2] = fragment.position[2] + (Math.random() - 0.5) * spread * 1.6;

        tints[i * 3] = c.r;
        tints[i * 3 + 1] = c.g;
        tints[i * 3 + 2] = c.b;

        seeds[i * 4] = 2.6 + Math.random() * 5.2; // size
        seeds[i * 4 + 1] = Math.random(); // phase
        seeds[i * 4 + 2] = 0.3 + Math.random() * 0.7; // drift amount
        seeds[i * 4 + 3] = f; // which fragment
        i++;
      }
    });

    return { anchors, tints, seeds };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPresence: { value: new Array<number>(FRAGMENT_COUNT).fill(0) },
    }),
    [],
  );

  useFrame((_, dt) => {
    if (!cloudMat.current) return;
    const step = Math.min(dt, 0.05);
    uniforms.uTime.value += step;

    const { progress } = useWorld.getState();
    const w = 1 / (SCENE_COUNT - 1);
    const presence = uniforms.uPresence.value;

    for (let f = 0; f < FRAGMENT_COUNT; f++) {
      const u = (f + 1) / (SCENE_COUNT - 1);
      const d = Math.abs(progress - u) / w;
      const t = Math.min(1, Math.max(0, 1 - (d - 0.45) / 1.5));
      const target = t * t * (3 - 2 * t);
      presence[f] = (presence[f] ?? 0) + (target - (presence[f] ?? 0)) * Math.min(1, step * 2);
    }
  });

  return (
    <group>
      <instancedMesh ref={cloud} args={[undefined, undefined, CLOUD_TOTAL]} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={cloudMat}
          vertexShader={cloudVertex}
          fragmentShader={cloudFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
        <instancedBufferAttribute attach="geometry-attributes-aAnchor" args={[anchors, 3]} />
        <instancedBufferAttribute attach="geometry-attributes-aTint" args={[tints, 3]} />
        <instancedBufferAttribute attach="geometry-attributes-aSeed" args={[seeds, 4]} />
      </instancedMesh>

      {FRAGMENT_ANCHORS.map((fragment, i) => (
        <Panel key={fragment.id} index={i} anchor={fragment.position} accent={fragment.accent} />
      ))}
    </group>
  );
}
