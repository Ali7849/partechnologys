/**
 * TOKEN GENERATOR — tokens.ts → tokens.css
 *
 * Run via `npm run build:tokens`. Emits a `:root` block of CSS custom properties so
 * CSS and GSAP consume the same values and cannot drift (ARCHITECTURE Part 3). The
 * output is committed and must never be hand-edited — a CI diff check guards this.
 *
 * This script is the ONLY place a token value crosses from TS into CSS.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  COLOR,
  COLOR_DERIVED,
  SHADOW_TEMP,
  GLASS,
  SPACE,
  RADIUS,
  TYPE,
  FONT,
  T,
  EASE,
  GRID,
  BREAKPOINT,
  type TypeScale,
} from '../src/styles/tokens';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/styles/tokens.css');

const lines: string[] = [];
const push = (s = '') => lines.push(s);

push('/**');
push(' * GENERATED FILE — do not edit by hand.');
push(' * Source: src/styles/tokens.ts · Generator: scripts/build-tokens.ts');
push(' * Regenerate with `npm run build:tokens`.');
push(' */');
push('');
push(':root {');

push('  /* colour — six values */');
for (const [name, hex] of Object.entries(COLOR)) push(`  --${name}: ${hex};`);
push('');
push('  /* colour — derived */');
for (const [name, hex] of Object.entries(COLOR_DERIVED)) push(`  --${name}: ${hex};`);
push('');
push('  /* elevation — the one permitted shadow (temporary elements only) */');
push(`  --shadow-temp: ${SHADOW_TEMP};`);
push('');
push('  /* curtain-wall glass */');
push(`  --glass-fill: ${GLASS.fill};`);
push(`  --glass-blur: ${GLASS.blur};`);
push(`  --glass-edge: ${GLASS.edge};`);
push(`  --glass-mullion: 1px solid var(--zinc-30);`);
push('');

push('  /* spacing — 8px module / 96px bay */');
for (const [name, val] of Object.entries(SPACE)) push(`  --${name}: ${val};`);
push('');

push('  /* radius — universal 2px */');
push(`  --radius: ${RADIUS};`);
push('');

push('  /* typography — families */');
for (const [name, val] of Object.entries(FONT)) push(`  --font-${name}: ${val};`);
push('');
push('  /* typography — per-scale tokens */');
for (const key of Object.keys(TYPE) as TypeScale[]) {
  const t = TYPE[key];
  push(`  --type-${key}-family: var(--font-${t.family});`);
  push(`  --type-${key}-size: ${t.size};`);
  push(`  --type-${key}-weight: ${t.weight};`);
  push(`  --type-${key}-tracking: ${t.tracking};`);
  push(`  --type-${key}-leading: ${t.lineHeight};`);
  if (t.measure) push(`  --type-${key}-measure: ${t.measure};`);
}
push('');

push('  /* motion — durations (ms for CSS) */');
for (const [name, seconds] of Object.entries(T)) push(`  --t-${name}: ${seconds * 1000}ms;`);
push('');
push('  /* motion — easings */');
for (const [name, curve] of Object.entries(EASE)) push(`  --ease-${name}: ${curve};`);
push('');

push('  /* grid */');
for (const [name, val] of Object.entries(GRID)) push(`  --grid-${name}: ${val};`);
push('');

push('  /* breakpoints (informational; media queries use literal values) */');
for (const [name, val] of Object.entries(BREAKPOINT)) push(`  --bp-${name}: ${val}px;`);

push('}');
push('');

const css = lines.join('\n');
writeFileSync(OUT, css, 'utf8');
// eslint-disable-next-line no-console
console.log(`✓ tokens.css written (${css.length} bytes) → ${OUT}`);
