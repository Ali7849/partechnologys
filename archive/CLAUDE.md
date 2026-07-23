# CLAUDE.md

Project instructions for PAR Technologys. Read fully before any task.

---

## PROJECT

Digital headquarters for **PAR TECHNOLOGYS** — the technology arm of PAR Group Global,
sibling to Pontis Construction. Positioning: an engineering practice that builds
load-bearing software, not a digital agency.

Governing sentence: **We build systems that hold.**

The name is a coined proper noun. Always `PAR TECHNOLOGYS`, uppercase, never a plural,
never shortened to "PAR Tech" in copy. The deliberate irregularity means every other
detail must be flawless.

---

## DOCUMENT HIERARCHY

Resolve every decision against these, in this order of authority:

```
docs/02-brand-strategy.md              WHY — positioning, values, voice
docs/03-information-architecture.md    WHERE — sitemap, navigation
docs/01-design-system.md               WHAT IT LOOKS LIKE — tokens, type, components
docs/02-motion-system.md               HOW IT MOVES — timing, easing, forbidden list
docs/01-homepage-storyboard.md         THE FILM — seven beats
docs/02-homepage-wireframe.md          THE FRAMES — layout, per-frame spec
docs/ARCHITECTURE.md                   THE CODE — stack, folders, standards
docs/BUILD_SPEC.md                     THE CONTRACT — build from this file
```

**BUILD_SPEC.md is the implementation contract.** If it and a creative doc disagree,
stop and ask. Do not resolve it yourself.

---

## STACK

```
Next.js 15 (App Router) · React 19 · TypeScript strict
@react-three/fiber · @react-three/drei · three
GSAP + ScrollTrigger        the ONLY JS animation library
Zustand                     cross-frame state (Decision #010)
zod                         every external boundary
CSS Modules                 no CSS framework
```

### Banned dependencies — do not install, do not suggest

- **Lenis** or any smooth-scroll library — native scroll is never touched
- **Framer Motion** — hard-cut transitions remove the need for AnimatePresence
- **Tailwind** or any utility CSS framework
- **OrbitControls** — the camera moves only between named stations
- Any spring/physics animation library

---

## HARD RULES

Violating any of these is a defect, not a style disagreement.

### Code
- No `any`. No `!` non-null assertion. TypeScript strict.
- Named exports only (except Next.js route files).
- **No barrel files** (`index.ts` re-exports).
- `'use client'` at the leaf, never in a layout.
- No component exceeds **6 props** or **3 variants**.
- Dependency flow is one-way: `app → features → components → primitives → tokens`.
- A component lives in its feature until a **second** feature needs it.

### Values
- **No raw values anywhere.** No hex, no px outside the spacing scale, no duration
  literals, no cubic-bezier literals. Everything from tokens.
- **Radius is 2px.** Everywhere. Never 0, never more.
- **Six colours only.** Cured, Vellum, Zinc, Substrate, Prussian, Fault.
- **Fault is failure only** — the one exception is the 3D section-cut face.

### Motion
- **No `scroll` event listeners.** `IntersectionObserver` only.
- **One rAF loop** — `src/motion/ticker.ts`. Never a second one.
- **Animate `transform` and `opacity` only.** Documented exceptions:
  `background-color` (SectionGround), the clip shader uniform, light intensity.
- **No bounce, no spring, no overshoot.** Ever.
- Entrance travel ≤ 24px. Hover displacement ≤ 2px. Nothing scales on hover.
- Scroll reveals fire **once**, never re-trigger.
- `frameloop="demand"` — a locked camera costs zero GPU.

### Forbidden outright
Scroll-jacking · custom cursors (outside 3D canvas) · magnetic buttons · parallax on
text · ambient particles · idle camera drift · moving or coloured lights · bloom ·
letter-by-letter text · counting numbers · hover glow/lift/scale · fake progress bars ·
generic card grids · autoplay with sound

---

## TOKENS

```
COLOUR      --cured      #D9DCD6    primary surface
            --vellum     #EEEFEA    raised planes
            --zinc       #8D9599    metadata, hairlines
            --substrate  #101417    text, dark sections
            --prussian   #16344E    the ONLY accent — interaction/state
            --fault      #A83226    failure only

SPACING     8px module · 96px bay · 4/8/16/24/32/48/64/96/144/192/288/384

RADIUS      2px — universal, no exceptions

TYPE        Archivo          display     D1–D3, H1–H3
            Source Serif 4   body        B1–B3, max 76ch measure
            IBM Plex Mono    data        M1–M3 — all meaningful numbers

MOTION      instant 80 · quick 160 · standard 240 · considered 400 · structural 640
            settle  cubic-bezier(0.16, 0.84, 0.24, 1)
            exit    cubic-bezier(0.4, 0, 1, 1)
            move    cubic-bezier(0.4, 0, 0.2, 1)

GRID        12 col · 24px gutter · 1440 content · 1680 full · 64px rails
BREAKPOINTS 1680 / 1280 / 900 / 600
```

---

## BUILD ORDER

Strictly sequential. Nothing starts before everything above it is approved.

```
S0  Tokens                    dev/homepage-foundation
S1  Primitives                dev/homepage-foundation
S2  Navigation/Rail/Footer    feat/navigation-system
S3  Motion infrastructure     feat/motion-infra
S4  3D Stage                  feat/three-stage
F01 The Sheet                 feat/f01-sheet
F02 The Descent               feat/f02-descent
F03 Inside                    feat/f03-inside
F04 The Tolerances            feat/f04-tolerances
F05 The Turn                  feat/f05-turn
F06 The Return                feat/f06-return
F07 Title Block               feat/f07-title-block
```

**Never build two at once. Never build ahead.**

---

## GIT

`main` is never touched directly. Work happens on `dev/homepage-foundation` and
`feat/*` branches cut from it.

```
<type>/<scope>-<description>       feat/f02-section-plane
                                   fix/nav-focus-ring
                                   perf/model-draco
                                   a11y/annotation-keyboard
```

Conventional Commits, imperative, under 72 chars: `feat(f01): implement load sequence`

PRs under 400 lines. Squash merge. No self-merge.

---

## AFTER EVERY FEATURE

Stop and report in this format. Do not proceed without approval.

```
## [ID] — [Name] · Complete

### Files changed
- path — why

### Git
Branch:  feat/[name]
Commit:  feat([scope]): [message]

### Testing checklist
[ ] TypeScript strict, zero errors
[ ] ESLint clean including custom rules
[ ] Responsive at 1680 / 1280 / 900 / 600
[ ] Full keyboard traversal
[ ] VoiceOver AND NVDA
[ ] prefers-reduced-motion via real OS setting
[ ] Lighthouse: Performance > 95, Accessibility 100
[ ] Bundle within budget
[ ] Reviewed on a real phone

### Potential improvements
- deferred items, not scope creep
```

---

## BLOCKED CONTENT — NEVER FABRICATE

Five pieces of real content do not exist yet. See BUILD_SPEC.md Appendix for schemas.

```
D1  The subject          the real system shown in 3D
D2  Annotations          F03 — real metrics
D3  Tolerances           F04 — including the real refusal
D4  Node field           F05 — real deployment count
D5  Engagement floor     F06 — a real number
```

**Rules:**
- Build against mock data that is **visibly, unmistakably fake** — `"SUBJECT PENDING"`,
  never a plausible-looking placeholder.
- **Never invent a metric, a client name, a refusal, or a price.** A fabricated
  specific is worse than an honest gap on a site whose entire argument is that the
  numbers can be checked.
- F03, F04, F05 may be built but **must not merge to main** with mock data.

---

## QUALITY FLOOR

Non-negotiable. These are brand requirements, not engineering preferences — a site
promising systems that hold cannot itself be slow or inaccessible.

```
LCP < 1.8s (4G, mid-tier Android) · CLS < 0.05 · INP < 150ms
JS < 180KB gz (excl. 3D) · 3D < 2.5MB · mobile total < 900KB
Main thread < 8ms/frame
WCAG 2.2 AA verified · focus rings never removed · reduced-motion honoured
```

A PR exceeding any budget **fails the build**. Budgets are not raised.

---

## COMMANDS

```
npm run dev              development
npm run build            production build (stamps git revision into title block)
npm run build:tokens     regenerate tokens.css from tokens.ts
npm run lint             eslint incl. custom rules
npm run typecheck        tsc --noEmit
npm run test:a11y        axe
npm run analyze          bundle analyzer
```

Dev-only QA: `?motion=1|2|3|4` forces a degradation level.

---

## WHEN UNCERTAIN

Ask. Do not resolve creative ambiguity independently, do not invent content, do not
add a dependency, and do not raise a budget. Every one of those decisions belongs to
the founder.

```
REV 1.0 — 2026-07
```
