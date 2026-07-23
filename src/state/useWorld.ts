import { create } from 'zustand';

import type { WorldVariant } from '@/world/scenes';

/**
 * The world store. Everything that changes per-frame (scroll position along the camera path,
 * pointer parallax) is read OUTSIDE React via `getState()` inside useFrame, so the camera and
 * environment update at 60fps without ever re-rendering the tree.
 *
 * `progress` is 0→1 across the ENTIRE journey, not per section — there are no sections. It is
 * the camera's position along the spline through the world.
 */

type WorldState = {
  /** 0→1 along the whole camera path. */
  progress: number;
  /** Normalised pointer, -1…1, origin at viewport centre. */
  mouseX: number;
  mouseY: number;
  /** True once the intro has settled and scroll takes over the camera. */
  entered: boolean;
  /**
   * Adaptive quality, 0.35–1. Driven by measured framerate: the starfield thins its draw
   * range and the renderer lowers pixel ratio as this falls, and both recover when headroom
   * returns. Never read during render — only inside useFrame — so it costs no re-renders.
   */
  quality: number;
  /** Which preserved concept is being viewed — see WorldVariant. */
  variant: WorldVariant;
  setProgress: (p: number) => void;
  setMouse: (x: number, y: number) => void;
  setEntered: (v: boolean) => void;
  setQuality: (q: number) => void;
  setVariant: (v: WorldVariant) => void;
};

export const useWorld = create<WorldState>((set) => ({
  progress: 0,
  mouseX: 0,
  mouseY: 0,
  entered: false,
  quality: 1,
  variant: 'fragment-journey',
  setProgress: (progress) => set({ progress }),
  setMouse: (mouseX, mouseY) => set({ mouseX, mouseY }),
  setEntered: (entered) => set({ entered }),
  setQuality: (quality) => set({ quality }),
  setVariant: (variant) => set({ variant }),
}));
