/**
 * DESIGN TOKENS — the single authored source of truth.
 *
 * Derived exclusively from docs/01-design-system.md and docs/02-motion-system.md.
 * `src/styles/tokens.css` is GENERATED from this file by scripts/build-tokens.ts and
 * committed; the two cannot drift. No raw hex, px, duration, or cubic-bezier may exist
 * anywhere else in the codebase — this file is where every value is named.
 *
 * There are exactly SIX colours (plus derived values), one radius (2px), one spacing
 * scale (8px module / 96px bay), three typefaces, and five motion durations.
 */

// ─────────────────────────────────────────────────────────────────────────────
// COLOUR — six values, no more. Material, not mood. (Design System Part 1)
// ─────────────────────────────────────────────────────────────────────────────

export const COLOR = {
  cured: '#D9DCD6', // concrete under north light — primary surface
  vellum: '#EEEFEA', // drafting film — raised planes
  zinc: '#8D9599', // galvanized steel — metadata, hairlines
  substrate: '#101417', // unlit steel — text, dark sections (never pure black)
  prussian: '#16344E', // drafting ink — the ONLY chromatic accent
  fault: '#A83226', // stress indication — FAILURE ONLY (+ the 3D section-cut face)
} as const;

export const COLOR_DERIVED = {
  'substrate-90': '#1C2226', // raised dark surface
  'substrate-80': '#2A3136', // dark hairline
  'zinc-60': '#B3B9BB', // disabled text, faint rule
  'zinc-30': '#CFD3D2', // hairline on Cured
  'vellum-hair': '#E3E5E0', // hairline on Vellum
  'prussian-tint': '#E4E8EC', // selected row, active background
} as const;

// The one permitted shadow — temporary elements only (E4). Cool, single-direction.
export const SHADOW_TEMP =
  '0 24px 48px -12px rgba(16,20,23,0.18), 0 2px 6px -2px rgba(16,20,23,0.10)';

// Curtain-wall glass — permitted only on temporary / non-liable surfaces.
export const GLASS = {
  fill: 'rgba(217,220,214,0.72)',
  blur: '16px',
  edge: '1px solid rgba(255,255,255,0.5)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SPACING — 8px module, 96px bay. Nothing exists between steps. (Design System Part 3)
// ─────────────────────────────────────────────────────────────────────────────

export const SPACE = {
  'm-05': '4px',
  'm-1': '8px',
  'm-2': '16px',
  'm-3': '24px',
  'm-4': '32px',
  'm-6': '48px',
  'm-8': '64px',
  bay: '96px',
  'bay-15': '144px',
  'bay-2': '192px',
  'bay-3': '288px',
  'bay-4': '384px',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// RADIUS — 2px, universal, no exceptions. The machined edge-break.
// ─────────────────────────────────────────────────────────────────────────────

export const RADIUS = '2px' as const;

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY — three faces, eleven steps. (Design System Part 2)
// ─────────────────────────────────────────────────────────────────────────────

export const FONT = {
  display: 'var(--font-archivo)', // Archivo — structural / display
  body: 'var(--font-source-serif)', // Source Serif 4 — record / body
  mono: 'var(--font-plex-mono)', // IBM Plex Mono — instrument / data
} as const;

export type TypeScale =
  | 'd1'
  | 'd2'
  | 'd3'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'b1'
  | 'b2'
  | 'b3'
  | 'm1'
  | 'm2'
  | 'm3';

type TypeStep = {
  family: keyof typeof FONT;
  size: string;
  weight: number;
  tracking: string;
  lineHeight: string;
  measure?: string;
  uppercase?: boolean;
};

export const TYPE: Record<TypeScale, TypeStep> = {
  d1: { family: 'display', size: 'clamp(4.5rem, 9vw, 9rem)', weight: 500, tracking: '-0.03em', lineHeight: '0.92' },
  d2: { family: 'display', size: 'clamp(3rem, 6vw, 5.5rem)', weight: 500, tracking: '-0.025em', lineHeight: '0.96' },
  d3: { family: 'display', size: 'clamp(2.25rem, 4vw, 3.5rem)', weight: 500, tracking: '-0.02em', lineHeight: '1.04' },
  h1: { family: 'display', size: '2rem', weight: 500, tracking: '-0.015em', lineHeight: '1.15' },
  h2: { family: 'display', size: '1.5rem', weight: 500, tracking: '-0.01em', lineHeight: '1.25' },
  h3: { family: 'display', size: '1.25rem', weight: 600, tracking: '0', lineHeight: '1.35' },
  b1: { family: 'body', size: '1.125rem', weight: 400, tracking: '0', lineHeight: '1.65', measure: '68ch' },
  b2: { family: 'body', size: '1rem', weight: 400, tracking: '0', lineHeight: '1.7', measure: '72ch' },
  b3: { family: 'body', size: '0.9375rem', weight: 400, tracking: '0', lineHeight: '1.65', measure: '76ch' },
  m1: { family: 'mono', size: '0.875rem', weight: 450, tracking: '0.02em', lineHeight: '1.5' },
  m2: { family: 'mono', size: '0.75rem', weight: 500, tracking: '0.06em', lineHeight: '1.4', uppercase: true },
  m3: { family: 'mono', size: '0.6875rem', weight: 500, tracking: '0.1em', lineHeight: '1.4', uppercase: true },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOTION — nothing exceeds 640ms. No overshoot ever. (Motion System Parts 1–2)
// Durations are authored in SECONDS for GSAP; the generator emits ms for CSS.
// ─────────────────────────────────────────────────────────────────────────────

export const T = {
  instant: 0.08,
  quick: 0.16,
  standard: 0.24,
  considered: 0.4,
  structural: 0.64,
} as const;

export const EASE = {
  settle: 'cubic-bezier(0.16, 0.84, 0.24, 1)', // entrances — fast start, long settle
  exit: 'cubic-bezier(0.4, 0, 1, 1)', // exits — accelerate away
  move: 'cubic-bezier(0.4, 0, 0.2, 1)', // position changes within view
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// GRID + BREAKPOINTS — 12 col, 24px gutter, 64px rails. (Design System Part 3)
// ─────────────────────────────────────────────────────────────────────────────

export const GRID = {
  columns: '12',
  gutter: '24px',
  content: '1440px',
  full: '1680px',
  rail: '64px',
  'rail-mobile': '32px',
} as const;

export const BREAKPOINT = {
  site: 1680,
  desk: 1280,
  tablet: 900,
  mobile: 600,
} as const;

export type BreakpointName = keyof typeof BREAKPOINT;
