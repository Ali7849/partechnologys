import { Edges } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type ReactNode, type RefObject } from 'react';
import {
  AlwaysStencilFunc,
  BackSide,
  BoxGeometry,
  Color,
  CylinderGeometry,
  DecrementWrapStencilOp,
  DoubleSide,
  FrontSide,
  IncrementWrapStencilOp,
  MeshBasicMaterial,
  NotEqualStencilFunc,
  Plane,
  PlaneGeometry,
  ReplaceStencilOp,
  Vector3,
  type BufferGeometry,
  type Mesh,
  type MeshStandardMaterial,
  type WebGLRenderer,
} from 'three';

import { requestRender } from '@/motion/ticker';
import { useSceneStore } from '@/state/useSceneStore';
import { COLOR } from '@/styles/tokens';

import { HIGHLIGHT, MATTE, SECTION_FACE, STRUCTURE } from '../materials/materials';

/**
 * PLACEHOLDER SUBJECT — a visibly generic but *engineered* instrument standing in for the real
 * system (Data Contract D1, blocked): a hollow machined enclosure on a base plinth, housing
 * internal components. Not a claimed product — an abstract precision object the sheet sections.
 *
 * THE SECTION CUT is a real stencil-buffered cross-section, not a flat plane. For every solid
 * the plane passes through, back faces increment and front faces decrement the stencil buffer;
 * a Fault-coloured cap quad then fills only where the buffer is non-zero — i.e. exactly the
 * material interior, at any camera angle. The plane descends through walls and components,
 * opening the enclosure into a true cutaway with unlit Fault poché on every cut face. This is
 * the one deliberate unlit colour in the system (a section IS the material broken open).
 *
 * Clip height is driven by scrollProgress inside useFrame (Tier 3, never a GSAP tween). The
 * base plinth sits below the plane's travel, so the object always reads as resting on the sheet.
 */

// Body spans y ∈ [-2, +2]; the plane travels from the top down to just above the plinth floor.
const TOP = 2.0;
const END = -0.9;
const RANGE = TOP - END;

const STRUCTURE_COLOR = new Color(STRUCTURE.color);
const HIGHLIGHT_COLOR = new Color(HIGHLIGHT.color);

type StencilMats = { back: MeshBasicMaterial; front: MeshBasicMaterial; cap: MeshBasicMaterial };

/**
 * One sectionable solid: two invisible stencil passes (back +1 / front −1, both clipped) plus
 * the visible clipped surface. All three share one geometry and transform.
 */
function SectionPart({
  geometry,
  position,
  color,
  roughness,
  metalness,
  mats,
  clipPlanes,
  visibleRef,
  children,
}: {
  geometry: BufferGeometry;
  position: [number, number, number];
  color: string;
  roughness: number;
  metalness: number;
  mats: StencilMats;
  clipPlanes: Plane[];
  visibleRef?: RefObject<Mesh | null>;
  children?: ReactNode;
}) {
  return (
    <group position={position}>
      <mesh geometry={geometry} material={mats.back} renderOrder={1} />
      <mesh geometry={geometry} material={mats.front} renderOrder={1} />
      <mesh geometry={geometry} renderOrder={3} ref={visibleRef ?? null}>
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          side={DoubleSide}
          clippingPlanes={clipPlanes}
          clipShadows
        />
        {children}
      </mesh>
    </group>
  );
}

export function PlaceholderSubject() {
  const clipPlane = useMemo(() => new Plane(new Vector3(0, -1, 0), TOP), []);
  const clipPlanes = useMemo(() => [clipPlane], [clipPlane]);
  const capRef = useRef<Mesh>(null);
  const componentRef = useRef<Mesh>(null);
  const lastClip = useRef(TOP);
  const lastHovered = useRef<string | null>(null);

  // Shared stencil materials — one back/front pair drives every sectioned solid, plus the cap.
  const mats = useMemo<StencilMats>(() => {
    const base = new MeshBasicMaterial();
    base.depthWrite = false;
    base.depthTest = false;
    base.colorWrite = false;
    base.stencilWrite = true;
    base.stencilFunc = AlwaysStencilFunc;

    const back = base.clone();
    back.side = BackSide;
    back.clippingPlanes = [clipPlane];
    back.stencilFail = IncrementWrapStencilOp;
    back.stencilZFail = IncrementWrapStencilOp;
    back.stencilZPass = IncrementWrapStencilOp;

    const front = base.clone();
    front.side = FrontSide;
    front.clippingPlanes = [clipPlane];
    front.stencilFail = DecrementWrapStencilOp;
    front.stencilZFail = DecrementWrapStencilOp;
    front.stencilZPass = DecrementWrapStencilOp;

    const cap = new MeshBasicMaterial({ color: SECTION_FACE.color });
    cap.toneMapped = false;
    cap.stencilWrite = true;
    cap.stencilRef = 0;
    cap.stencilFunc = NotEqualStencilFunc;
    cap.stencilFail = ReplaceStencilOp;
    cap.stencilZFail = ReplaceStencilOp;
    cap.stencilZPass = ReplaceStencilOp;

    return { back, front, cap };
  }, [clipPlane]);

  // Geometries — created once. Enclosure walls (inset so they don't overlap at corners) and
  // three internal components the descending plane slices through.
  const geo = useMemo(
    () => ({
      wallFrontBack: new BoxGeometry(3.4, 4, 0.2),
      wallSide: new BoxGeometry(0.2, 4, 2.2),
      compTall: new BoxGeometry(0.9, 2.8, 0.9),
      compCyl: new CylinderGeometry(0.45, 0.45, 2.4, 28),
      compBlock: new BoxGeometry(1.1, 1.3, 1.4),
      cap: new PlaneGeometry(12, 12),
      floor: new BoxGeometry(3.0, 0.24, 2.0),
      plinth: new BoxGeometry(4.0, 0.5, 3.2),
    }),
    [],
  );

  // Binds the clip height (and the Fault cap position/visibility) to scroll progress; redraws
  // only while it moves. Also applies the F03 hover highlight from the store (no raycast).
  useFrame(() => {
    const { scrollProgress: progress, hoveredId } = useSceneStore.getState();

    const clipY = TOP - progress * RANGE;
    if (Math.abs(clipY - lastClip.current) > 0.0005) {
      clipPlane.constant = clipY;
      lastClip.current = clipY;
      const cap = capRef.current;
      if (cap) {
        cap.position.y = clipY;
        cap.visible = progress > 0.01 && progress < 0.999;
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

  const wall = { color: MATTE.color, roughness: MATTE.roughness, metalness: MATTE.metalness };
  const comp = {
    color: STRUCTURE.color,
    roughness: STRUCTURE.roughness,
    metalness: STRUCTURE.metalness,
  };

  return (
    <group>
      {/* enclosure walls — hollow, so the descending plane opens a true cutaway */}
      <SectionPart geometry={geo.wallFrontBack} position={[0, 0, 1.2]} mats={mats} clipPlanes={clipPlanes} {...wall}>
        <Edges threshold={12}>
          <lineBasicMaterial color={COLOR.substrate} clippingPlanes={clipPlanes} transparent opacity={0.9} />
        </Edges>
      </SectionPart>
      <SectionPart geometry={geo.wallFrontBack} position={[0, 0, -1.2]} mats={mats} clipPlanes={clipPlanes} {...wall} />
      <SectionPart geometry={geo.wallSide} position={[1.6, 0, 0]} mats={mats} clipPlanes={clipPlanes} {...wall} />
      <SectionPart geometry={geo.wallSide} position={[-1.6, 0, 0]} mats={mats} clipPlanes={clipPlanes} {...wall} />

      {/* internal components — sliced open as the plane passes through them */}
      <SectionPart
        geometry={geo.compTall}
        position={[-0.7, -0.5, 0.35]}
        mats={mats}
        clipPlanes={clipPlanes}
        visibleRef={componentRef}
        {...comp}
      />
      <SectionPart geometry={geo.compCyl} position={[0.8, -0.7, -0.35]} mats={mats} clipPlanes={clipPlanes} {...comp} />
      <SectionPart geometry={geo.compBlock} position={[0.55, -1.15, 0.45]} mats={mats} clipPlanes={clipPlanes} {...comp} />

      {/* the Fault section cap — fills only where the stencil buffer is non-zero (the interior) */}
      <mesh
        ref={capRef}
        geometry={geo.cap}
        material={mats.cap}
        renderOrder={2}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, TOP, 0]}
        visible={false}
        onAfterRender={(gl: WebGLRenderer) => gl.clearStencil()}
      />

      {/* enclosure floor — inside, near the base; below the plane's travel so it stays whole */}
      <mesh geometry={geo.floor} position={[0, -1.85, 0]}>
        <meshStandardMaterial
          color={STRUCTURE.color}
          roughness={STRUCTURE.roughness}
          metalness={STRUCTURE.metalness}
          side={DoubleSide}
        />
      </mesh>

      {/* base plinth — wider footprint, always whole; the object rests on the sheet */}
      <mesh geometry={geo.plinth} position={[0, -2.35, 0]} receiveShadow>
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
    </group>
  );
}
