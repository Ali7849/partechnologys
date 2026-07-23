import { COLOR, COLOR_DERIVED } from '@/styles/tokens';

/**
 * The material library. Everything is matte — no chrome, iridescence, glass refraction,
 * subsurface scattering, emissive, gloss (Design System Part 6). No material exceeds
 * metalness 0.15. The one intentional exception in the whole system is the section-cut
 * face, which is flat unlit Fault (a section cut IS the material being broken open).
 */

export const MATTE = {
  color: COLOR.vellum,
  roughness: 0.85,
  metalness: 0,
} as const;

export const STRUCTURE = {
  color: COLOR_DERIVED['zinc-30'],
  roughness: 0.7,
  metalness: 0.15,
} as const;

export const WIREFRAME = {
  color: COLOR.prussian,
} as const;

// The one unlit colour in the system — the section-cut face.
export const SECTION_FACE = {
  color: COLOR.fault,
} as const;

export const HIGHLIGHT = {
  color: COLOR.prussian,
  roughness: 0.6,
  metalness: 0.1,
} as const;
