import { CatmullRomCurve3, Vector3 } from 'three';

import { COMMISSION_EMAIL, PILLARS } from '@/features/homepage/content/pillars';

/**
 * THE JOURNEY — not sections, scenes.
 *
 * The camera flies one continuous Catmull-Rom spline through the world, orbiting and dollying
 * around the core at the origin. Each scene is a waypoint on that spline with content that
 * emerges as the camera arrives and dissolves as it leaves. There is no page structure: scroll
 * is simply position along this path.
 */

export type Scene = {
  id: string;
  kind: 'open' | 'pillar' | 'close';
  eyebrow: string;
  title: string;
  lead: string;
  accent: string;
  /** Capability list — only pillar scenes carry one. */
  capabilities: string[];
};

export const SCENES: Scene[] = [
  {
    id: 'origin',
    kind: 'open',
    eyebrow: 'PAR // TECHNOLOGYS',
    title: 'We build the systems\nother companies are built on.',
    lead: 'Intelligence, software, infrastructure — engineered end to end. This experience is the proof.',
    accent: '#7AA2F7',
    capabilities: [],
  },
  ...PILLARS.map<Scene>((p) => ({
    id: p.id,
    kind: 'pillar',
    eyebrow: p.index,
    title: p.title,
    lead: p.lead,
    accent: p.accent,
    capabilities: p.capabilities,
  })),
  {
    id: 'commission',
    kind: 'close',
    eyebrow: 'COMMISSION',
    title: 'If we built this for ourselves,\nimagine what we build for you.',
    lead: COMMISSION_EMAIL,
    accent: '#7AA2F7',
    capabilities: [],
  },
];

/**
 * Camera waypoints — a descending orbit that spirals around the core, pulling back for the
 * opening, sweeping wide through the pillars, and dollying in close at the end.
 */
const WAYPOINTS: [number, number, number][] = [
  [0, 0.8, 10.5], // origin — wide, head-on
  [7.2, 2.2, 7.4], // intelligence
  [9.6, -0.6, 0.8], // software
  [6.4, 3.0, -6.2], // transform
  [0.4, 0.9, -9.8], // experiences
  [-6.6, -2.2, -6.4], // cloud
  [-9.4, 1.6, 0.6], // data
  [-6.0, -0.8, 6.8], // growth
  [0, 0.2, 5.2], // commission — dolly in close
];

export const CAMERA_PATH = new CatmullRomCurve3(
  WAYPOINTS.map(([x, y, z]) => new Vector3(x, y, z)),
  false,
  'catmullrom',
  0.4,
);

/** Where the camera looks — drifts slightly so the core is never dead-centre and static. */
export const LOOK_TARGETS: [number, number, number][] = [
  [0, 0, 0],
  [0, 0.3, 0],
  [0, -0.2, 0],
  [0, 0.4, 0],
  [0, 0, 0],
  [0, -0.3, 0],
  [0, 0.2, 0],
  [0, 0, 0],
  [0, 0, 0],
];

export const SCENE_COUNT = SCENES.length;

/**
 * The two scene accents the camera is currently between, and how far between them it is —
 * so the whole environment can bleed from one world's colour into the next continuously.
 */
export function accentAt(progress: number): { from: string; to: string; blend: number } {
  const t = Math.min(1, Math.max(0, progress)) * (SCENE_COUNT - 1);
  const i = Math.min(SCENE_COUNT - 2, Math.floor(t));
  const from = SCENES[i]?.accent ?? '#7AA2F7';
  const to = SCENES[i + 1]?.accent ?? from;
  return { from, to, blend: t - i };
}
