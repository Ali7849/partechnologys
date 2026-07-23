import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The single animation clock. GSAP's own ticker IS the one and only rAF loop in the
 * application (ARCHITECTURE Part 3) — ScrollTrigger registers against it by default, so
 * no frame ever creates a second requestAnimationFrame or a scroll event listener.
 *
 * `ensureGsap()` is idempotent and safe to call from any client component on mount.
 */

let registered = false;

export function ensureGsap(): void {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  // A locked default: ScrollTrigger reads scroll via its own rAF-batched sampler, never
  // an addEventListener('scroll') — this satisfies the motion system's hard prohibition.
  registered = true;
}

/**
 * Render-request bus. With `frameloop="demand"` the R3F canvas only redraws when asked.
 * The Stage registers its `invalidate` here on mount; scroll-driven code calls
 * `requestRender()` to schedule exactly one frame. A locked, unchanged scene costs zero GPU.
 */
let renderRequester: (() => void) | null = null;

export function setRenderRequester(fn: (() => void) | null): void {
  renderRequester = fn;
}

export function requestRender(): void {
  renderRequester?.();
}

/**
 * Frame-rate-independent lerp. Interpolates the ANIMATED VALUE toward its target at a
 * fixed time-based rate — this is the architecture's replacement for Lenis: the page's
 * scroll stays native and instant; only the value we choose to smooth (the section-cut
 * uniform) is eased.
 *
 * @param current  present value
 * @param target   desired value
 * @param rate     approach rate per second (higher = snappier)
 * @param dt       delta time in seconds
 */
export function damp(current: number, target: number, rate: number, dt: number): number {
  return target + (current - target) * Math.exp(-rate * dt);
}

export { gsap, ScrollTrigger };
