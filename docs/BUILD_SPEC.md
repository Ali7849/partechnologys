# PAR TECHNOLOGYS
## BUILD_SPEC.md — Engineering Implementation Contract

Version 1.0 · Build Spec Round 1
Derived exclusively from: Homepage Storyboard, Homepage Wireframe, Motion System,
Design System, Architecture. No creative decision is introduced here that does not
already exist in one of those five documents. Where a real engineering decision was
required and none of the five documents made it, it is marked **[ENGINEERING DECISION]**
and justified against the architecture's own principles — never invented freely.

**This document is the contract.** A senior frontend engineer should be able to build
every frame from this file alone, without asking a creative question. Engineering
questions — "which library," "where does this state live" — are answered here.
Creative questions — "what does the button say" — are answered in the source documents
or flagged in the Data Contracts appendix if genuinely blocked.

```
REV 1.0 · ISSUED 2026-07 · SOURCE DOCS LOCKED AT THEIR REV 1.0
```

---

# PART 0 — HOW TO READ THIS SPEC

## Dependency graph

Build in this order. Nothing below can be started before everything above it exists.

```
S0  Tokens                (no dependency)
S1  Primitives             <- S0
S2  Navigation/Rail/Footer <- S1
S3  Motion Infrastructure  <- S0
S4  3D Stage               <- S0, S3
-----------------------------------
F01 The Sheet              <- S1, S2, S3, S4
F02 The Descent            <- F01
F03 Inside                 <- F02
F04 The Tolerances          <- F03
F05 The Turn                <- F04
F06 The Return               <- F05
F07 Title Block               <- F06
```

`S0`-`S4` are **Shared Systems** - not frames, but every frame's React hierarchy
imports from them. They get the same rigor as a frame, minus fields that do not apply
(a token file has no camera station).

## Field legend

Every section below answers, in order: **Objective, Components, Folder Location,
React Hierarchy, Three.js Scene, Camera Station, Lighting, Materials, Shaders,
GSAP Timelines, Scroll Behaviour, State Management, Assets, Accessibility
Requirements, Performance Budget, Mobile Behaviour, Acceptance Criteria, Git Branch
Name, Suggested Commit Message, Testing Checklist.**

Where a field does not apply to a given system, it is stated as `N/A` with the reason -
never silently omitted, so the absence is a decision, not a gap.

## [ENGINEERING DECISION] - state management library

None of the five source documents name a state management library, and cross-frame
state genuinely exists: scroll progress, current camera station, capability level,
sound toggle, and the hovered annotation must be readable from both React and the R3F
scene tree, which sit in different reconciler trees and cannot share Context cleanly
without re-render cost on every scroll frame.

**Decision: Zustand**, vanilla store, no React Context for cross-cutting state.

Justification against the architecture's own stated principles:
- **~1KB gzipped** - fits the JS budget without meaningfully touching it
- Authored by the same maintainers as `@react-three/fiber` and `drei`, specifically to
  solve the React <-> R3F state-sharing problem the architecture already has
- Reads outside React's render cycle (`getState()`), which is required inside the GSAP
  ticker and `useFrame` loops without forcing a re-render per animation frame - this is
  the single reason Context is disqualified: Context updates force a render; a store
  read does not
- No boilerplate, no provider tree, no reducer - consistent with the "no dependency
  that argues with our own doctrine" standard set for Lenis and Framer Motion

This is the only new dependency introduced in this document. It is logged as
**Decision Record #010** and should be appended to `ARCHITECTURE.md` Part 9 upon
approval.

```
useSceneStore  {
  station:        StationId          // 'iso' | 'plan' | 'elevation' | 'section' | 'detail'
  scrollProgress: number             // 0-1, lerped, updated by the ticker
  capability:     1 | 2 | 3 | 4       // degradation ladder
  soundEnabled:   boolean
  hoveredId:      string | null       // annotation <-> 3D component link
  activeFrame:    FrameId             // which of F01-F07 is in view
}
```

---

# PART 1 — SHARED SYSTEMS

## S0 · DESIGN TOKENS

**Objective.** One authored source of truth for every colour, spacing, radius, and
type value in the system, generated into both TypeScript and CSS so the two cannot
drift, and enforced by lint so no raw value can enter the codebase beside it.

**Components.** `tokens.ts` (source) -> `tokens.css` (generated, committed).

**Folder location.** `src/styles/tokens.ts`, `src/styles/tokens.css` (generated),
`scripts/build-tokens.ts` (generator).

**React hierarchy.** N/A - consumed via CSS custom properties and TS imports, not a
component.

**Three.js scene / Camera station / Lighting / Materials / Shaders.** N/A at this
layer. Colour and easing values defined here are consumed by `S4` and the frames.

**GSAP timelines.** N/A - but every duration/easing value GSAP timelines reference
throughout the build is imported from this file's TS export, never a literal.

**Scroll behaviour.** N/A.

**State management.** N/A - static values, not runtime state.

**Assets.** None.

**Accessibility requirements.** Contrast ratios specified in the design system
("Contrast floor" section) are asserted here as a unit test - a token change that
drops a pairing below its floor must fail CI, not be caught in review.

**Performance budget.** `tokens.css` must be under 4KB uncompressed. It is inlined in
`<head>`, never a separate request.

**Mobile behaviour.** N/A - tokens are breakpoint-agnostic; breakpoint values
(`1680 / 1280 / 900 / 600`) are themselves tokens, defined once here.

**Acceptance criteria.**
```
[ ] Six colours exist, exactly, plus their derived values - no seventh colour anywhere
[ ] Radius token is 2px, singular, no second radius value defined
[ ] Spacing scale matches the 8px module / 96px bay system exactly
[ ] Type scale matches D1-M3 exactly, including clamp() formulas
[ ] tokens.css is generated, never hand-edited (verified by a CI diff check)
[ ] Contrast unit test passes for every documented pairing
```

**Git branch name.** `dev/homepage-foundation` (part of the foundation branch, not
its own feature branch).

**Suggested commit message.** `feat(tokens): author design tokens and generation script`

**Testing checklist.**
```
[ ] npm run build:tokens produces byte-identical output on a second run (idempotent)
[ ] Importing a non-existent token key fails TypeScript compilation
[ ] Attempting a raw hex/px/duration value elsewhere in the codebase fails lint
```

---

## S1 · PRIMITIVES

**Objective.** The atomic vocabulary - `Text`, `Rule`, `Button`, `Plate`, `Field` -
that every frame composes from. No frame may write raw typographic or spacing CSS;
it may only arrange primitives.

**Components.** `Text`, `Rule`, `Button` (Primary/Secondary/Tertiary), `Plate`,
`Field`.

**Folder location.** `src/primitives/[Name]/[Name].tsx` +
`[Name].module.css` per component. No barrel file.

**React hierarchy.**
```
Text      - polymorphic via `as`, scale prop is a closed union (d1...m3)
Rule      - <hr>-semantic div, full-bleed or contained via prop
Button    - tier prop: 'primary' | 'secondary' | 'tertiary', renders <button> or <a>
Plate     - <article> or <div>, no shadow, no elevation prop above E2
Field     - <label> + <input>/<textarea>, label always rendered, never placeholder-only
```

**Three.js scene / Camera / Lighting / Materials / Shaders.** N/A.

**GSAP timelines.** N/A at the primitive level - primitives expose CSS transition
hooks (`--t-quick` etc. via class) that frames orchestrate; primitives never run GSAP
themselves.

**Scroll behaviour.** N/A.

**State management.** Local only - `Field` holds its own value unless controlled by
a parent form; no primitive reads the global store.

**Assets.** None directly; `Text` triggers font loading via the root layout, not
per-instance.

**Accessibility requirements.**
```
Text     semantic element matches visual hierarchy (as="h2" is a real <h2>)
Button   real <button>/<a>, never a styled <div>; visible 2px focus ring, never removed
Field    label always visible and programmatically associated; required stated as
         the word "required" in the label, not an asterisk; error text linked via
         aria-describedby; validation fires on blur, never on keystroke
Rule     aria-hidden - decorative/structural, carries no content
Plate    if interactive, is a real <a> or <button> wrapping content, not a div
         with an onClick
```

**Performance budget.** Combined primitive bundle under 8KB gzipped. Zero runtime
dependencies beyond React.

**Mobile behaviour.** `Button` height remains 48px (tap target floor). `Field`
label and input stack full-width below 600px. No primitive has a mobile-specific
variant - responsiveness is handled by the frames that place them.

**Acceptance criteria.**
```
[ ] Text's `scale` prop is a closed TypeScript union of exactly D1-M3, eleven values
[ ] Text accepts no color/size/weight/className prop for typographic purposes
[ ] Button has exactly three tiers, no fourth
[ ] Every primitive passes axe with zero violations in isolation
[ ] No primitive exceeds 6 props
```

**Git branch name.** `dev/homepage-foundation`

**Suggested commit message.** `feat(primitives): add Text, Rule, Button, Plate, Field`

**Testing checklist.**
```
[ ] Storybook-style isolated render of each primitive at every relevant prop combination
[ ] Keyboard-only pass: tab to every interactive primitive, activate with Enter/Space
[ ] VoiceOver and NVDA pass on Field and Button
[ ] Visual regression snapshot at 1680/1280/900/600
```

---

## S2 · NAVIGATION + RAIL + TITLE BLOCK

**Objective.** The persistent frame that does not change between routes or between
homepage frames - nav bar, annotation rail, footer title block.

**Components.** `Navigation`, `Rail`, `TitleBlock`.

**Folder location.** `src/components/Navigation/`, `src/components/Rail/`,
`src/components/TitleBlock/`.

**React hierarchy.**
```
<RootLayout>
  <Navigation />        fixed, 72px, top
  <Rail side="left" />  fixed, 64px, full height
  <main>{children}</main>
  <Rail side="right" /> fixed, 64px, full height
  <TitleBlock />        appears once, end of document flow (homepage only;
                        every other route gets a shorter footer variant)
```

**Three.js scene.** N/A - these are DOM/CSS only.

**Camera station / Lighting / Materials / Shaders.** N/A.

**GSAP timelines.** `Navigation` glass transition on scroll (`background-filter`
crossfade, 240ms) is CSS-driven via a scroll-position class toggle, not GSAP - per
Tier 1 of the animation architecture (CSS owns simple opacity/transform/colour
transitions). `Rail` draw-in on load is GSAP-orchestrated as part of the F01 load
timeline (see F01 below), not owned by the component itself.

**Scroll behaviour.** `Navigation` reads scroll position via `IntersectionObserver`
against a 1px sentinel at the top of the page to toggle its glass state - never a
`scroll` event listener.

**State management.** `Navigation`'s glass state is local (`isScrolled: boolean`).
`Rail`'s content (current section reference) reads `activeFrame` from
`useSceneStore`.

**Assets.** None.

**Accessibility requirements.**
```
Navigation   <nav aria-label="Primary">, current page indicated via aria-current
Rail         aria-hidden entirely - it is supplementary visual information
             (drawing-sheet reference), never the sole carrier of navigable content
TitleBlock   <footer>, real <time datetime="..."> for the issue date, <nav
             aria-label="Footer"> for the four columns
Skip link    "Skip to content" is the first focusable element in RootLayout,
             landing focus past Navigation and Rail
```

**Performance budget.** Combined under 12KB gzipped. Glass effect
(`backdrop-filter: blur(16px)`) must not be applied to more than one element at a
time - compositor cost on repeated blur regions is non-trivial on mobile GPUs.

**Mobile behaviour.** Below 900px: `Navigation` collapses to logo + single menu
control; the mobile menu replaces the full viewport per the design system (never a
floating overlay). `Rail` collapses to a 32px left margin carrying only the section
reference - right rail is removed entirely below 900px, not shrunk.

**Acceptance criteria.**
```
[ ] No hamburger menu appears above 900px
[ ] Navigation contains exactly 4-5 primary items plus the commission action
[ ] TitleBlock's revision number and date are read from build-time environment
    variables (stamped by scripts/stamp-revision.ts), never hand-typed
[ ] Rail is present and correctly hidden from assistive tech on every route
```

**Git branch name.** `feat/navigation-system`

**Suggested commit message.**
`feat(navigation): add persistent nav, rail, and title block`

**Testing checklist.**
```
[ ] Mobile menu traps focus correctly and returns focus to the trigger on close
[ ] Glass transition triggers within one frame of the scroll threshold, no jank
[ ] TitleBlock revision data matches the actual deployed git SHA
[ ] Full keyboard traversal: skip link -> nav items -> commission action -> rail
    (aria-hidden, skipped) -> main content
```

---

## S3 · MOTION INFRASTRUCTURE

**Objective.** The single rAF loop, the scroll-progress lerp, the reveal hook, and
the capability detection that every animated frame depends on. No frame may create
its own `requestAnimationFrame` call or `scroll` listener.

**Components.** `ticker.ts`, `useScrollProgress`, `useReveal`, `useCapability`.

**Folder location.** `src/motion/`.

**React hierarchy.** Hooks, not components - consumed inside frame components.
`useCapability` result is written to `useSceneStore` once at mount via a top-level
`<CapabilityProvider>` in `RootLayout` that runs the detection and writes the result;
it renders no DOM itself.

**Three.js scene / Camera / Lighting / Materials / Shaders.** N/A directly - but
`ticker.ts` is what calls `invalidate()` on the R3F canvas (see S4).

**GSAP timelines.** `ticker.ts` **is** the GSAP ticker (`gsap.ticker.add(...)`) -
the one and only rAF loop in the application. All `ScrollTrigger` instances register
against this shared ticker by default; no frame instantiates a second ticker.

**Scroll behaviour.**
```
useScrollProgress(target: RefObject, options)
  -> reads window.scrollY natively inside the shared ticker callback
  -> normalises to 0-1 against the target element's viewport intersection
  -> lerps toward that value at a fixed rate (not framerate-dependent - time-based lerp)
  -> writes to useSceneStore.scrollProgress
  -> NEVER calls preventDefault, NEVER modifies window.scrollTo
```

**State management.** Writes `scrollProgress`, `capability` to `useSceneStore`.
Reads nothing from React Context.

**Assets.** None.

**Accessibility requirements.** `useCapability` must resolve `prefers-reduced-motion`
as the **highest-priority signal** - a high-end device with the OS setting enabled
must still resolve to level 3 or 4, never overridden by hardware capability.

**Performance budget.** Infrastructure overhead under 6KB gzipped. The ticker
callback itself must execute in under 1ms per frame excluding consumer work - it is
pure bookkeeping.

**Mobile behaviour.** `useCapability` weights `deviceMemory`, `hardwareConcurrency`,
and `connection.effectiveType` more heavily than desktop, since these signals are
more reliably present on mobile browsers than desktop Chrome/Safari, which often
omit them.

**Acceptance criteria.**
```
[ ] Zero `addEventListener('scroll', ...)` calls anywhere in the codebase
    (enforced by a custom lint rule)
[ ] Zero secondary requestAnimationFrame calls outside ticker.ts
[ ] Capability resolves to exactly one of 1|2|3|4 within 50ms of mount
[ ] ?motion=1|2|3|4 query param override works for QA without changing device
```

**Git branch name.** `feat/motion-infra`

**Suggested commit message.**
`feat(motion): add shared ticker, scroll progress, reveal, and capability detection`

**Testing checklist.**
```
[ ] prefers-reduced-motion: reduce forces level 3 regardless of device specs (test
    via OS setting, not just query param)
[ ] Query param override confirmed for all four levels
[ ] Chrome DevTools Performance panel shows one rAF callback, not several
[ ] Scroll-linked value updates smoothly under artificial CPU throttling (6x)
```

---

## S4 · 3D STAGE

**Objective.** The R3F canvas, camera station system, lighting rig, and material
library shared by every frame's 3D content. Each frame places or transitions the
subject; none of them own the canvas, the light, or the camera independently.

**Components.** `Stage`, `stations.ts`, `useStation`, `sun.ts`, `matte.ts`,
`sectionCut.ts`.

**Folder location.** `src/three/`.

**React hierarchy.**
```
<Stage>                                 <Canvas frameloop="demand">
  <Sun />                                 one directional light, fixed
  <StationCamera />                       reads station from useSceneStore
  {children}                              the subject, supplied by each frame
</Stage>
```

`Stage` is mounted once, at the homepage feature root, and persists across all seven
frames - frames do not mount/unmount the canvas, they change what it renders and
where the camera looks. Re-mounting a WebGL context per frame would be visibly
expensive and is explicitly disallowed.

**Three.js scene.** One scene graph for the entire homepage. The subject (the real
system geometry, pending Data Contract D1) is the only mesh that changes appearance
across frames - via clipping plane (F02-F04), scale (F04-F05), and instance count
(F05's node field, added to the scene graph only for that frame's duration).

**Camera station.** Five named stations, per the motion system:
```
stations.ts
  iso        true isometric, 35.264 degrees / 45 degrees
  plan       top orthographic
  elevation  front orthographic
  section    the F03/F04 cut view
  detail     reserved, not used on the homepage
             (F01-F07 use iso/plan/section only)
```
`useStation(id: StationId, duration = T.structural)` tweens camera position and
target via GSAP, `--ease-settle`, and is the **only** way the camera moves. No
`OrbitControls`, no drag-to-orbit, no idle auto-rotation - all explicitly removed
from the dependency tree; `drei`'s `OrbitControls` is not imported anywhere in this
project.

**Lighting.** One `DirectionalLight`, fixed direction (`sun.ts`), matching the
design system's "north studio light" angle. Only `intensity` is ever animated
(1.0 <-> 0.7, per F03/F04), never position, colour, or a second light added.

**Materials.**
```
matte.ts        roughness 0.85, metalness 0.0 - the subject's default surface
structure.ts     roughness 0.7, metalness 0.15 - visually distinct "steel" components,
                 still non-reflective
wireframe.ts     1px line material, Prussian or Zinc, no depth fade - F01 entry state
sectionCut.ts    the clipping shader (below)
```
No material in this project uses `metalness > 0.15`, `emissive`, or any texture
implying gloss, chrome, or subsurface scattering - enforced by code review checklist,
since this cannot be linted automatically.

**Shaders.** One custom shader in the project: **the section-cut material.**

Described, not coded: it is a standard matte (Lambert-equivalent) material with a
single additional uniform, `uClipHeight` (a float, updated every frame from
`scrollProgress` while F02-F04 are active). Three.js's built-in clipping-plane
feature (`material.clippingPlanes`) performs the geometric clip. The custom part is
the **cut-face colour**: any triangle newly exposed by the plane - determined via a
second, inverted clipping plane rendering only the cross-section - is shaded flat
in the Fault colour token, with no lighting response, so the cut face reads as a
flat material property rather than a lit surface. This is the only place in the
entire system where a colour is intentionally unlit - a deliberate exception, noted
here so it is not "fixed" in a later lighting pass by mistake.

**GSAP timelines.** `useStation`'s camera tween is a GSAP tween on the camera's
proxy object (position + lookAt target), duration `T.structural` (640ms),
`EASE.settle`, driving `camera.updateProjectionMatrix()` / `invalidate()` on each
tick rather than relying on React re-render.

**Scroll behaviour.** The clipping uniform (`uClipHeight`) is driven by
`scrollProgress` from `useSceneStore`, read inside `useFrame`, not by a GSAP tween -
this is Tier 3 of the animation architecture (R3F `useFrame`, 3D internals only).

**State management.** Reads `station`, `scrollProgress`, `capability` from
`useSceneStore`. Writes nothing except via explicit user-caused station changes
(scroll-triggered in F03/F05/F06, never ambient).

**Assets.** The subject geometry itself - see Data Contract D1, blocked pending
real project material. A placeholder cube (matte material, correct scale) is used
for S4's own acceptance testing so the stage can be verified independent of the
blocked asset.

**Accessibility requirements.** The entire canvas is `aria-hidden="true"`. A
visually-hidden, always-present text description of the subject and its current
state (sectioned/whole, station name) is maintained in the DOM alongside it, updated
via `aria-live="polite"` **only at station changes**, never on every scroll frame -
a live region firing on every `scrollY` delta would be unusable with a screen reader.

**Performance budget.** `frameloop="demand"` - zero renders when nothing has
changed. `invalidate()` called explicitly on: station change, clip uniform update,
material colour change. Idle GPU usage on a locked, unchanging frame: effectively
zero, verified via Chrome's GPU rendering stats.

**Mobile behaviour.** Below capability level 2, the canvas is not mounted at all -
`Stage` renders `null` and each frame renders its static axonometric SVG
alternative instead (see Data Contract D1 for the SVG asset requirement). This is
a hard branch at the React level, not a CSS `display: none` - an unmounted canvas
uses zero GPU; a hidden one does not.

**Acceptance criteria.**
```
[ ] Canvas mounts exactly once for the entire homepage session
[ ] GPU frame time is zero (no draw calls) while station is unchanged and no
    scroll-linked uniform is updating
[ ] Camera never occupies a position outside the five named stations
[ ] No OrbitControls import exists anywhere in the dependency tree
[ ] Section-cut face renders flat Fault, unlit, confirmed against the design system's
    "one permitted use of Fault outside failure states"
```

**Git branch name.** `feat/three-stage`

**Suggested commit message.**
`feat(three): add stage, camera stations, sun, and material library`

**Testing checklist.**
```
[ ] Station transitions tested via keyboard shortcut (dev-only) for all five stations
[ ] Clip plane advances and reverses correctly on scroll up/down
[ ] Material swap (hover highlight, F03) does not trigger a full re-render of the
    React tree - verified via React DevTools Profiler
[ ] Static SVG fallback renders correctly at capability level 3 and 4
[ ] WebGL context loss (simulated) does not crash the page - Stage catches and
    falls back to static SVG
```

---

# PART 2 — FRAMES

## F01 — THE SHEET

**Objective.** Establish pace before the visitor acts. Deliver the load sequence:
title block -> rail -> nav -> plotter headline -> object wireframe-to-solid -> a
2000ms hold -> scroll cue. This is the visitor's entire first impression.

**Components.** `F01Sheet`, `PlotterText` (a one-off reveal component specific to
this frame's headline, not a general primitive - used exactly once on the page per
the motion system).

**Folder location.** `src/features/homepage/frames/F01Sheet/`

**React hierarchy.**
```
<F01Sheet>
  <PlotterText scale="d1">We build systems that hold.</PlotterText>
  <Text scale="m3">SUBJECT - {subject.name} - COMMISSIONED {subject.year} - IN SERVICE</Text>
  <SubjectMount station="iso" initialMaterial="wireframe" />   renders inside <Stage>
                                                                via a portal/context slot,
                                                                not a nested canvas
  <ScrollCue />
</F01Sheet>
```

**Three.js scene.** Subject only, at Station 01 (iso), starting in `wireframe.ts`
material, transitioning to `matte.ts` at 880ms per the load sequence.

**Camera station.** `iso`, locked for the entire frame - no camera movement occurs
until F03.

**Lighting.** Intensity 1.0, fixed, for the entire frame.

**Materials.** Wireframe -> matte transition, a material swap (not a shader
uniform), triggered by the load timeline at t=880ms, duration 640ms via
cross-fading opacity between two mesh instances (wireframe mesh fades out as matte
mesh fades in - avoids attempting to animate a material *type* change directly).

**Shaders.** None beyond the standard material swap above.

**GSAP timelines.** The master load timeline, owned by this frame and exported for
`homepage.timeline.ts` to sequence:
```
t=0        page ground visible, everything else at opacity 0
t=120ms    TitleBlock: opacity 0->1, 240ms
t=240ms    Rail: scaleY 0->1 (transform-origin: top), 400ms, EASE.settle
t=400ms    Navigation rule: scaleX 0->1, 320ms; nav items opacity, 60ms stagger
t=640ms    PlotterText reveal begins: clip-path inset animates 100%->0% left-to-
           right, 480ms, LINEAR (not eased - "a plotter has one speed"); a 1px
           Prussian rule tracks the clip edge and fades over the final 120ms
t=880ms    Subject: wireframe mesh opacity 1->0 / matte mesh opacity 0->1, 640ms,
           EASE.settle (concurrent with subject already visible as wireframe
           since load start)
t=1520ms   HOLD begins - timeline pauses; nothing scheduled until t=3520ms
t=3520ms   ScrollCue: opacity 0->1, 240ms; begins its own repeating 1200ms/3200ms
           cycle, independent of the master timeline from this point on
```
Runs once per session (`sessionStorage` flag). On a flagged return visit, TitleBlock/
Rail/Navigation appear at their end state instantly (opacity 1, no stagger); only
PlotterText and the subject's wireframe->matte transition still play.

**Scroll behaviour.** None until the hold completes - F01 does not respond to
scroll input during the load sequence. Scrolling during the hold is permitted and
immediately hands off to F02 (the hold is a pacing device, not a scroll lock; if the
visitor scrolls at t=1600ms, the page proceeds - it does not force them to wait).

**State management.** Local timeline-completion state (`hasLoaded: boolean`) plus
a `sessionStorage` read/write for the repeat-visit behaviour. Writes `activeFrame:
'F01'` to `useSceneStore` on mount.

**Assets.** The subject model (blocked, Data Contract D1). `PlexMono` and
`Archivo` fonts (already loaded at `S0`/root layout level - F01 does not load fonts
itself, only consumes them).

**Accessibility requirements.**
```
[ ] Real <h1> for the headline text - PlotterText's clip-path animation is purely
    visual; the underlying text node is present and readable from t=0, not revealed
    progressively to assistive tech
[ ] Skip link (from S2) lands focus past this entire load sequence
[ ] prefers-reduced-motion: reduce -> everything above appears at once, opacity only,
    T.quick (160ms), no hold, no wireframe stage (subject appears already matte)
[ ] Subject canvas aria-hidden; visually-hidden description present from t=0
    (not synced to the wireframe->matte transition - the description is static content)
```

**Performance budget.** LCP target 1.4s, satisfied by the `<h1>` text rendering
immediately (it is real text under a CSS clip-path, not an image or canvas-drawn
string - the browser paints it and measures LCP against it regardless of the visual
reveal). Subject model lazy-loaded, non-blocking; sequence proceeds without it if
not arrived by t=880ms, fading in whenever it resolves.

**Mobile behaviour.** Subject occupies 60% of viewport height, headline below it
rather than beside it (this frame is the one exception to "object never changes
size" - its position in the layout, not its 3D scale, changes). Hold duration
unchanged at 2000ms - mobile does not get a shortened pace, per the wireframe spec.

**Acceptance criteria.**
```
[ ] Sequence completes in 1520ms to interactive, verified via Performance timeline
[ ] Hold is measured and exactly 2000ms +/- one frame, not approximate
[ ] Repeat-visit shortcut verified via sessionStorage manipulation in devtools
[ ] No layout shift (CLS) during the entire sequence - title block, rail, and nav
    reserve their layout space from t=0 at opacity 0, they do not enter the layout
    late
```

**Git branch name.** `feat/f01-sheet`

**Suggested commit message.**
`feat(f01): implement load sequence and opening frame`

**Testing checklist.**
```
[ ] Real device test (mid-tier Android, throttled 4G): LCP < 1.8s
[ ] Reduced-motion OS setting: sequence collapses correctly, verified visually
[ ] Repeat-visit path: clear sessionStorage vs. not, both paths verified
[ ] Screen reader: headline announced immediately and correctly, no duplicate
    announcement when the visual reveal completes
[ ] Scroll during hold at multiple timestamps (t=1600, 1800, 2200) hands off to F02
    cleanly with no visual glitch
[ ] Axe scan clean
```

---

## F02 — THE DESCENT

**Objective.** Convert scroll from navigation into instrumentation. A cutting plane
descends through the subject, driven 1:1 by native scroll, with zero copy.

**Components.** `F02Descent`, `ZReadout`.

**Folder location.** `src/features/homepage/frames/F02Descent/`

**React hierarchy.**
```
<F02Descent>
  <SectionPlaneOverlay />   the 1px full-width rule, DOM-rendered, positioned via
                            scrollProgress, NOT a 3D plane mesh - cheaper and
                            crisper as a DOM element than a Three.js plane
  <ZReadout value={z} />    live coordinate label, mono
</F02Descent>
```
The subject itself remains the persistent mesh from `Stage` (S4); this frame only
updates its clipping uniform, it does not mount its own subject instance.

**Three.js scene.** No new geometry. Existing subject mesh, clip plane active.

**Camera station.** `iso`, still locked - camera does not move in this frame (it
is holding from F01, and moves for the first time in F03).

**Lighting.** Unchanged, 1.0.

**Materials.** `sectionCut.ts` becomes active as the clip plane begins intersecting
geometry (previously inactive/at zero height during F01).

**Shaders.** `sectionCut.ts` as specified in S4 - `uClipHeight` now driven live by
this frame's scroll range.

**GSAP timelines.** None - this frame is entirely `useFrame`-driven (Tier 3), not
GSAP-orchestrated, because it is a direct 1:1 scroll-to-value binding rather than a
sequenced timeline. The **only** frame on the homepage with no GSAP timeline.

**Scroll behaviour.** This is the page's entire scrub budget, spent here in full:
```
Scroll distance for this frame: 1.5 viewport heights (desktop and mobile alike)
scrollProgress (0-1 across that distance) maps directly to uClipHeight
  0.0  -> plane above the subject, no clipping visible
  1.0  -> plane has passed fully through, subject shown fully sectioned
Lerp rate: fast enough that scroll lag is imperceptible (<50ms) - this is
  the frame where scroll-feel quality matters most and must be tuned by eye
  on real hardware, not assumed from a formula
Fully reversible: scrolling up raises the plane exactly along the same curve
```
No `preventDefault`, no scroll-jacking - per the rejection of Lenis in the
architecture, native scroll drives this directly.

**State management.** Reads and writes `scrollProgress` (this frame is the primary
writer while it is in view - `useScrollProgress` is scoped to this frame's DOM
bounds via `IntersectionObserver`). `ZReadout`'s displayed value is derived, not
separately stored.

**Assets.** None beyond the persistent subject.

**Accessibility requirements.**
```
[ ] ZReadout is aria-live="off" - a continuously changing number must not be
    announced on every update; a static, complete description of "the system
    shown in cross-section" is available in the persistent hidden description
    from S4, unchanged by this frame's live value
[ ] Full keyboard scroll (arrows, space, page keys) works because scroll is
    native - no additional keyboard handling required or permitted
[ ] prefers-reduced-motion: reduce -> clip plane jumps directly to its end state
    (fully sectioned) with no scrubbed transition; ZReadout shows the final value
    immediately
```

**Performance budget.** Clip uniform update is a single float write per frame,
inside the existing `useFrame` loop - no additional draw calls, no new geometry.
`invalidate()` called every frame *only* while this frame is intersecting the
viewport (via the same `IntersectionObserver` gating `useScrollProgress`) - once
scrolled past, the canvas returns to zero idle render cost.

**Mobile behaviour.** Scroll distance shortened to 1.0 viewport height (from 1.5)
per the wireframe's explicit mobile note - the plane fills the screen better at
narrow viewports and the full 1.5-height distance reads as sluggish on a phone.

**Acceptance criteria.**
```
[ ] Scroll lag measured under 50ms on a mid-tier Android device under 6x CPU
    throttling
[ ] Reversing scroll direction produces exactly the inverse visual state at any
    point in the range - no hysteresis
[ ] No `scroll` event listener exists - verified by the lint rule from S3
[ ] Z-coordinate value is a real, meaningful number tied to the actual subject's
    dimensions, not an arbitrary placeholder range
```

**Git branch name.** `feat/f02-descent`

**Suggested commit message.**
`feat(f02): implement scroll-scrubbed section plane`

**Testing checklist.**
```
[ ] Scroll-feel review on three real devices: high-end iPhone, mid-tier Android,
    a touchpad-driven laptop - trackpad, mouse wheel, and touch swipe all verified
[ ] Fast-flick scroll does not desync the plane from scroll position
[ ] Reduced motion path verified: immediate end-state, no scrub
[ ] Frame budget confirmed under 8ms main-thread while actively scrubbing
    (Chrome Performance panel)
```

---

## F03 — INSIDE

**Objective.** Convert the subject from graphic to evidence - real annotations,
bidirectionally linked to the 3D object, proving the model is real.

**Components.** `F03Inside`, `Annotation` (shared component from S2's sibling
folder `components/Annotation/` - used here and reused in future case-study pages,
which is why it lives in `components/` rather than inside this feature per the
"rule of two").

**Folder location.** `src/features/homepage/frames/F03Inside/`

**React hierarchy.**
```
<F03Inside>
  <AnnotationList>
    {annotations.map(a => (
      <Annotation
        key={a.id}
        label={a.label} value={a.value}
        onHoverChange={(hovered) => setHoveredId(hovered ? a.id : null)}
      />
    ))}
  </AnnotationList>
  <Text as="p" scale="b1">{copy}</Text>
</F03Inside>
```
`hoveredId` is written to `useSceneStore`; the 3D component highlight (inside
`Stage`) reads it and applies the Prussian material swap to the matching mesh part.

**Three.js scene.** Existing subject, now with named sub-components (component IDs
matching the annotation data) available for individual material override.

**Camera station.** Transitions `iso -> section` once, on entry to this frame
(triggered by the same `IntersectionObserver` that scopes this frame's scroll
range), then locks for the remainder.

**Lighting.** Intensity `1.0 -> 0.7`, concurrent with the camera move, 640ms.

**Materials.** Component-level material override on hover/focus: swap to a
Prussian-tinted variant of `matte.ts`, 80ms, both directions (hover and un-hover).

**Shaders.** None new - reuses `sectionCut.ts`, now held at its F02 end-state
(fully sectioned) for the duration of this frame.

**GSAP timelines.**
```
On frame entry (IntersectionObserver threshold 20%):
  Camera: useStation('section', T.structural)          640ms, EASE.settle
  Light intensity: 1.0 -> 0.7                            640ms, concurrent
  Annotations: leader-line draw (SVG stroke-dashoffset) + label opacity,
               60ms stagger, max 6, EASE.settle
  Body copy: opacity only, T.standard (240ms), no travel
Fires once - IntersectionObserver disconnects after first trigger, per the
motion system's "never re-trigger on re-scroll."
```

**Scroll behaviour.** Mode A (Trigger) only - enters once at 20% viewport
intrusion, no scrubbing. Ordinary page scroll continues natively past this frame.

**State management.** `hoveredId` in `useSceneStore`, read by both the DOM
(`Annotation` highlighting its own leader line) and the 3D scene (mesh material
swap) - this is the canonical example of why Zustand was chosen over Context: two
separate reconciler trees, one source of truth, no forced re-render of the R3F tree
on every DOM hover event (only the specific mesh subscribes to the relevant slice).

**Assets.** Annotation content - blocked, Data Contract D2.

**Accessibility requirements.**
```
[ ] Annotations rendered as a real <dl> (description list) - <dt> for label,
    <dd> for value, matching the design system's specified semantic
[ ] Each Annotation is additionally a focusable element (tabindex 0 on the dt/dd
    pairing, or an inner <a> if it deep-links to a case study); focus triggers
    the same 3D highlight as mouse hover
[ ] Visible 2px focus ring on each annotation, offset 2px
[ ] Leader-line SVGs are aria-hidden; the dl itself carries the real content
[ ] Component highlight in 3D is supplementary - nothing here is understandable
    only via the visual link; the dl reads completely and correctly with the
    canvas absent entirely (capability level 3/4)
```

**Performance budget.** Hover-driven raycasting is disabled - the DOM->3D link is
ID-based (state lookup), not a pointer raycast against the 3D scene, which is both
cheaper and more precise than raycasting would be for this specific interaction.

**Mobile behaviour.** Annotations stack vertically beneath the subject rather than
beside it. Leader lines become short vertical stubs rather than diagonal runs.
Bidirectional highlight triggers on tap (first tap highlights + shows detail; the
existing tap-to-navigate affordance if the annotation deep-links is a second tap,
or the deep-link becomes an explicit "View in case study" sub-label to avoid a
tap-ambiguity issue on touch devices).

**Acceptance criteria.**
```
[ ] Camera transitions exactly once, on entry, never re-fires on scroll-back
[ ] Hovering an annotation highlights its 3D component within 80ms, both directions
    verified (3D -> text hover, if pointer enters the 3D region directly, is
    explicitly out of scope per the wireframe - the link is one-directional in
    practice: text drives 3D, not the reverse, since the object has no independent
    hover surface defined)
[ ] Maximum 6 annotations enforced at the component level (a 7th is a content
    error, not a design decision to accommodate)
```

**Git branch name.** `feat/f03-inside`

**Suggested commit message.**
`feat(f03): implement annotated interior view with 3D highlight linking`

**Testing checklist.**
```
[ ] Keyboard-only pass: tab through all annotations, each triggers highlight,
    Enter/Space on a linking annotation navigates correctly
[ ] Screen reader: dl reads correctly and completely with JavaScript/3D disabled
[ ] Camera transition measured at exactly 640ms, EASE.settle curve confirmed
    visually against reference (no overshoot)
[ ] Real annotation data present (see blocker) - do not test against filler
    copy as if it were final
```

---

## F04 — THE TOLERANCES

**Objective.** Build trust through stated limitation. Ground transitions to
Substrate; total silence; four real, stated limits presented as a specification
sheet with no interaction and no CTA.

**Components.** `F04Tolerances`.

**Folder location.** `src/features/homepage/frames/F04Tolerances/`

**React hierarchy.**
```
<F04Tolerances>
  <SectionGround target="substrate" />     shared component from S2's sibling
                                            (components/SectionGround/), drives
                                            the cured<->substrate transition -
                                            shared because F06 reverses it
  <dl>
    <div><dt>Peak throughput</dt><dd>{value}</dd></div>
    ... four rows total
  </dl>
</F04Tolerances>
```

**Three.js scene.** Existing subject, reduced to 30% scale, remains visible at
frame edge - no new geometry.

**Camera station.** `section`, unchanged from F03 - this frame does not move the
camera, per the storyboard's explicit "camera does not move" direction.

**Lighting.** Held at 0.7, unchanged from F03.

**Materials.** No change.

**Shaders.** No change - `sectionCut.ts` remains at its held state.

**GSAP timelines.**
```
On entry (20% intersection):
  SectionGround: background-color cured -> substrate, 400ms, EASE.move
  Text colour: follows 80ms after ground begins (offset, not concurrent) -
               this 80ms offset is the specific detail called out in the
               storyboard and must not be simplified to "concurrent"
  dl rows: opacity only, 60ms stagger, no travel
Sound (if enabled): a hard cut to silence - implemented as an immediate gain-node
  mute, not a fade, distinguishing this from every other transition on the page
```

**Scroll behaviour.** Mode A (Trigger), fires once.

**State management.** None beyond the shared `activeFrame` write. This frame is
explicitly stateless otherwise - no hover state, no interaction state, per its
"the page has stopped asking for anything" design intent.

**Assets.** Tolerance content - blocked, Data Contract D3.

**Accessibility requirements.**
```
[ ] Real <dl> semantic
[ ] Ground colour change raises contrast (14.8:1 on Substrate) - verify this
    frame is, correctly, the most legible on the page
[ ] No information conveyed by the dark ground alone - the same content must
    read identically if capability forces a static, non-transitioning background
[ ] prefers-reduced-motion: ground colour switches instantly, no 400ms transition
```

**Performance budget.** This is the cheapest frame on the page by design - no 3D
state change, canvas render loop returns to idle (`invalidate()` not called)
immediately after the camera/light settled in F03. Verify no unnecessary
`invalidate()` calls leak in from F03's tail.

**Mobile behaviour.** Full-width label/value pairs, label stacked above value
rather than side-by-side - per the wireframe's explicit mobile note, this
transition is described as the most naturally mobile-compatible frame on the page
and requires no structural change beyond stacking.

**Acceptance criteria.**
```
[ ] Zero interactive elements in this frame - no links, no buttons, no hover states
    (a QA pass that finds any interactive affordance here is a defect, not a
    missing feature)
[ ] Ground/text colour offset is measurably 80ms, not simultaneous
[ ] Fourth row ("what we refused") is present and is real content, not a
    placeholder - this is called out in three prior documents as the single
    most persuasive element on the homepage and must not ship provisional
```

**Git branch name.** `feat/f04-tolerances`

**Suggested commit message.**
`feat(f04): implement substrate tolerances specification frame`

**Testing checklist.**
```
[ ] Confirm zero GPU/render activity during this frame via Chrome GPU stats
[ ] Confirm zero interactive elements via automated accessibility tree inspection
[ ] Contrast-check the Substrate/Cured text pairing against the design system's
    documented ratio
[ ] Sound cut (if enabled) is instantaneous, not a fade - verify against a
    waveform capture
```

---

## F05 — THE TURN

**Objective.** Recontextualise everything seen so far. Camera pulls to plan view,
frame expands to full bleed (once, only here), the subject shrinks to a single node
among the full real deployment field.

**Components.** `F05Turn`, `NodeField` (instanced 3D component).

**Folder location.** `src/features/homepage/frames/F05Turn/`

**React hierarchy.**
```
<F05Turn>
  <FrameExpansion>            layout component that widens the content field
                              from bounded 12-col to full-bleed, retracting
                              the Rail - the one use of this component on
                              the entire site
    <Text as="p" scale="d3">Software firms study operations. We run one.</Text>
    <Legend items={legendItems} />
  </FrameExpansion>
  <NodeField />               renders inside <Stage>, instanced mesh
</F05Turn>
```

**Three.js scene.** New geometry added for this frame's duration only: an
`InstancedMesh` representing every real PAR system and Pontis site, plus the
existing subject scaled down to become one instance among them (visually
continuous - not swapped for a different mesh, the same mesh scaled and
repositioned into the field, so it reads as literally the same object).

**Camera station.** `section -> plan`, one transition, 640ms.

**Lighting.** Intensity `0.7 -> 1.0`, concurrent with the camera move.

**Materials.** `matte.ts` for all instances, undifferentiated except the subject
instance, which briefly retains a Prussian outline/marker to remain identifiable as
"the one you were just inside" per the wireframe's legend (diamond marker).

**Shaders.** None new.

**GSAP timelines.**
```
On entry (20% intersection):
  Camera: useStation('plan', T.structural)               640ms
  Light intensity: 0.7 -> 1.0                              640ms, concurrent
  FrameExpansion: bounded -> full-bleed width, Rail retracts    640ms, concurrent
  Sub-bass swell (if sound enabled): 24-60Hz, 640ms rise, concurrent
  NodeField instances: opacity 0->1, single shared uniform (see note below on
                                                              stagger ceiling)
  Sentence + Legend: opacity only, T.standard, entering slightly after the above
All four "concurrent" items fire on the exact same start time and duration -
the storyboard is explicit that "the simultaneity is the entire effect";
staggering these against each other defeats the beat.
```
**Note on stagger ceiling:** the motion system caps stagger sequences at six
elements. The node field will exceed six real nodes. Resolution: nodes are not
individually staggered - the `InstancedMesh` fades in as a single opacity uniform
across all instances simultaneously, satisfying both the visual intent (the field
appears "at once," which is correct for a reveal of scale) and the stagger-ceiling
rule (there is, mechanically, one animated value, not N).

**Scroll behaviour.** Mode A (Trigger), fires once, no scrub.

**State management.** `station` transitions to `'plan'` in `useSceneStore`. Node
hover state (`hoveredNodeId`) is local to this frame - it does not persist or
affect any other frame, unlike F03's `hoveredId` which links two trees; here it
only drives a local label tooltip.

**Assets.** Node field data - blocked, Data Contract D4.

**Accessibility requirements.**
```
[ ] A real, visually-hidden list of every system/site in the DOM, complete,
    screen-reader-navigable - this is the persuasive content of the frame and
    must not exist only as an unlabeled visual field
[ ] FrameExpansion's width change must not cause a focus-trap or scroll-position
    jump - verify keyboard focus position is preserved across the layout shift
[ ] prefers-reduced-motion: no camera move, no frame expansion - the plan view
    and full node list appear as a static state via opacity transition only;
    sub-bass audio does not play regardless of the sound toggle when reduced
    motion is set (reduced motion implies reduced intensity of all sensory
    effects, not motion alone)
```

**Performance budget.** `InstancedMesh` must handle 500+ nodes at one draw call -
verify via a stress-test dataset before real data arrives, so the rendering
approach is proven independent of final count. This is the page's peak GPU
moment; verify it returns to idle immediately once the camera locks at `plan`.

**Mobile behaviour.** **The frame-expansion device is explicitly not attempted at
mobile width** - per the wireframe, it is replaced with a scale-only transition
(the subject shrinks to a node in place, no width/rail change). This is a stated
design decision, not an engineering shortcut: forcing an IMAX-style expansion into
a 375px viewport was called out as "an imitation of an effect rather than the
effect" and should not be attempted even if technically possible via a smaller
percentage change.

**Acceptance criteria.**
```
[ ] Frame expansion, camera move, light change, and audio swell are verified
    frame-synchronised (same start timestamp, same duration) in a recorded
    screen capture, not just "close enough" in code review
[ ] InstancedMesh renders the real node count (once unblocked) at one draw call,
    confirmed via renderer.info.render.calls
[ ] Mobile path uses the scale-only variant, verified on an actual narrow
    viewport, not just a resized desktop browser window
```

**Git branch name.** `feat/f05-turn`

**Suggested commit message.**
`feat(f05): implement plan-view turn with instanced node field`

**Testing checklist.**
```
[ ] Stress test at 500 synthetic nodes to confirm the rendering approach before
    real data is available
[ ] Verify simultaneity of the four concurrent animated properties via recorded
    video, frame-by-frame
[ ] Reduced-motion path: static plan view, full text list, no audio, no expansion
[ ] Mobile scale-only variant reviewed on a real phone in hand
```

---

## F06 — THE RETURN

**Objective.** Camera and frame return home. Subject reassembles. State terms and
refusals presented in an asymmetric (7-vs-4 column) layout - the film's confidence
beat, no motion drama.

**Components.** `F06Return`.

**Folder location.** `src/features/homepage/frames/F06Return/`

**React hierarchy.**
```
<F06Return>
  <SectionGround target="cured" />      the same shared component as F04,
                                        reversed
  <div className={styles.terms}>        7-column
    <Text as="h2" scale="h2">How we work</Text>
    ...
  </div>
  <div className={styles.refusals}>     4-column
    <Text as="h2" scale="h2">What we do not take on</Text>
    <ul>...</ul>
  </div>
</F06Return>
```

**Three.js scene.** Subject reverses from the F05 node-field state back to a single
whole object - the clip plane (held sectioned since F02) is reversed to fully
closed, and the instance scaled back up to its F01 size, at Station 01.

**Camera station.** `plan -> iso`, one transition, 640ms - the return to the film's
opening position.

**Lighting.** Held at 1.0 (already at 1.0 from F05; no further change).

**Materials.** `sectionCut.ts` uniform animates back toward zero (closing), the cut
face colour fading out as the plane covers it - inverse of the F02 shader
behaviour, same shader, opposite direction.

**Shaders.** Reuses `sectionCut.ts` in reverse - no new shader required.

**GSAP timelines.**
```
On entry (20% intersection):
  Camera: useStation('iso', T.structural)                 640ms
  FrameExpansion: reverses to bounded, Rail returns         640ms, concurrent
  SectionGround: substrate -> cured                          400ms, 80ms AFTER
                                                             ground-driving colour
                                                             (mirrors F04's offset,
                                                             see note below)
  Subject: clip uniform -> 0 (closed), scale -> 1.0            800ms
  Terms/Refusals text: opacity, 60ms stagger, max 6 per column independently
```
**Note on the ground-offset direction:** F04 changes ground first, text 80ms
after. The general principle ("ground changes first, content follows") should
hold in both directions for consistency - text does not pre-empt the ground
change on the way back either. Implement ground-first, text-follows in both
directions; this is flagged as a minor interpretive call, not a blocker.

**Scroll behaviour.** Mode A (Trigger), fires once.

**State management.** `station -> 'iso'`. No hover or interaction state owned here.

**Assets.** Terms and refusals content - blocked, Data Contract D5 (engagement
floor specifically).

**Accessibility requirements.**
```
[ ] Two real <section> elements, each with a real <h2>
[ ] Refusal list is a real <ul>
[ ] DOM reading order matches visual order - the 7:4 asymmetry is achieved via
    CSS grid placement (order/grid-column), not by reordering the DOM, which
    would desync visual and screen-reader order
[ ] Reduced motion: instant state change, subject appears whole immediately,
    no reassembly animation
```

**Performance budget.** Colour transition (paint-only) and camera transition
(compositor-only, transform-based) must not be scheduled on the same animation
frame - offset by 80ms as specified, both to match the storyboard's intent and to
avoid stacking two moderate-cost operations simultaneously.

**Mobile behaviour.** Terms then refusals, stacked vertically rather than
side-by-side; asymmetry expressed via measure (line length) rather than column
width, per the wireframe.

**Acceptance criteria.**
```
[ ] Subject visibly and smoothly reassembles - not a hard cut from field-state
    to whole-state
[ ] Column ratio is genuinely 7:4, not a rounded 60:40 approximation, measured
    in the actual grid implementation
[ ] Engagement floor is a real, approved number before this frame ships
    (see blocker) - shipping a placeholder number here is worse than leaving
    the frame unbuilt, since it is a public commercial commitment
```

**Git branch name.** `feat/f06-return`

**Suggested commit message.**
`feat(f06): implement return frame with terms and refusals`

**Testing checklist.**
```
[ ] Reassembly animation reviewed frame-by-frame for visual continuity with
    the F05 exit state (no pop, no mismatch in scale/position at the cut)
[ ] Screen reader reads Terms then Refusals in the correct order, matching
    visual layout
[ ] Confirm the engagement floor value is the founder-approved figure, not a
    development placeholder, prior to merge
```

---

## F07 — TITLE BLOCK

**Objective.** Resolve. Repeat the opening sentence. One control. One email. Full
stop - all motion and audio terminate.

**Components.** `F07TitleBlock` (the homepage-specific closing content;
distinct from the shared `S2::TitleBlock` component, which this frame sits
directly above in document flow).

**Folder location.** `src/features/homepage/frames/F07TitleBlock/`

**React hierarchy.**
```
<F07TitleBlock>
  <Text as="h2" scale="d3">We build systems that hold.</Text>
  <Button tier="primary" href="/commission">Start a commission</Button>
  <a href="mailto:commission@partechnologys.com">commission@partechnologys.com</a>
</F07TitleBlock>
<TitleBlock />     the S2 shared footer component, immediately following
```

**Three.js scene.** Subject held whole at Station 01 - visually identical to F01's
final state. No new geometry, no transition into this frame beyond what F06 already
completed.

**Camera station.** `iso`, already arrived via F06 - this frame performs no camera
work of its own.

**Lighting.** Held at 1.0.

**Materials / Shaders.** No change - everything is already at rest from F06.

**GSAP timelines.** **None.** This is the one frame with no entrance choreography
beyond the primitives' own standard reveal (`Text` opacity, `T.standard`) - per the
storyboard's explicit direction that "every animation on the page has ended" by
this point.

**Scroll behaviour.** None beyond the page naturally ending - no trigger-based
reveal beyond a simple opacity fade-in on intersection, using the shared `useReveal`
hook at its default settings (no bespoke timeline needed).

**State management.** On this frame becoming active, all ticker-driven work
terminates: `useSceneStore`'s `scrollProgress` writer un-subscribes (this was the
last frame that could possibly need it), any `will-change` hints from prior frames
are confirmed removed, and - if sound was enabled - room tone is faded to silence
over 2000ms and the audio context is suspended (not merely muted) to free the
resource.

**Assets.** Real commission email address (present in the wireframe - not
blocked). Everything else in this frame is already-approved content (the repeated
headline) or already-specified shared components.

**Accessibility requirements.**
```
[ ] Button tier="primary" renders a real focusable element pointing at
    /commission - never a div with an onClick
[ ] Email link is a real mailto: anchor, plain text, selectable/copyable -
    not an image, not obfuscated, not rendered only on hover
[ ] Tab order: heading (not focusable, but present) -> commission button ->
    email link -> footer nav -> footer legal links - a clean, final tab sequence
    with no orphaned focusable elements
```

**Performance budget.** This frame is the verification point for the entire page's
"at rest" cost: after this frame settles, Chrome's Performance panel should show
**zero scripted activity** - no rAF callbacks firing, no scroll listeners, no
pending timers. This is an explicit, testable assertion, not a vague aspiration.

**Mobile behaviour.** Unchanged from desktop structurally - this frame was
explicitly called out as needing no mobile-specific adaptation in the wireframe.

**Acceptance criteria.**
```
[ ] Zero animated properties changing 3 seconds after this frame enters view
    (measured, not assumed)
[ ] Button and email link both independently functional and keyboard-reachable
[ ] Audio context is suspended, not merely gained-to-zero, if sound was enabled
    earlier in the session (verify via the Web Audio inspector - a suspended
    context releases the resource; a muted one does not)
```

**Git branch name.** `feat/f07-title-block`

**Suggested commit message.**
`feat(f07): implement closing frame and commission conversion`

**Testing checklist.**
```
[ ] Confirm zero JS activity at rest via Chrome Performance recording, idle
    for 5 seconds after this frame settles
[ ] Full keyboard pass from page top to page bottom, confirming no focus traps
    anywhere across all seven frames combined (this is the final integration
    test for the whole homepage, appropriately run from this frame's checklist)
[ ] mailto: link opens the system mail client correctly across Chrome, Safari,
    Firefox
[ ] Confirm this is visually and posturally a return to F01's resting state -
    side-by-side screenshot comparison
```

---

# PART 3 — CROSS-CUTTING REQUIREMENTS

## Global acceptance criteria (apply to every frame, re-verified at final integration)

```
[ ] No frame instantiates a second rAF loop or scroll listener (S3's ticker only)
[ ] No frame animates a property outside transform/opacity except the explicitly
    documented exceptions: background-color (SectionGround), the clip shader
    uniform, and light intensity - each named above, none undocumented
[ ] Every frame's entrance fires exactly once per session, never re-triggering
    on scroll-back, except F02's scrub which is intentionally continuous and
    bidirectional
[ ] Every frame is independently reviewable in isolation via a dev-only route
    that mounts a single frame with mock data, before full-page integration
[ ] Total homepage JS (excluding 3D payload) remains under 180KB gzipped after
    all seven frames are merged - checked cumulatively, not just per-PR
[ ] Total homepage payload including 3D remains under 2.5MB desktop / 900KB
    mobile-critical-path
```

## Definition of done, per frame

A frame is not complete until all of the following are true, not merely coded:

```
[ ] TypeScript strict, zero errors, zero `any`
[ ] ESLint clean, including custom rules (no raw durations/colours/radii,
    no scroll listeners, no restricted import paths)
[ ] Responsive verified at 1680 / 1280 / 900 / 600 on real rendered output,
    not just DevTools device emulation
[ ] Full keyboard traversal verified
[ ] VoiceOver AND NVDA verified (not one or the other)
[ ] prefers-reduced-motion path verified via actual OS setting
[ ] Lighthouse: Performance > 95, Accessibility 100, on the frame's dev-isolated
    route
[ ] Bundle-size budget check passes in CI
[ ] Reviewed on one real phone in hand, not exclusively in an emulator
[ ] One senior engineer approval, no self-merge
```

---

# APPENDIX — DATA CONTRACTS FOR BLOCKED CONTENT

These schemas let every frame above be built and tested against realistic mock
data now, without waiting for real project material, while guaranteeing the real
data will slot in without a structural change. **Mock data used during
development must be visibly and unmistakably fake** (e.g., `"SUBJECT NAME
PENDING"`) - never a plausible-looking placeholder that could accidentally ship,
per the standing instruction that fabricated specifics are worse than an honest gap.

### D1 — Subject
```
subject: {
  id: string
  name: string
  commissionedYear: number
  status: 'in service' | 'decommissioned'
  modelPath: string          // .glb, draco-compressed
  staticSvgPath: string      // hand-authored axonometric fallback
  scale: number
  dimensions: { x: number, y: number, z: number }   // real, for the Z-readout
}
```
**Blocked:** the real system. Cannot be authored until project material is
provided.

### D2 — Annotations (F03)
```
annotation: {
  id: string
  label: string
  value: string              // real, checkable figure
  componentId: string        // maps to a named sub-mesh on the subject
  linksTo?: string           // optional case-study deep link
}[]              // max 6
```
**Blocked:** real system metrics.

### D3 — Tolerances (F04)
```
tolerance: {
  label: 'Peak throughput' | 'First failure mode' |
         'What we did not build' | 'What we refused'
  value: string
}[]              // exactly 4, in this order
```
**Blocked:** in particular, row 4 - the refusal - cannot be invented.

### D4 — Node Field (F05)
```
node: {
  id: string
  type: 'par-system' | 'pontis-site'
  position: [number, number, number]   // real relative position
  isSubject: boolean                   // true for exactly one node -
                                        // the object shown in F01-F04
}[]
```
**Blocked:** real deployment count and positions.

### D5 — Terms and Refusals (F06)
```
terms: {
  engagementFloor: string      // a real number, founder-approved
  bullets: string[]            // max 3
}
refusals: string[]             // max 5
```
**Blocked:** the engagement floor specifically - a commercial commitment, not a
design placeholder.

---

```
REV 1.0 — Issued 2026-07 — Build Spec Round 1 — Awaiting founder review
STATUS — Ready for Claude Code implementation of S0-S4 and F01/F02/F06/F07
         (buildable now). F03/F04/F05 buildable against mock data per the
         Data Contracts above; NOT to be merged to main with mock data -
         held on their feature branches pending real content.
```
