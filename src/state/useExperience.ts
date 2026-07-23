import { create } from 'zustand';

/**
 * The experience store. Read OUTSIDE React's render cycle (`getState()`) from the shader's
 * useFrame loop and from pointer handlers, so the environment can react every frame without
 * ever forcing a re-render. Only `accent` is subscribed to by React (it changes rarely).
 */

type ExperienceState = {
  /** Hex accent of the pillar currently in view — the environment tints toward it. */
  accent: string;
  /** Normalised pointer, -1…1 on both axes, origin at viewport centre. */
  mouseX: number;
  mouseY: number;
  setAccent: (accent: string) => void;
  setMouse: (x: number, y: number) => void;
};

export const useExperience = create<ExperienceState>((set) => ({
  accent: '#7AA2F7',
  mouseX: 0,
  mouseY: 0,
  setAccent: (accent) => set({ accent }),
  setMouse: (mouseX, mouseY) => set({ mouseX, mouseY }),
}));
