# PAR TECHNOLOGYS
## Implementation Plan — For Claude Code

```
REV 1.0 · ISSUED 2026-07 · IMPLEMENTATION
```

---

# STEP 0 — REPOSITORY SETUP

Run these in Claude Code, in order:

```bash
# 1. Clone
git clone https://github.com/ArsalanPARTECH/partechnologys.git
cd partechnologys

# 2. Create working branch — main stays untouched
git checkout -b dev/homepage-foundation

# 3. Verify
git branch
# should show: * dev/homepage-foundation
#                main
```

**Branch strategy for the full build:**

```
main                                    NEVER touched directly
 └─ dev/homepage-foundation             base setup, tokens, primitives
     └─ feat/f01-sheet                  Beat 1 — The Sheet
     └─ feat/f02-descent               Beat 2 — The Descent
     └─ feat/f03-inside                Beat 3 — Inside
     └─ feat/f04-tolerances            Beat 4 — The Tolerances
     └─ feat/f05-turn                  Beat 5 — The Turn
     └─ feat/f06-return                Beat 6 — The Return
     └─ feat/f07-title-block           Beat 7 — Conversion
```

Each `feat/*` branch is created FROM `dev/homepage-foundation`, merged back into it
after approval, then deleted. When the full homepage is approved, `dev/homepage-foundation`
merges into `main` as a single squashed PR.

---

# BUILD SEQUENCE — 12 FEATURES, ONE AT A TIME

Each feature below is a single branch, a single approval, a single merge.
**Never skip ahead. Never build two at once.**

## Feature 01 · PROJECT SCAFFOLD
**Branch:** `dev/homepage-foundation`
**What:** Next.js 15 + TypeScript strict + App Router + folder structure + ESLint +
custom rules (no raw values) + CSS tokens + fonts + empty root layout
**Deliverable:** `npm run dev` shows a blank Cured page with correct fonts loaded.
Nothing else.
**Why first:** every subsequent feature imports from this. Getting it wrong means
rebuilding everything.

## Feature 02 · DESIGN TOKENS + PRIMITIVES
**Branch:** `dev/homepage-foundation` (same branch, before first feat split)
**What:** `tokens.ts` + generated `tokens.css` + `Text` + `Rule` + `Button` + `Plate` +
`Field` primitives. Each with CSS Module. Each responsive. Each accessible.
**Deliverable:** a `/dev` route (removed before production) showing every primitive
at every scale, on Cured and Substrate.
**Why second:** primitives are the atoms. Frames compose them.

## Feature 03 · NAVIGATION + RAIL + TITLE BLOCK
**Branch:** `feat/navigation-system`
**What:** persistent nav, annotation rail, footer title block with revision stamp.
The frame that does not change between routes.
**Deliverable:** nav + rail + footer visible on the blank page, responsive to mobile,
keyboard-navigable, glass transition on scroll.

## Feature 04 · MOTION INFRASTRUCTURE
**Branch:** `feat/motion-infra`
**What:** `ticker.ts` (single rAF), `tokens.ts` motion values, `useScrollProgress`,
`useReveal`, `useCapability` (degradation ladder), GSAP installed, lint rules for
raw durations. No visible change on the page — pure infrastructure.
**Deliverable:** capability level logged to console. Scroll progress readable.
All four degradation levels testable via query param `?motion=1|2|3|4`.

## Feature 05 · 3D STAGE
**Branch:** `feat/three-stage`
**What:** `Stage.tsx` canvas with `frameloop="demand"`, sun lighting, camera stations,
`useStation` hook, placeholder geometry (a cube — the real subject is blocked).
Static axonometric SVG fallback for levels 3–4.
**Deliverable:** a cube at Station 01, matte material, one light, no idle render.
Station transitions testable via keyboard (1–5). SVG fallback at `?motion=3`.

## Feature 06 · F01 — THE SHEET
**Branch:** `feat/f01-sheet`
**What:** First frame. Load sequence: title block → rail → nav → plotter headline →
object wireframe→solid → hold → scroll cue. Full orchestration.
**Deliverable:** the opening shot, production-ready.

## Feature 07 · F02 — THE DESCENT
**Branch:** `feat/f02-descent`
**What:** Section plane, scroll-scrubbed, clipping shader, Z-readout,
relay tick sound (gated by sound toggle). The page's entire scrub budget.
**Deliverable:** scroll lowers the plane through the object. Fully reversible.
Native scroll feel.

## Feature 08 · F03 — INSIDE
**Branch:** `feat/f03-inside`
**What:** Camera Station 01→04, annotations with leader lines, bidirectional
hover between annotation and 3D component, body copy.
**Deliverable:** the evidence frame, with real or placeholder data.

## Feature 09 · F04 — THE TOLERANCES
**Branch:** `feat/f04-tolerances`
**What:** Substrate ground transition, spec sheet layout, silence (sound cut).
**Deliverable:** the trust frame. No interactions, no CTA — deliberate.

## Feature 10 · F05 — THE TURN
**Branch:** `feat/f05-turn`
**What:** Camera 04→02, frame expansion, node field (instanced), sub-bass swell,
legend. The IMAX moment.
**Deliverable:** the recontextualisation, with real or placeholder node data.

## Feature 11 · F06 — THE RETURN
**Branch:** `feat/f06-return`
**What:** Camera 02→01, frame contraction, object reassembly, terms + refusals,
asymmetric layout.
**Deliverable:** the confidence frame.

## Feature 12 · F07 — TITLE BLOCK + CONVERSION
**Branch:** `feat/f07-title-block`
**What:** Final frame. Repeated headline, commission button, email, footer.
All motion stopped. All rAF terminated. Zero main-thread activity at rest.
**Deliverable:** the resolution. Homepage complete.

---

# APPROVAL PROTOCOL — AFTER EVERY FEATURE

Before moving to the next feature, report:

```
## Feature [##] — [Name] · Complete

### Files changed
- path/to/file.tsx — [why]

### Git
- Branch: feat/[name]
- Commit: feat([scope]): [message]

### Testing checklist
□ TypeScript strict, zero errors
□ ESLint clean, no raw values
□ Responsive: 1680, 1280, 900, 600
□ Keyboard navigation complete
□ Screen reader tested (VoiceOver + NVDA)
□ prefers-reduced-motion honoured
□ Lighthouse: Performance > 95, Accessibility 100
□ Bundle size within budget
□ Visually reviewed on a real phone

### Potential improvements
- [what could be better, deferred to avoid scope creep]
```

**I approve or request changes. Only after approval does the next feature begin.**

---

# WHAT TO PASTE INTO CLAUDE CODE

Copy this prompt to start the first session:

```
We are building the PAR Technologys homepage.

Clone: https://github.com/ArsalanPARTECH/partechnologys.git
Branch: dev/homepage-foundation (never touch main)

Start with Feature 01: Project Scaffold.

Stack: Next.js 15, TypeScript strict, App Router, CSS Modules, no CSS framework.
No Lenis. No Framer Motion. GSAP is the only JS animation library.

Design tokens (from the design system):
  Colours: Cured #D9DCD6, Vellum #EEEFEA, Zinc #8D9599,
           Substrate #101417, Prussian #16344E, Fault #A83226
  Radius: 2px everywhere
  Spacing: 8px base module, 96px bay
  Fonts: Archivo (variable, display), Source Serif 4 (body),
         IBM Plex Mono (instrument/data)
  Type scale: D1 clamp(4.5rem,9vw,9rem) through M3 0.6875rem

Deliverable: npm run dev shows a blank Cured (#D9DCD6) page with
all three fonts loaded and correct. Nothing else.

After completion, report: files changed, why, commit message,
testing checklist, potential improvements.

Do not proceed to Feature 02 without my approval.
```

---

# REFERENCE DOCUMENTS

These govern every decision in Claude Code:

```
01-strategy/
  02-brand-strategy.md          values, voice, positioning
  03-information-architecture.md sitemap, navigation, footer

02-design-system/
  01-design-system.md           colours, type, spacing, components
  02-motion-system.md           timing, easing, forbidden list

03-content/
  01-homepage-storyboard.md     the seven beats
  02-homepage-wireframe.md      frame-by-frame specification

04-build/
  ARCHITECTURE.md               stack, folders, coding standards
```

Upload all of these to the Claude Code project context so every session
has access to the full doctrine.

```
REV 1.0 — Issued 2026-07 — Implementation Plan
```
