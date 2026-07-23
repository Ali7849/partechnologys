import { Edges } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color, DoubleSide, Plane, Vector3, type Mesh, type MeshStandardMaterial } from 'three';

import { requestRender } from '@/motion/ticker';
import { useSceneStore } from '@/state/useSceneStore';
import { COLOR } from '@/styles/tokens';

import { HIGHLIGHT, MATTE, SECTION_FACE, STRUCTURE } from '../materials/materials';

/**
 * PLACEHOLDER SUBJECT — a visibly generic but *engineered* instrument standing in for the real
 * system (Data Contract D1, blocked): a machined chassis on a base plinth, faced with a mounted
 * panel and one addressable module, drawn with crisp drafting hairlines. Not a claimed product —
 * an abstract precision object the drawing sheet can section.
 *
 * Real-time single-plane clipping drives the section cut. The exposed cross-section renders as
 * flat unlit Fault poché — the one permitted use of that colour outside a failure state, because
 * a section cut is the material broken open. Clip height is driven by scrollProgress inside
 * useFrame (Tier 3, never a GSAP tween); a rectangular footprint keeps the Fault cap exact.
 *
 * The base plinth sits entirely below the plane's travel, so it stays whole — the object always
 * reads as resting on the sheet, even fully sectioned.
 */

// Body spans y ∈ [-2, +2]; the plane travels from the top down to just above the plinth.
const TOP = 2.0;
const END = -0.9;
const RANGE = TOP - END;

// Footprint (x × z) — the Fault cap and body share it exactly, no overhang.
const W = 3.4;
const D = 2.6;

const STRUCTURE_COLOR = new Color(STRUCTURE.color);
const HIGHLIGHT_COLOR = new Color(HIGHLIGHT.color);

export function PlaceholderSubject() {
  const clipPlane = useMemo(() => new Plane(new Vector3(0, -1, 0), TOP), []);
  const clipPlanes = useMemo(() => [clipPlane], [clipPlane]);
  const capRef = useRef<Mesh>(null);
  const componentRef = useRef<Mesh>(null);
  const lastClip = useRef(TOP);
  const lastHovered = useRef<string | null>(null);

  // Binds the clip height (and Fault poché cap) to scroll progress; redraws only while it moves.
  // Also applies the F03 component highlight: a hovered annotation tints its linked module
  // Prussian — the DOM→3D link, read from the store, no raycast.
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
      {/* the machined chassis — matte body with drafting hairline edges, sectioned by the plane */}
      <mesh castShadow>
        <boxGeometry args={[W, 4, D]} />
        <meshStandardMaterial
          color={MATTE.color}
          roughness={MATTE.roughness}
          metalness={MATTE.metalness}
          side={DoubleSide}
          clippingPlanes={clipPlanes}
          clipShadows
        />
        <Edges threshold={12}>
          <lineBasicMaterial color={COLOR.substrate} clippingPlanes={clipPlanes} transparent opacity={0.9} />
        </Edges>
      </mesh>

      {/* mounted front panel — a proud machined face on +Z */}
      <mesh position={[0, 0, D / 2 + 0.02]}>
        <boxGeometry args={[2.4, 3.4, 0.14]} />
        <meshStandardMaterial
          color={STRUCTURE.color}
          roughness={STRUCTURE.roughness}
          metalness={STRUCTURE.metalness}
          side={DoubleSide}
          clippingPlanes={clipPlanes}
        />
        <Edges threshold={12}>
          <lineBasicMaterial color={COLOR.substrate} clippingPlanes={clipPlanes} transparent opacity={0.7} />
        </Edges>
      </mesh>

      {/* the addressable module — highlights Prussian on annotation hover (F03) */}
      <mesh ref={componentRef} position={[-0.55, 0.75, D / 2 + 0.12]}>
        <boxGeometry args={[1.0, 0.82, 0.18]} />
        <meshStandardMaterial
          color={STRUCTURE.color}
          roughness={STRUCTURE.roughness}
          metalness={STRUCTURE.metalness}
          side={DoubleSide}
          clippingPlanes={clipPlanes}
        />
      </mesh>

      {/* base plinth — wider footprint, sits below the plane's travel so it is always whole */}
      <mesh position={[0, -2.35, 0]} receiveShadow>
        <boxGeometry args={[W + 0.6, 0.5, D + 0.6]} />
        <meshStandardMaterial
          color={MATTE.color}
          roughness={MATTE.roughness}
          metalness={MATTE.metalness}
          side={DoubleSide}
        />
        <Edges threshold={12}>
          <lineBasicMaterial color={COLOR.substrate} transparent opacity={0.9} />
        </Edges>
      </mesh>

      {/* the section-cut face — flat, unlit Fault poché, sized to the footprint */}
      <mesh ref={capRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, TOP, 0]} visible={false}>
        <planeGeometry args={[W, D]} />
        <meshBasicMaterial color={SECTION_FACE.color} side={DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}
