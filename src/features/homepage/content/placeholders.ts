/**
 * BLOCKED CONTENT — placeholder data for the five Data Contracts (BUILD_SPEC Appendix).
 *
 * Every value here is UNMISTAKABLY FAKE by design. Per CLAUDE.md's standing rule, a
 * fabricated specific (a plausible-looking metric, client name, refusal, or price) is worse
 * than an honest gap on a site whose entire argument is that the numbers can be checked.
 * So nothing here reads as real: values say "PENDING", numbers are em-dashes.
 *
 * When real project material arrives, replace the values in this ONE file — the frames need
 * no structural change (that is the point of the data contracts).
 *
 * ⚠ F03 / F04 / F05 must NOT be merged to main while consuming this file.
 */

import type { StationId } from '@/types/scene';

// ── D1 · Subject ────────────────────────────────────────────────────────────
export type Subject = {
  id: string;
  name: string;
  commissionedYear: string;
  status: string;
  scale: number;
  dimensions: { x: number; y: number; z: number };
};

export const SUBJECT: Subject = {
  id: 'subject-pending',
  name: 'SYSTEM PENDING',
  commissionedYear: '—————',
  status: 'AWAITING SUBJECT',
  scale: 1,
  dimensions: { x: 4, y: 3, z: 4 },
};

// ── D2 · Annotations (F03) — max 6 ──────────────────────────────────────────
export type Annotation = {
  id: string;
  label: string;
  value: string;
  componentId: string;
};

export const ANNOTATIONS: Annotation[] = [
  { id: 'a1', label: 'COMPONENT PENDING', value: 'METRIC PENDING', componentId: 'c1' },
  { id: 'a2', label: 'COMPONENT PENDING', value: 'METRIC PENDING', componentId: 'c2' },
  { id: 'a3', label: 'COMPONENT PENDING', value: 'METRIC PENDING', componentId: 'c3' },
  { id: 'a4', label: 'COMMISSIONED', value: 'YEAR PENDING · IN SERVICE', componentId: 'c4' },
];

export const F03_BODY =
  'This copy is a placeholder. The real sentence describes the inside of a real system that has been running a real operation — pending subject material.';

// ── D3 · Tolerances (F04) — exactly 4, in order ─────────────────────────────
export type Tolerance = { label: string; value: string };

export const TOLERANCES: Tolerance[] = [
  { label: 'Peak throughput', value: 'PENDING' },
  { label: 'First failure mode', value: 'PENDING' },
  { label: 'What we did not build', value: 'PENDING' },
  {
    label: 'What we refused',
    value: 'REFUSAL PENDING — requires a real thing a real client asked for and was declined.',
  },
];

// ── D4 · Node field (F05) ───────────────────────────────────────────────────
export type Node = {
  id: string;
  type: 'par-system' | 'pontis-site';
  position: [number, number, number];
  isSubject: boolean;
};

// Synthetic field — a jittered isometric scatter generated for layout proving only, NOT real
// deployments. Real counts and positions are blocked (D4). Deterministic (no random/Date) so
// the server and client render identically — the hidden SR list is SSR'd from this same array.
const NODE_COUNT = 48;
const NODE_COLS = 8;

export const NODES: Node[] = Array.from({ length: NODE_COUNT }, (_, i) => {
  // Deterministic pseudo-random in [0,1) from the index — stable across server/client.
  const rand = (seed: number) => {
    const x = Math.sin((i + 1) * seed) * 43758.5453;
    return x - Math.floor(x);
  };
  const gx = (i % NODE_COLS) - (NODE_COLS - 1) / 2;
  const gz = Math.floor(i / NODE_COLS) - Math.floor(NODE_COUNT / NODE_COLS) / 2;
  const x = gx * 1.7 + (rand(12.9898) - 0.5) * 1.0;
  const z = gz * 1.7 + (rand(78.233) - 0.5) * 1.0;
  return {
    id: `node-${i}`,
    type: rand(3.317) > 0.62 ? 'pontis-site' : 'par-system',
    position: [x, 0, z] as [number, number, number],
    isSubject: i === 27, // one node, near the centre, is the subject seen in F01–F04
  };
});

export const NODE_LEGEND = {
  subjectName: 'SYSTEM PENDING',
  parSystems: '—',
  pontisSites: '—',
  synthetic: true,
};

// ── D5 · Terms and refusals (F06) ───────────────────────────────────────────
// The bullets and refusals below are the brand's ACTUAL stated positions (from the strategy
// doc) and are safe to show. Only the engagement floor NUMBER is a blocked commercial
// commitment and reads as PENDING.
export const TERMS = {
  engagementFloor: 'FLOOR PENDING',
  bullets: [
    'Senior engineers only. No junior team, no bench.',
    'Documented so completely that our absence costs you nothing.',
  ],
};

export const REFUSALS: string[] = [
  'Consumer apps.',
  'Marketing sites.',
  'Equity-only work.',
  'Anything whose first question is price.',
  'Anything that needs to be finished in three weeks.',
];

// ── F07 · Commission address (present in the wireframe — not blocked) ────────
export const COMMISSION_EMAIL = 'commission@partechnologys.com';

// Convenience: the F01 subject metadata line.
export const SUBJECT_LINE = `SUBJECT — ${SUBJECT.name} · COMMISSIONED ${SUBJECT.commissionedYear} · ${SUBJECT.status}`;

// The station each frame settles the camera at (documented in the storyboard/wireframe).
export const FRAME_STATION: Record<string, StationId> = {
  F01: 'iso',
  F02: 'iso',
  F03: 'section',
  F04: 'section',
  F05: 'plan',
  F06: 'iso',
  F07: 'iso',
};
