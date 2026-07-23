import { create } from 'zustand';

import type { Capability, FrameId, StationId } from '@/types/scene';

/**
 * The one cross-cutting store (BUILD_SPEC Decision #010 — Zustand).
 *
 * Chosen over React Context because it is readable OUTSIDE React's render cycle
 * (`useSceneStore.getState()`), which the GSAP ticker and R3F `useFrame` loops require
 * without forcing a re-render every animation frame. Two reconciler trees (DOM + R3F),
 * one source of truth. ~1KB.
 */

type SceneState = {
  station: StationId;
  scrollProgress: number; // 0–1, lerped, written by the ticker
  capability: Capability;
  soundEnabled: boolean;
  hoveredId: string | null; // annotation ↔ 3D component link (F03)
  activeFrame: FrameId;
  lightIntensity: number; // sun intensity target — only intensity ever animates (1.0 ↔ 0.7)

  setStation: (station: StationId) => void;
  setScrollProgress: (value: number) => void;
  setCapability: (capability: Capability) => void;
  toggleSound: () => void;
  setHoveredId: (id: string | null) => void;
  setActiveFrame: (frame: FrameId) => void;
  setLightIntensity: (value: number) => void;
};

export const useSceneStore = create<SceneState>((set) => ({
  station: 'iso',
  scrollProgress: 0,
  capability: 1,
  soundEnabled: false,
  hoveredId: null,
  activeFrame: 'F01',
  lightIntensity: 1,

  setStation: (station) => set({ station }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setCapability: (capability) => set({ capability }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setHoveredId: (hoveredId) => set({ hoveredId }),
  setActiveFrame: (activeFrame) => set({ activeFrame }),
  setLightIntensity: (lightIntensity) => set({ lightIntensity }),
}));
