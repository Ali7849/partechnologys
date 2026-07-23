'use client';

import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Color, Matrix4, type InstancedMesh, type MeshStandardMaterial } from 'three';

import { requestRender } from '@/motion/ticker';
import { NODES } from '@/features/homepage/content/placeholders';

import { MATTE } from '../materials/materials';

/**
 * NODE FIELD (F05) — every real PAR system and Pontis site as one InstancedMesh: one draw
 * call regardless of count (the page's peak GPU moment, verified to return to idle once the
 * plan camera locks). The subject the visitor was just inside becomes one node among them.
 *
 * The field is NOT staggered — the motion system caps stagger at six, and a field exceeds it.
 * Instead a single shared opacity fades the whole InstancedMesh in at once, which is both the
 * correct reading of scale ("the field appears") and mechanically one animated value, not N.
 *
 * Data is synthetic and blocked (Data Contract D4); positions prove the render approach only.
 */

const NODE_SIZE = 0.5;

export function NodeField() {
  const mesh = useRef<InstancedMesh>(null);
  const opacity = useRef(0);
  const color = useMemo(() => new Color(MATTE.color), []);

  // Writes each instance's transform once — instances are static; only the shared opacity moves.
  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const matrix = new Matrix4();
    NODES.forEach((node, i) => {
      matrix.setPosition(node.position[0], node.position[1], node.position[2]);
      m.setMatrixAt(i, matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    requestRender();
  }, []);

  // Fades the field in as a single opacity uniform; redraws only while it is arriving.
  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const material = m.material as MeshStandardMaterial;
    if (opacity.current < 1) {
      opacity.current = Math.min(1, opacity.current + dt * 2.4);
      material.opacity = opacity.current;
      requestRender();
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, NODES.length]}>
      <boxGeometry args={[NODE_SIZE, NODE_SIZE, NODE_SIZE]} />
      <meshStandardMaterial
        color={color}
        roughness={MATTE.roughness}
        metalness={MATTE.metalness}
        transparent
        opacity={0}
      />
    </instancedMesh>
  );
}
