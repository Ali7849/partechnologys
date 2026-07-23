'use client';

import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Matrix4,
  type InstancedMesh,
  type LineSegments,
  type MeshStandardMaterial,
} from 'three';

import { requestRender } from '@/motion/ticker';
import { NODES } from '@/features/homepage/content/placeholders';
import { COLOR } from '@/styles/tokens';

import { MATTE } from '../materials/materials';

/**
 * NODE FIELD (F05) — every real PAR system and Pontis site as a live operations lattice: an
 * InstancedMesh of nodes (one draw call) plus connective lines between neighbours, so the field
 * reads as a running network rather than scattered dots. The subject the visitor was just inside
 * is marked in Prussian — "the one you were just inside," now one node among the whole operation.
 *
 * The field is not staggered node-by-node; a single shared opacity fades the whole lattice in at
 * once (the correct reading of scale). Data is synthetic and blocked (Data Contract D4); the
 * positions prove the render approach only.
 */

const NODE_SIZE = 0.42;
const LINK_DISTANCE = 2.6; // neighbours closer than this get a connective line

const SUBJECT_COLOR = new Color(COLOR.prussian);
const NODE_COLOR = new Color(MATTE.color);

export function NodeField() {
  const mesh = useRef<InstancedMesh>(null);
  const lines = useRef<LineSegments>(null);
  const opacity = useRef(0);

  // Connective lattice: a line between every pair of neighbours within LINK_DISTANCE (XZ plane).
  const latticeGeometry = useMemo(() => {
    const verts: number[] = [];
    NODES.forEach((a, ai) => {
      NODES.forEach((b, bi) => {
        if (bi <= ai) return;
        const dx = a.position[0] - b.position[0];
        const dz = a.position[2] - b.position[2];
        if (Math.hypot(dx, dz) < LINK_DISTANCE) {
          verts.push(...a.position, ...b.position);
        }
      });
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(verts), 3));
    return geometry;
  }, []);

  // Places each instance and paints the subject node Prussian — written once (instances are static).
  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const matrix = new Matrix4();
    NODES.forEach((node, i) => {
      matrix.setPosition(node.position[0], node.position[1], node.position[2]);
      m.setMatrixAt(i, matrix);
      m.setColorAt(i, node.isSubject ? SUBJECT_COLOR : NODE_COLOR);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    requestRender();
  }, []);

  // Fades the whole lattice in as a single shared opacity; redraws only while it is arriving.
  useFrame(() => {
    if (opacity.current >= 1) return;
    opacity.current = Math.min(1, opacity.current + 0.02);
    const nodeMat = mesh.current?.material as MeshStandardMaterial | undefined;
    if (nodeMat) nodeMat.opacity = opacity.current;
    const lineMat = lines.current?.material;
    if (lineMat && !Array.isArray(lineMat)) lineMat.opacity = opacity.current * 0.5;
    requestRender();
  });

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, NODES.length]}>
        <boxGeometry args={[NODE_SIZE, NODE_SIZE, NODE_SIZE]} />
        <meshStandardMaterial
          roughness={MATTE.roughness}
          metalness={MATTE.metalness}
          transparent
          opacity={0}
        />
      </instancedMesh>

      <lineSegments ref={lines} geometry={latticeGeometry}>
        <lineBasicMaterial color={COLOR.prussian} transparent opacity={0} />
      </lineSegments>
    </group>
  );
}
