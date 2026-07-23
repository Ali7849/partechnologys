# PAR TECHNOLOGYS
## Software Architecture

Version 1.0 · Architecture Round 1
Lead Software Architect. Governs the build for the next twenty years, or until a stated
rationale replaces it.

```
REV 1.0 · ISSUED 2026-07 · STACK Next.js 15 · React 19 · TypeScript 5.x
```

---

# PART 0 — STACK REVIEW

Two libraries in the proposed stack are rejected. Both rejections come from the motion system,
not from preference, and both have a stated replacement.

## Lenis — rejected

**The motion system's fourth law is: the user drives.** Lenis works by calling
`preventDefault` on wheel events and lerping the scroll position itself. Native scroll is
replaced with an interpolated approximation of scroll.

What that costs:

- **Perceived latency of roughly 100–150ms** on the one interaction that must feel instant.
  Every visitor has a calibrated expectation of scroll response from their operating system,
  and any deviation registers as the page being slightly broken, even when they cannot name it.
- Browser find-in-page jumps to the wrong position
- Scroll anchoring breaks; content shifts push the user
- Keyboard scroll (space, page keys, arrows) becomes an emulation
- Deep-link `#anchor` behaviour must be reimplemented
- Users with a system-level reduced-motion or scroll preference are overridden

On a brand whose emotional territory is *relief* and whose first promise is that things respond
correctly, shipping a page where scroll feels approximately right is the wrong trade.

### What Lenis is actually solving, and the correct fix

There is a real problem underneath: scrub animation driven directly by raw `scrollY` looks
jittery, because scroll events fire irregularly and wheel deltas are quantised.

**The fix is to interpolate the animated value, not the scroll position.**

```
Lenis            scroll position is lerped  →  page moves smoothly, feels laggy
Our approach     scroll position is native  →  page moves instantly, feels correct
                 animated value is lerped   →  the 3D cut plane moves smoothly
```

One shared rAF loop reads `window.scrollY` directly, normalises it to progress, and lerps
toward that target at a fixed rate. The section plane in F02 glides. The page itself never
lags by a single frame, because we never touched it.

**This is strictly better than Lenis for our case**: identical visual smoothness on the thing
that needs it, zero cost on the thing that must not have any, ~11KB less JavaScript, and no
accessibility surface.

## Framer Motion — rejected

Two animation libraries at "hundreds of components" scale is not a stack, it is a future
argument. Every engineer picks their preferred one and within a year the codebase has two
motion vocabularies with different easing definitions.

But there is a cleaner reason to drop it specifically.

**Framer Motion's main irreplaceable feature is `AnimatePresence` — exit animations, which CSS
cannot do.** Our motion system specifies scene transitions as a **hard cut with no overlap**:
outgoing 160ms, cut, incoming 240ms. Outgoing and incoming never coexist on screen.

**A doctrine that forbids overlap removes the only reason to install the library.** Route
transitions become a 160ms fade-out on navigation intent and a 240ms fade-in on mount — CSS
and a small hook. Saves ~35KB gzipped.

*What would change this:* if a future application interface needs shared-layout animation or
gesture-driven drag. If that happens, Framer Motion enters scoped to that surface only, never
site-wide.

## Approved without change

`Next.js` `TypeScript` `React Three Fiber` `three` `Drei` `GSAP + ScrollTrigger`

## Final stack

```
next            15.x    App Router, RSC by default
react           19.x
typescript      5.x     strict, noUncheckedIndexedAccess
@react-three/fiber      frameloop="demand" — non-negotiable
@react-three/drei       cherry-picked imports only
three                   r16x
gsap + ScrollTrigger    the only JS animation library
zod                     runtime validation at every boundary
```

**No CSS framework.** The design system is six colours, three faces, one spacing scale, and one
radius. A utility framework would ship thousands of classes to express a system with fewer than
sixty tokens, and would make it trivial for an engineer to invent a value that is not in the
system — which is the actual risk. CSS Modules + custom properties.

---

# PART 1 — FOLDER ARCHITECTURE

The organising principle is **feature colocation, not type grouping.** A `components/` folder
containing two hundred files is the single most reliable way to make a codebase unnavigable.
Code that changes together lives together.

```
par-technologys/
│
├── app/                                  ROUTES ONLY. Thin. No logic.
│   ├── layout.tsx                        root, fonts, providers
│   ├── page.tsx                          → features/homepage
│   ├── work/
│   │   ├── page.tsx
│   │   └── [project]/page.tsx
│   ├── standard/
│   │   ├── page.tsx
│   │   └── [chapter]/page.tsx
│   ├── practice/
│   │   ├── page.tsx
│   │   └── careers/page.tsx
│   ├── group/page.tsx
│   ├── record/
│   │   ├── page.tsx
│   │   └── [note]/page.tsx
│   ├── commission/page.tsx
│   └── api/commission/route.ts
│
├── src/
│   │
│   ├── primitives/                       DESIGN SYSTEM ATOMS
│   │   ├── Text/                         maps 1:1 to the type scale
│   │   ├── Plate/                        the card replacement
│   │   ├── Rule/                         hairlines — used everywhere
│   │   ├── Button/
│   │   ├── Field/
│   │   ├── Rail/
│   │   └── TitleBlock/
│   │       ↑ nothing here imports from features/ or three/. Ever.
│   │
│   ├── components/                       SHARED, COMPOSED
│   │   ├── Navigation/
│   │   ├── Footer/
│   │   ├── SectionGround/                cured ↔ substrate transition
│   │   └── Annotation/                   leader line + label + value
│   │
│   ├── features/                         SELF-CONTAINED DOMAINS
│   │   ├── homepage/
│   │   │   ├── Homepage.tsx              the only export
│   │   │   ├── frames/
│   │   │   │   ├── F01Sheet/
│   │   │   │   │   ├── F01Sheet.tsx
│   │   │   │   │   ├── F01Sheet.module.css
│   │   │   │   │   └── f01.timeline.ts
│   │   │   │   ├── F02Descent/
│   │   │   │   ├── F03Inside/
│   │   │   │   ├── F04Tolerances/
│   │   │   │   ├── F05Turn/
│   │   │   │   ├── F06Return/
│   │   │   │   └── F07TitleBlock/
│   │   │   └── homepage.timeline.ts       master orchestration
│   │   ├── work/
│   │   ├── standard/
│   │   ├── commission/
│   │   └── record/
│   │
│   ├── three/                            ALL 3D. Nothing 3D lives elsewhere.
│   │   ├── Stage.tsx                     canvas, frameloop="demand"
│   │   ├── stations/
│   │   │   ├── stations.ts               the five camera stations
│   │   │   └── useStation.ts             transitions between them
│   │   ├── subjects/
│   │   │   └── [SystemName]/             the real object
│   │   ├── materials/
│   │   │   ├── matte.ts
│   │   │   └── sectionCut.ts             the clipping shader
│   │   ├── lighting/
│   │   │   └── sun.ts                    one source, fixed. One file.
│   │   └── hooks/
│   │
│   ├── motion/                           THE ANIMATION LAYER
│   │   ├── tokens.ts                     durations + easings, single source
│   │   ├── useScrollProgress.ts          native scroll → lerped value
│   │   ├── useReveal.ts                  IntersectionObserver, fire-once
│   │   ├── useCapability.ts              degradation ladder 1–4
│   │   └── ticker.ts                     the single rAF loop
│   │
│   ├── styles/
│   │   ├── tokens.css                    generated from tokens.ts
│   │   ├── reset.css
│   │   └── type.css
│   │
│   ├── content/                          MDX + schemas
│   │   ├── work/
│   │   ├── standard/
│   │   └── schema.ts                     zod
│   │
│   ├── lib/
│   └── types/
│
├── public/
├── scripts/
│   ├── build-tokens.ts                   tokens.ts → tokens.css
│   ├── optimise-models.ts                glTF → draco + meshopt
│   └── stamp-revision.ts                 git SHA + date → title block
└── docs/                                 the strategy, design, motion, IA documents
```

## The four rules that keep this clean at scale

**1. The rule of two.** A component lives inside its feature until a *second* feature needs it.
Then it moves to `components/`. Never promoted in anticipation. Premature sharing is how a
codebase acquires abstractions nobody understands.

**2. Dependency flows one direction.**
```
app → features → components → primitives → tokens
                     ↓
                   three
```
`primitives/` never imports from `components/`. `components/` never imports from `features/`.
A feature never imports from another feature — if two need the same thing, it moves down.
**Enforced by ESLint `import/no-restricted-paths`, not by discipline.**

**3. No barrel files.** No `index.ts` re-exporting a folder's contents. Barrels break
tree-shaking, slow TypeScript's language server measurably past ~200 modules, and create
circular imports that are painful to unwind. Import from the file.

**4. `'use client'` at the leaf, never at the layout.** Everything is a Server Component by
default. Only components with state, effects, or three.js get the directive. Placing it in a
layout silently makes the entire subtree client-rendered, which is the most common performance
regression in App Router codebases and is invisible in review.

---

# PART 2 — COMPONENT ARCHITECTURE

## Four tiers, strict

| Tier | Knows about | Example |
|---|---|---|
| **Primitive** | tokens only | `Text`, `Rule`, `Plate`, `Button` |
| **Component** | primitives | `Navigation`, `Annotation` |
| **Frame / Feature** | components, three, motion | `F03Inside` |
| **Route** | one feature | `app/page.tsx` |

A route file should be under twenty lines. If a page component contains logic, that logic
belongs in a feature.

## Primitives map to the design system, not to convenience

```tsx
// Text is the type scale. There is no other way to set type.
<Text as="h1" scale="d1">We build systems that hold.</Text>
<Text as="p"  scale="b1">…</Text>
<Text as="span" scale="m3">SUBJECT — DISPATCH · 2023</Text>
```

**`Text` accepts no `size`, `weight`, `color`, or `className` for typography.** The scale prop
is a closed union of the eleven steps in the design system. This is the mechanism that prevents
a system with sixty tokens from degrading into four hundred one-off values across two hundred
components — which is how every design system dies.

Escape hatches are a governance decision, not a prop.

## Composition over configuration

```tsx
// ✗ a component that grew props until it could do anything
<Card title=… subtitle=… image=… variant="elevated" size="lg" hasIcon />

// ✓ composed from primitives, shaped at the call site
<Plate>
  <Text scale="m3">{reference}</Text>
  <Text as="h3" scale="h3">{title}</Text>
  <Rule />
  <Text scale="m2" tone="prussian">{action}</Text>
</Plate>
```

**Hard limit: any component exceeding six props, or containing a `variant` union with more than
three members, is split.** A `variant` prop is usually two components wearing a trenchcoat.

## Frames

Each homepage frame is a self-contained module owning its markup, styles, and timeline. Frames
communicate only through the master timeline and shared scroll progress — never directly.
Deleting a frame folder removes it completely, with no dangling references.

---

# PART 3 — ANIMATION ARCHITECTURE

## Three tiers, zero overlap

The single most important architectural decision for long-term motion sanity is **strict
ownership**. Ambiguity about which tool animates what is how a codebase ends up with the same
hover state implemented four ways.

```
TIER 1 · CSS                 ~95% of all motion
  hover, focus, press, colour, simple opacity/transform reveals
  Zero JS. Composited. Free.
  → transitions only, using var(--t-*) and var(--ease-*)

TIER 2 · GSAP + ScrollTrigger    orchestration and scrub
  load sequence, frame timelines, camera stations, the F02 descent
  → the only JS animation library in the project

TIER 3 · R3F useFrame        3D internals only
  material updates, clip plane uniforms
  → never animates DOM, never reads layout
```

**A pull request that animates a hover state in GSAP is rejected.** Not a style note — a
correctness issue. It moves work from the compositor to the main thread for no benefit.

## Tokens are a single source

`motion/tokens.ts` is authored once; `styles/tokens.css` is **generated** by
`scripts/build-tokens.ts` and committed. GSAP and CSS therefore cannot drift.

```ts
export const T = {
  instant: 0.08, quick: 0.16, standard: 0.24,
  considered: 0.40, structural: 0.64,
} as const;

export const EASE = {
  settle: 'cubic-bezier(0.16, 0.84, 0.24, 1)',
  exit:   'cubic-bezier(0.4, 0, 1, 1)',
  move:   'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
```

Raw durations and raw cubic-beziers are **banned by ESLint rule.** No `0.3`, no
`ease-in-out`, no spring configuration anywhere in the codebase. The motion system forbids
overshoot; the linter enforces it.

## One rAF loop

```
GSAP ticker  (the only rAF in the project)
     ├─ read window.scrollY                 → normalise → lerp toward target
     ├─ ScrollTrigger updates
     └─ invalidate() the R3F canvas          only if something changed
```

`<Canvas frameloop="demand" />`. **A locked camera on a static scene costs zero GPU.** This is
the motion system's "stillness is the default" translated into a render policy, and it is why
this page can hold a 3D object on screen for two minutes on a phone without draining battery.

Never a second `requestAnimationFrame`. Never a `scroll` event listener.

## Capability context

The degradation ladder is a React context read by every animated component:

```
1  full       3D, scrub descent, plotter reveal, parallax
2  reduced    3D static at Station 01, no scrub, no parallax
3  static     axonometric SVG replaces 3D, opacity only
4  minimal    no motion, full content, full function
```

Resolved once on mount from `prefers-reduced-motion`, `deviceMemory`, `hardwareConcurrency`,
`connection.effectiveType`, and a WebGL2 probe. **Level 4 must render a complete, credible page.**
It is a print, not a fallback.

---

# PART 4 — PERFORMANCE ARCHITECTURE

## Budgets — enforced in CI, not aspirational

```
LCP                  < 1.8s      4G, mid-tier Android
CLS                  < 0.05
INP                  < 150ms
JS, initial route    < 180KB     gzipped, excluding 3D
3D payload           < 2.5MB     desktop  ·  < 900KB total mobile page
Fonts                < 180KB     3 faces, subset, WOFF2
Main thread / frame  < 8ms
```

**A pull request exceeding any budget fails the build.** Not a warning. The brand's core
promise is that things hold under load; a site that degrades is a self-inflicted contradiction.

## Techniques

**Rendering.** Static generation for everything except `/api/commission`. Content is MDX,
compiled at build. There is no runtime CMS on the critical path.

**3D.** Dynamically imported, `ssr: false`, never render-blocking. The load sequence proceeds
without it and the object fades in whenever it arrives. Draco + meshopt. `frameloop="demand"`.
Instanced geometry for the F05 node field — one draw call regardless of node count. Manual
disposal on unmount; R3F does not free GPU memory for you and leaked contexts are the most
common cause of a slow 3D site over a long session.

**Animation.** `transform` and `opacity` only. `will-change` applied on interaction start and
removed on completion, never left in a stylesheet. Maximum four concurrently animating
elements. All triggers via `IntersectionObserver`.

**Assets.** Fonts self-hosted, subset to Latin + the specific glyphs used, `preload` on the two
faces in the first viewport, `font-display: swap`. Images via `next/image`, AVIF with WebP
fallback, explicit dimensions always — CLS is a correctness bug.

**Drei.** Cherry-picked imports only. `import { useGLTF } from '@react-three/drei'` pulls the
whole library in some bundler configurations; import from the deep path and verify with the
bundle analyser at each release.

---

# PART 5 — GIT WORKFLOW

## Trunk-based, short-lived branches

Gitflow is designed for versioned software with parallel release trains. This is a continuously
deployed site built by a small senior team, and gitflow's overhead buys nothing here.

```
main                      always deployable, always deployed
  └─ feat/f03-annotations       < 3 days, then merged or deleted
```

**A branch older than three days is a merge conflict that has not happened yet.** Branch, ship,
delete.

## Branch naming

```
<type>/<scope>-<description>

feat/f02-section-plane
fix/nav-focus-ring
perf/model-draco-compression
a11y/annotation-keyboard-nav
docs/motion-system-rev2
chore/deps-july
refactor/text-primitive
```

Lowercase, kebab-case, no ticket numbers in the branch name — they belong in the PR.
Scope matches a folder in `src/`.

## Commits

Conventional Commits, enforced by commitlint. Imperative mood, under 72 characters.

```
feat(f04): add tolerances specification frame
fix(three): dispose geometry on stage unmount
perf(motion): move reveal transitions from gsap to css
a11y(annotation): link leader lines to dl semantics
```

## Pull requests

Small. **Under 400 changed lines** — review quality collapses past that point, and this brand
does not get to claim rigor while merging unreviewable diffs.

Required to merge:
```
□ typecheck, lint, unit tests pass
□ bundle size within budget         automated
□ Lighthouse CI within budget       automated
□ axe accessibility scan clean      automated
□ no raw durations or easings       lint rule
□ preview deployment visually reviewed on a real phone
□ one approval from a senior engineer — no self-merge, ever
```

Squash merge. `main` history is one commit per change, readable in five years.
**Value #4 applies to our own repository: build to be inherited.**

## Revision stamping

The footer title block carries a real revision and issue date. `scripts/stamp-revision.ts`
writes the short git SHA and build timestamp at build time.

**The doctrine is wired into the pipeline.** A visitor who checks the title block is reading
the actual state of the deployed system, which is precisely the claim the brand makes about
everything else it builds.

---

# PART 6 — CODING STANDARDS

## TypeScript

```jsonc
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true,
  "exactOptionalPropertyTypes": true
}
```

- **`any` is banned.** `unknown` plus a narrowing check, or a zod schema.
- **No non-null assertion (`!`).** If it cannot be null, type it that way; if it can, handle it.
- **`type` over `interface`** except when declaration merging is genuinely needed.
- **No `I` prefix, no `T` prefix.** `Project`, not `IProject`.
- **Every external boundary is zod-validated** — form input, MDX frontmatter, API responses.
  Data entering the system unvalidated is an untested tolerance.

## React

- **Named exports only.** Default exports rename freely across files and break find-references.
  Next.js route files are the sole exception, because the framework requires it.
- **Props typed inline as `type Props = { … }`.** Not exported unless another module needs it.
- **No `React.FC`.** It adds implicit children and infers worse.
- **Hooks live beside the component that uses them** until a second consumer appears.
- **`useEffect` requires a comment stating what it synchronises with.** Most effects in a
  React codebase are a state model that was not thought through.

## Naming

```
Components        PascalCase        F03Inside.tsx, TitleBlock.tsx
Hooks             camelCase, use    useScrollProgress.ts
Utilities         camelCase         formatRevision.ts
Constants         SCREAMING_SNAKE   MAX_ANNOTATIONS
Types             PascalCase        Project, StationId
CSS modules       Component.module.css
CSS classes       camelCase         .leaderLine
Custom properties --kebab-case      --t-standard
Three subjects    PascalCase folder /subjects/DispatchCore/
Frames            F##Name           F05Turn
Booleans          is/has/should     isSectioned, hasAnnotations
Event handlers    handle*  /  on*   handleSubmit, onStationChange
```

**Names describe what a thing is, never how it is implemented.** `AnnotationLine`, not
`SvgLeaderPath`. Implementation changes; the concept does not.

## CSS

CSS Modules, one file per component, colocated.

- **Every value is a token.** A raw hex, a raw px outside the spacing scale, or a radius other
  than 2px fails lint.
- **Maximum nesting depth: 2.**
- **No element selectors inside modules** — they collide with global styles in ways that are
  hard to trace. Classes only.
- Logical properties (`margin-inline`, `padding-block`) throughout.

---

# PART 7 — ASSET MANAGEMENT

```
public/
├── fonts/           archivo-var.woff2, source-serif-var.woff2, plex-mono.woff2
├── models/          [subject].draco.glb  +  [subject].static.svg  (level 3 fallback)
├── img/
└── standard/        the-standard-rev1.pdf
```

## Pipeline

**Models.** Authored in whatever tool → glTF → `scripts/optimise-models.ts` runs
gltf-transform: prune, dedupe, weld, draco compress, meshopt. Committed optimised. Raw source
files live outside the repository — a git history containing 200MB of `.blend` files is a
repository nobody can clone.

Every model ships with a **hand-authored static axonometric SVG** for degradation level 3. Not
auto-generated: it is a drawing, and it appears on the page of a company that claims to draw.

**Fonts.** Subset to the actual glyph set with `glyphhanger`, variable where available. Three
files, three preloads, no font CDN — a third-party request on the critical path for the single
most important brand asset is not acceptable.

**Images.** Source at 2x, `next/image` handles the rest. Explicit dimensions always.
Photography follows the direction in the design system; **stock is not permitted at any price.**

**The Standard PDF.** Versioned filename, never overwritten. Old revisions remain reachable —
a standard whose previous versions vanish is not a standard.

---

# PART 8 — SCALE GOVERNANCE

## What actually goes wrong past two hundred components

Not any single bad decision. It is accretion: a `variant` prop that grows one member at a time,
a `utils.ts` that becomes a landfill, a `components/` folder nobody can navigate, four ways to
do the same animation.

**Six enforced rules, each with a mechanism rather than a convention:**

| Rule | Enforced by |
|---|---|
| Dependency direction is one-way | `import/no-restricted-paths` |
| No raw durations, easings, colours, or radii | custom ESLint rules |
| No barrel files | lint rule + review |
| Six props maximum, three variants maximum | review checklist |
| Rule of two before promotion | review checklist |
| Budgets | CI, blocking |

Conventions that rely on memory decay in about four months. Every rule above is either a lint
error or a failed build.

## Quarterly architecture review

One hour, four questions:
1. Which components have grown past six props?
2. What is in `components/` that only one feature uses? *(demote it)*
3. What is duplicated across two features? *(promote it)*
4. Are we within every budget, or have we been quietly raising them?

Question four is the one that matters. **Budgets that get raised are budgets that do not exist.**

---

# PART 9 — DECISION RECORD

| # | Decision | Rationale |
|---|---|---|
| 001 | Reject Lenis; lerp the animated value, not scroll | Motion Law IV: the user drives |
| 002 | Reject Framer Motion; GSAP only | Hard-cut transitions remove the need for AnimatePresence |
| 003 | No CSS framework | Sixty tokens do not need thousands of utility classes |
| 004 | `frameloop="demand"` | Motion Law I: stillness is the default |
| 005 | Feature colocation, rule of two | `components/` folders do not survive scale |
| 006 | No barrel files | Tree-shaking and TS language-server performance |
| 007 | Trunk-based, 3-day branch ceiling | Small senior team; gitflow buys nothing here |
| 008 | Budgets block the build | Design system Part 10 — the quality floor is a brand requirement |
| 009 | Revision stamped from git at build | The title block must carry real data |

Amending any of these requires a written rationale traced to strategy, motion, or design —
appended here, never silently replaced.

```
REV 1.0 — Issued 2026-07 — Architecture Round 1 — Awaiting founder review
```
