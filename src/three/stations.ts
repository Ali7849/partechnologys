import type { StationId } from '@/types/scene';

/**
 * The five camera stations. The camera has stations, not freedom (Motion System Part 4):
 * a drawing sheet contains Plan, Elevation, Section, Isometric — not a camera path. The
 * camera only ever moves between these named views, via GSAP, never freely or on idle.
 *
 * The projection is orthographic (axonometric) — parallel lines stay parallel, so a
 * dimension at the back equals the same dimension at the front. Perspective is forbidden
 * outside a photographic sequence.
 */

export type Station = {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
};

// ISO direction (1,1,1) gives true isometric elevation 35.264°.
export const STATIONS: Record<StationId, Station> = {
  iso: { position: [11.5, 11.5, 11.5], target: [0, 0, 0], zoom: 46 },
  plan: { position: [0.001, 20, 0.001], target: [0, 0, 0], zoom: 42 },
  elevation: { position: [0, 2.5, 20], target: [0, 0, 0], zoom: 46 },
  section: { position: [9, 5.5, 15], target: [0, -0.2, 0], zoom: 52 },
  detail: { position: [7, 4, 7], target: [1, 0, 0], zoom: 82 },
};
