import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color, DoubleSide, Plane, Vector3, type Mesh, type MeshStandardMaterial } from 'three';

import { requestRender } from '@/motion/ticker';
import { useSceneStore } from '@/state/useSceneStore';

import { HIGHLIGHT, MATTE, SECTION_FACE, STRUCTURE } from '../materials/materials';

/**
 * PLACEHOLDER SUBJECT — a visibly generic block assembly standing in for the real system
 * (Data Contract D1, blocked). Real-time single-plane clipping drives the section cut: the
 * exposed cut face renders as flat unlit Fault, the one permitted use of that colour outside
 * a failure state, because a section cut is the material being broken open.
 *
 * The clip height is driven by scrollProgress inside useFrame (Tier 3 — 3D internals only),
 * never by a GSAP tween. A box footprint makes the Fault cap exact with no overhang.
 */

const TOP = 1.5;
const END = -0.6; // the plane stops short of the base, leaving interior legible
const RANGE = TOP - END;

const STRUCTURE_COLOR = new Color(STRUCTURE.color);
const HIGHLIGHT_COLOR = new Color(HIGHLIGHT.color);

export function PlaceholderSubject() {
  const clipPlane = useMemo(() => new Plane(new Vector3(0, -1, 0), TOP), []);
  const capRef = useRef<Mesh>(null);
  const componentRef = useRef<Mesh>(null);
  const lastClip = useRef(TOP);
  const lastHovered = useRef<string | null>(null);

  // Binds the clip height (and Fault cap) to scroll progress; redraws only while it changes.
  // Also applies the F03 component highlight: when an annotation is hovered, the linked
  // interior component tints Prussian — the DOM→3D link, read from the store, no raycast.
  useFrame(() => {
    const { scrollProgress: progress, hoveredId } = useSceneStore.getState();

    const clipY = TOP - progress * RANGE;
    if (Math.abs(clipY - lastClip.current) > 0.0005) {
      clipPlane.constant = clipY;
      lastClip.current = clipY;
      const cap = capRef.current;
      if (cap) {
        cap.position.y = clipY;
        cap.visible = progress > 0.02 && progress < 0.999;
      }
      requestRender();
    }

    if (hoveredId !== lastHovered.current) {
      lastHovered.current = hoveredId;
      const mesh = componentRef.current;
      if (mesh) {
        const material = mesh.material as MeshStandardMaterial;
        material.color.copy(hoveredId ? HIGHLIGHT_COLOR : STRUCTURE_COLOR);
      }
      requestRender();
    }
  });

  return (
    <group>
      {/* the system enclosure */}
      <mesh>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial
          color={MATTE.color}
          roughness={MATTE.roughness}
          metalness={MATTE.metalness}
          side={DoubleSide}
          clippingPlanes={[clipPlane]}
          clipShadows
        />
      </mesh>

      {/* interior components — clearly generic placeholders */}
      <mesh ref={componentRef} position={[-0.85, 0.1, -0.6]}>
        <boxGeometry args={[1.3, 1.6, 1.3]} />
        <meshStandardMaterial
          color={STRUCTURE.color}
          roughness={STRUCTURE.roughness}
          metalness={STRUCTURE.metalness}
          side={DoubleSide}
          clippingPlanes={[clipPlane]}
        />
      </mesh>
      <mesh position={[0.9, -0.4, 0.7]}>
        <boxGeometry args={[1.1, 1, 1.1]} />
        <meshStandardMaterial
          color={STRUCTURE.color}
          roughness={STRUCTURE.roughness}
          metalness={STRUCTURE.metalness}
          side={DoubleSide}
          clippingPlanes={[clipPlane]}
        />
      </mesh>

      {/* the section-cut face — flat, unlit Fault, sized to the footprint */}
      <mesh ref={capRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, TOP, 0]} visible={false}>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial color={SECTION_FACE.color} side={DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}
