import { EASE } from '@/styles/tokens';

/**
 * Cubic-bézier easing as a plain function, so GSAP tweens use the EXACT same curves as CSS
 * transitions (both derive from tokens.ts) — no approximation with GSAP's named eases, no
 * plugin dependency. This is how "settle / exit / move" stay identical across Tier 1 (CSS)
 * and Tier 2 (GSAP).
 */

function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDerivX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveX = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const xEst = sampleX(t) - x;
      if (Math.abs(xEst) < 1e-6) return t;
      const d = sampleDerivX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= xEst / d;
    }
    // Bisection fallback
    let lo = 0;
    let hi = 1;
    t = x;
    while (lo < hi) {
      const xEst = sampleX(t);
      if (Math.abs(xEst - x) < 1e-6) return t;
      if (x > xEst) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return t;
  };

  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return sampleY(solveX(t));
  };
}

function parse(curve: string): (t: number) => number {
  const nums = curve.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
  const [x1, y1, x2, y2] = nums;
  return cubicBezier(x1 ?? 0, y1 ?? 0, x2 ?? 1, y2 ?? 1);
}

/** GSAP-compatible easing functions matching the CSS `--ease-*` tokens exactly. */
export const EASE_FN = {
  settle: parse(EASE.settle),
  exit: parse(EASE.exit),
  move: parse(EASE.move),
} as const;
