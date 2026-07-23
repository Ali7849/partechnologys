# PAR TECHNOLOGYS
## Homepage — Wireframe Specification

Version 1.0 · Wireframe Round 1
Converts `01-homepage-storyboard.md` into buildable frames. Seven frames, F01–F07.

```
REV 1.0 · ISSUED 2026-07 · SHEET 01 OF 01 · HOMEPAGE WIREFRAME
```

---

# PART 0 — TWO NOTES BEFORE THE FRAMES

## A wireframe of a film is a shot list, not a box diagram

Conventional wireframes destroy exactly what this page is for. They are static, they describe
containers rather than events, and they invite the reviewer to evaluate the arrangement of
boxes. This document is therefore structured as **frames** — film stills with blocking — and
every frame specifies what is moving, what caused it, and where the camera is.

## "Never use generic grids" — the correction

A twelve-column grid is not generic. **Generic is what most designers do with one.**

Twelve is arithmetic — it divides by 2, 3, 4, and 6. Inventing an unusual column count to
appear original is decoration pretending to be structure, and it is the exact failure this
brand exists to criticise. The originality is not in the substrate. It is in the placement.

What we refuse is the *pattern*: the full-width row of three equal cards, repeated four times
down a page, which is the default output of every design system in existence.

**Seven frames, seven distinct spatial logics, no repetition:**

```
F01  asymmetric opposition       text left 2–6  ·  object right 7–12
F02  the grid is broken          cutting plane spans edge to edge, ignoring columns
F03  annotation-driven           leader lines cross column boundaries into the rail
F04  specification sheet         label/value pairs, hairline-separated, no containers
F05  grid suspended              full bleed, single axis, no columns at all
F06  opposed weights             7 columns against 4, deliberately unbalanced
F07  single axis                 one column, centred, everything else removed
```

**No cards appear anywhere on this page.** Not one. Plates exist in the design system for
tabular and index contexts — `/work`, `/record` — and are deliberately absent here.

## On "award-winning"

Awwwards criteria and enterprise buying criteria overlap in exactly two places: originality of
concept and quality of execution. They diverge on novelty, which awards reward and buyers
distrust.

**This page is built for the buyer.** It will do well on the overlap because conviction is
legible, and it declines the divergence — no novelty for its own sake, no interaction that
exists to be screenshotted. A page that wins an award and loses a $300k commission has failed
at its actual job.

---

# F01 — THE SHEET
### *Beat: Beginning · Camera: Station 01 ISO, locked*

```
┌──┬──────────────────────────────────────────────────────────┬──┐
│  │  PAR TECHNOLOGYS    WORK STANDARD PRACTICE GROUP [COMM] │  │
│  ├──────────────────────────────────────────────────────────┤  │
│ R│                                                          │ R│
│ E│   col 2 ─────────── 6        col 7 ──────────── 12       │ E│
│ F│                                                          │ V│
│  │   We build systems                    ╱▔▔▔▔▔╲            │  │
│ A│   that hold.                        ╱         ╲          │  │
│ ─│   ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                 │  OBJECT   │         │ 1│
│ 0│                                     │  Station  │         │ .│
│ 1│   SUBJECT [SYSTEM]                  │   01 ISO  │         │ 0│
│  │   COMMISSIONED 2023                  ╲         ╱          │  │
│  │   IN SERVICE                           ╲▁▁▁▁▁╱            │  │
│  │                                                          │  │
│  │   │  ← scroll cue, dimension line                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ REV 2.1 │ ISSUED 2026-07-22 │ SHEET 01 OF 09 │ a PAR ... │  │
└──┴──────────────────────────────────────────────────────────┴──┘
   64px rail                                              64px rail
```

**PURPOSE** Set pace before the visitor does anything. Establish that this is a document, not
a landing page.

**BUSINESS GOAL** Bounce-rate filter. A price-shopper leaves in four seconds — desired. A
commissioner recognises seriousness and continues. Measured by scroll-past-F01 rate among
sessions >20s.

**LAYOUT** Full viewport height. Headline D1, Archivo Expanded, columns 2–6. Metadata in mono
M3 directly beneath, hanging on the same left edge. Object occupies columns 7–12, vertically
centred, extending 8% past the right content boundary into the rail zone — the only element
permitted to touch the margin, which makes it read as a physical object placed on the sheet
rather than an image inside a box. Title block fixed to bottom edge, always visible.

**CONTENT**
```
D1    We build systems that hold.
M3    SUBJECT — [SYSTEM NAME] · COMMISSIONED [YEAR] · IN SERVICE
```
No paragraph. No subheading. No badges.

**INTERACTIONS** None available except scroll and navigation. Object is not draggable, not
hoverable, not clickable. **Deliberate** — the first thing a visitor learns is that this page
does not want to be played with.

**ANIMATION** Load sequence per motion system Part 6: title block 120ms → rail 240ms → nav
400ms → headline plotter reveal 640ms → object wireframe 880ms, resolving to solid over 640ms
→ **hold 2000ms, absolute stillness** → scroll cue 3520ms.

**3D** Object at Station 01, true isometric 35.264°/45°. Matte, roughness 0.85, metalness 0.0.
One directional light, fixed. Wireframe→solid transition on entry. No idle rotation, no
mouse-parallax, no ambient float.

**CTA** None. F01 has no call to action, which is itself the positioning statement.

**PERFORMANCE** LCP target 1.4s = the headline, which is text and renders without the 3D asset.
Object lazy-loads and is never render-blocking; if it has not arrived by 880ms the sequence
continues without it. Model budget ≤1.2MB draco-compressed. Fonts preloaded, subset, WOFF2.
Render-on-demand — a locked camera on a static scene costs zero GPU after the entry transition.

**ACCESSIBILITY** `<h1>` carries the real headline. Object is `aria-hidden` with an adjacent
visually-hidden description naming the system and its function. Skip-to-content as first
tab stop. Reduced motion: everything appears at once, opacity only, no hold, no wireframe stage.
Scroll cue hidden from assistive tech — it is a visual affordance, not information.

---

# F02 — THE DESCENT
### *Beat: Curiosity · Camera: Station 01, holding*

```
┌──┬──────────────────────────────────────────────────────────┬──┐
│  │                                                          │  │
│  │ ═══════════════════════════════════════════════════════  │  │  ← the plane
│  │                              SECTION A-A · Z +1840       │  │     ignores the grid
│ R│                                                          │ R│
│ E│                      ╱▔▔▔▔▔▔▔▔▔╲                         │ E│
│ F│                    ╱   material   ╲                      │ V│
│  │                   │    above the    │                    │  │
│ ─│                   │  plane clipped  │                    │ 1│
│ 0│                   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← Fault red       │ .│
│ 2│                   │                 │     cut face       │ 0│
│  │                    ╲   remaining   ╱                     │  │
│  │                      ╲___________╱                       │  │
│  │                                                          │  │
│  │                    [ no copy in this frame ]              │  │
└──┴──────────────────────────────────────────────────────────┴──┘
```

**PURPOSE** Convert scroll from navigation into instrumentation. Create curiosity with zero
copy.

**BUSINESS GOAL** Time-on-page and depth. This frame is where a visitor decides the site is
unusual. Measured by F02→F03 completion rate; a drop here means the descent is too long.

**LAYOUT** **The signature spatial move of the page: the cutting plane spans the full viewport
width, edge to edge, ignoring the grid and the rail entirely.** It is the only element on the
site permitted to break the column system — because a cutting plane does not respect drawing
margins. Object centred, columns 4–10. Z-readout right-aligned to the plane's end. No other
elements exist in this frame.

**CONTENT** One label only: `SECTION A-A · Z +[live value]`. The value is the content.

**INTERACTIONS** Scroll drives the plane's Z position, scrub-linked, fully reversible, 1:1 with
native scroll. Momentum, flick, and stop all behave exactly as the OS dictates. **This is the
page's entire scrub budget — spent once, here.** No hover targets. No clicks.

**ANIMATION** Plane descent bound to scroll position, ≤200ms lag. Clipping is instant and hard
at the plane — no fade, no dissolve. Cut face renders Fault. Relay tick on each component
crossing (sound on only).

**3D** Real-time clipping plane on the object geometry, single plane, single axis. Camera
absolutely locked. Total scroll distance for the descent: **1.5 viewport heights.** Longer
becomes a chore; shorter and the sensation does not establish.

**CTA** None.

**PERFORMANCE** Clipping plane is a shader uniform update, not geometry rebuild — one uniform
per frame, negligible cost. Single rAF loop shared with the page. Scroll read via
`IntersectionObserver` for activation, `scrollY` inside rAF for position. Never a scroll
listener. Frame budget ≤8ms main thread.

**ACCESSIBILITY** Reduced motion: plane jumps directly to the section state of F03 with no
descent. Non-visual users receive a text equivalent describing the system's internal
composition, present in the DOM. The Z-readout is `aria-live="off"` — a rapidly changing
number announced continuously would be hostile. Full keyboard scroll support (space, arrows,
page keys) works because scroll is native and untouched.

---

# F03 — INSIDE
### *Beat: Discovery · Camera: Station 01 → 04 SECTION, one move, 640ms*

```
┌──┬──────────────────────────────────────────────────────────┬──┐
│  │                                                          │  │
│  │   col 2 ──────────── 7          col 8 ───────── 12       │  │
│ R│                                                          │ R│
│ E│    ┌───────────────┐                                     │ E│
│ F│    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│──────── DISPATCH CORE               │ V│
│  │    │  ┌─────────┐  │         14,200 events/day · p99 240ms│ │
│ ─│    │  │         │  │                                     │ 1│
│ 0│    │  │ INTERNAL│  │──────── FIELD SYNC                  │ .│
│ 3│    │  │         │  │         offline-first · 72h buffer  │ 0│
│  │    │  └─────────┘  │                                     │  │
│  │    │               │──────── AUDIT LEDGER                │  │
│  │    └───────────────┘         append-only · 9-year        │  │
│  │                                                          │  │
│  │    Everyone will show you the outside. This is the        │  │
│  │    inside of a system that has been running someone's     │  │
│  │    operation since 2023.                                  │  │
└──┴──────────────────────────────────────────────────────────┴──┘
        leader lines cross the column boundary — deliberately
```

**PURPOSE** Convert the object from graphic to evidence. Prove the numbers are real.

**BUSINESS GOAL** Credibility transfer. This is where a technical evaluator decides whether to
keep reading. Measured by `/standard` and `/work` click-through originating from this frame.

**LAYOUT** **Annotation-driven, not container-driven.** Object columns 2–7. Labels columns
8–12. Leader lines run *across* the column boundary, which is the point — in a real drawing an
annotation belongs to the component, not to a layout region. Body copy sits below on columns
2–8, serif, max 68 characters. **No boxes anywhere.** Each annotation is a hairline, a mono
label, and a mono value. Nothing is contained.

**CONTENT** Four annotations maximum, drawn from the real system. Then one sentence of serif
body — the first prose on the page.

**INTERACTIONS** Hovering an annotation raises its leader line to Prussian and highlights the
corresponding component in the 3D object, 80ms, both directions. **The only bidirectional
interaction on the page** — text and object are linked, which proves the model is real rather
than an image. Clicking an annotation deep-links to the relevant case study section.

**ANIMATION** Camera Station 01→04, 640ms, ease-settle, one arc, then locked. Light 1.0→0.7,
intensity only. Annotations stagger 60ms, maximum six, each leader line drawing outward from
component to label, 240ms. Body copy: opacity only, no travel.

**3D** Sectioned state held. Camera locked at Station 04 for the remainder of this frame.
Component highlight = emissive off, Prussian material swap, 80ms.

**CTA** Tertiary only: annotations are links. No button.

**PERFORMANCE** Annotation hover uses a pre-baked component ID map, not raycasting per frame —
raycast only on `pointermove`, throttled to 60ms. Leader lines are SVG in the DOM, not 3D
geometry, so they render as text-crisp at any DPI and cost nothing.

**ACCESSIBILITY** Annotations are real `<a>` elements in a `<dl>` — description list is the
correct semantic for label/value pairs. Fully keyboard-navigable; focus triggers the same 3D
highlight as hover. Focus ring visible, 2px Prussian, offset 2px. Values are readable text, not
canvas-rendered. Contrast: mono labels at Zinc are 14px minimum and never carry unique
information alone — every value is also in the visually-hidden description.

---

# F04 — THE TOLERANCES
### *Beat: Trust · Camera: Station 04, locked · Ground: Substrate*

```
┌──┬──────────────────────────────────────────────────────────┬──┐
│▓▓│▓▓▓▓▓▓▓▓▓▓▓▓▓▓ SUBSTRATE GROUND ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│▓▓│
│  │                                                          │  │
│ R│   TOLERANCES · SECTION A-A                               │ R│
│ E│   ────────────────────────────────────────────────────   │ E│
│ F│                                                          │ V│
│  │   Peak throughput          18,000 events/day             │  │
│ ─│   ────────────────────────────────────────────────────   │ 1│
│ 0│   First failure mode       field sync buffer at 96h      │ .│
│ 4│   ────────────────────────────────────────────────────   │ 0│
│  │   What we did not build    native mobile client — the    │  │
│  │                            client's crews work in a       │  │
│  │                            browser and we did not add a   │  │
│  │                            platform they'd maintain       │  │
│  │   ────────────────────────────────────────────────────   │  │
│  │   What we refused          real-time GPS on operatives.   │  │
│  │                            They asked. We declined and    │  │
│  │                            explained why. They agreed.    │  │
└──┴──────────────────────────────────────────────────────────┴──┘
        object holds at reduced scale, upper right, still cut open
```

**PURPOSE** Build trust through stated limitation. The highest-value frame on the page.

**BUSINESS GOAL** Qualification and differentiation simultaneously. A commissioner who reads
*what we refused* and continues is pre-sold on the engagement model. Measured by
`/commission` conversion rate among sessions that reached F04 — expect a multiple of the
site average.

**LAYOUT** **Specification sheet, not cards.** Label column 2–4, value column 5–10, separated
by full-bleed hairlines at every row boundary. Rows have unequal heights because the content
has unequal length, and they are not normalised — a spec sheet does not pad its rows to match.
Object reduced to 30% scale, columns 10–12, still sectioned. No containers, no backgrounds,
no elevation. Four rows only.

**CONTENT** Four label/value pairs, all real. The fourth is the most important sentence on the
homepage and cannot be invented.

**INTERACTIONS** **None.** No hovers, no links, no buttons. The page has stopped asking for
anything, which is exactly why this frame is persuasive.

**ANIMATION** Ground `--cured → --substrate`, 400ms, scroll-driven at the boundary. Text colour
follows 80ms later — ground changes first, then what sits on it. Rows appear on a 60ms stagger,
opacity only, no travel. Camera does not move. **Sound: complete silence.**

**3D** Object held, sectioned, reduced. Light 0.7. Nothing moves.

**CTA** None. Deliberate — a call to action here would break the frame's entire mechanism.

**PERFORMANCE** No 3D state change; render loop idle. This is the cheapest frame on the page
and it follows the most expensive one, which is how the scroll budget stays balanced.

**ACCESSIBILITY** Semantic `<dl>` again. Substrate ground raises contrast to 14.8:1 — this
frame is the most legible on the page, which is appropriate for its content. Colour transition
respects `prefers-reduced-motion` by switching instantly. No information conveyed by the dark
ground alone.

---

# F05 — THE TURN
### *Beat: Wonder · Camera: Station 04 → 02 PLAN · Frame expands to full bleed*

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│         ▪  ▪                        ▪                          │
│                    ▪                                           │
│              ▪         ◆        ▪            ▪                 │
│                                                                │
│         ▪              ▪   ▪                                   │
│                  ▪ ▪                    ▪                      │
│                                                                │
│              Software firms study operations.                  │
│              We run one.                                       │
│                                                                │
│   ◆ [SYSTEM NAME]   ▪ PAR SYSTEMS · n   ▪ PONTIS SITES · n     │
└────────────────────────────────────────────────────────────────┘
     rail recedes · grid suspended · full bleed · once per page
```

**PURPOSE** Recontextualise everything already seen. The film's turn.

**BUSINESS GOAL** Deliver the USP as a felt experience rather than a claim. This frame answers
*will you exist in five years* without stating it. Measured by `/group` click-through.

**LAYOUT** **Grid suspended entirely.** Full bleed to 1680px, rail recedes to the edge, no
columns. The plan field occupies the full frame. One sentence, serif, D3, centred on the
optical axis — the only centred type on the page and the only permitted use of centring in the
system. Legend in mono along the bottom edge.

**CONTENT** The node field is real: every deployed PAR system and every Pontis site, at true
relative position, same line weight, same scale. The single line of serif. A legend with real
counts. **If the field is genuinely sparse, we show it sparse** — six honest nodes are more
persuasive than forty invented ones, and a visitor can check.

**INTERACTIONS** Hovering any node reveals its label in mono at the cursor position. Nodes are
not clickable on the homepage — the depth lives in `/work`. Restraint here is what stops this
frame becoming a toy.

**ANIMATION** Camera Station 04→02, 640ms. Light 0.7→1.0, intensity only, same 640ms. Frame
expansion 640ms. Sub-bass swell entering after four seconds of silence. All three fire on the
same curve — **the simultaneity is the entire effect.** Nodes appear on 60ms stagger, opacity
only. The examined object scales down into position rather than cutting — it must be legible
as the same object.

**3D** Orthographic plan view. Flat. Nodes are instanced geometry, one draw call regardless of
count. No terrain, no map tiles, no globe. A plan drawing, not a visualisation.

**CTA** None. The frame is the argument.

**PERFORMANCE** Instanced rendering handles 500+ nodes at one draw call. Frame expansion is a
transform on the container, compositor-only. This is the page's peak GPU moment and it lasts
640ms; the render loop returns to idle immediately after the camera locks.

**ACCESSIBILITY** The node field has a text equivalent: a real list of systems and sites in the
DOM, visually hidden, screen-reader complete. Reduced motion: no camera move, no expansion —
the plan view appears as a static state with opacity transition. The sub-bass is absent unless
sound is explicitly enabled. Sudden large motion is the most common accessibility failure in
award sites; this one is gated three ways.

---

# F06 — THE RETURN
### *Beat: Confidence · Camera: Station 02 → 01 ISO · Ground returns to Cured*

```
┌──┬──────────────────────────────────────────────────────────┬──┐
│  │                                                          │  │
│ R│  col 2 ───────────────── 8        col 9 ──────── 12      │ R│
│ E│                                                          │ E│
│ F│  HOW WE WORK                    WHAT WE DO NOT TAKE ON   │ V│
│  │  ─────────────────────          ───────────────────      │  │
│ ─│                                                          │ 1│
│ 0│  Engagements begin at           Consumer apps.           │ .│
│ 6│  [FLOOR].                       Marketing sites.         │ 0│
│  │                                 Equity-only work.        │  │
│  │  Senior engineers only.         Anything whose first     │  │
│  │  No junior team, no bench.      question is price.       │  │
│  │                                 Anything that needs to   │  │
│  │  Documented so completely       be finished in three     │  │
│  │  that our absence costs         weeks.                   │  │
│  │  you nothing.                                            │  │
│  │                                                          │  │
│  │        ╱▔▔▔▔╲  object reassembling, Station 01           │  │
└──┴──────────────────────────────────────────────────────────┴──┘
        7 columns against 4 — deliberately unbalanced
```

**PURPOSE** State terms and refusals before asking for anything.

**BUSINESS GOAL** Self-qualification. Filters price-shoppers before they occupy a calendar,
and converts an awkward third-call conversation into a first-visit fact.

**LAYOUT** **Opposed, unequal weights.** Terms on columns 2–8 (seven), refusals on 9–12 (four).
Not a two-column split — an asymmetry that gives the refusals a tighter, denser, more clipped
measure, which is how a refusal should read. Serif body left, mono right. Hairline rule under
each heading only. Object reassembling, small, bottom of frame.

**CONTENT** Engagement floor — a real number. Three terms. Five refusals.

**INTERACTIONS** None until the object completes reassembly. Then F07's control becomes
available. **The page will not accept a commission until it has finished making its argument.**

**ANIMATION** Camera Station 02→01, 640ms. Frame contracts to bounded, rail returns.
Ground `--substrate → --cured`, 400ms. Object reassembles: cut plane rises out, material
closes, Fault red disappears as the section face is covered, 800ms. Room tone returns.

**3D** Reverse of F02's clip. Same shader, inverse direction.

**CTA** Deferred to F07. Not repeated here — one primary action per page, appearing once.

**PERFORMANCE** Colour transitions on background and colour properties are paint-only and cheap
at this scale, but must not animate alongside the camera move; they are offset 80ms precisely
so the two costs do not land on the same frame.

**ACCESSIBILITY** Two `<section>` elements with real `<h2>`s. Refusal list is a `<ul>`. Reading
order matches visual order — the asymmetry is CSS grid placement, not DOM reordering. Reduced
motion: instant state change, object appears whole.

---

# F07 — THE TITLE BLOCK
### *Beat: Conversion · Camera: Station 01, locked permanently · All motion stopped*

```
┌──┬──────────────────────────────────────────────────────────┬──┐
│  │                                                          │  │
│ R│                                                          │ R│
│ E│                    ╱▔▔▔▔▔▔▔╲                             │ E│
│ F│                   │  OBJECT │  whole · still · one sun   │ V│
│  │                    ╲▁▁▁▁▁▁▁╱                             │  │
│ ─│                                                          │ 1│
│ 0│              We build systems that hold.                 │ .│
│ 7│                                                          │ 0│
│  │              [ START A COMMISSION ]                      │  │
│  │                                                          │  │
│  │              commission@partechnologys.com               │  │
│  │                                                          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  WORK        STANDARD      PRACTICE       GROUP          │  │
│  │  ...         ...           ...            ...            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  REV 2.1 │ ISSUED 2026-07-22 │ SHEET 01 OF 09 │ PRIVACY  │  │
└──┴──────────────────────────────────────────────────────────┴──┘
```

**PURPOSE** Resolve. Offer one action. Stop.

**BUSINESS GOAL** Conversion, and reputation on exit. Measured by commission submissions and
direct email — the second is expected to carry the largest engagements and is untracked by
design.

**LAYOUT** **Single axis.** Everything on one centred column, columns 4–10. The only frame on
the page with no asymmetry — resolution expressed spatially. Object above, sentence, control,
email. Then the four-column footer matching primary navigation exactly, then the title block bar.

**CONTENT** The opening sentence, repeated. It is the seventh encounter with the idea and the
first repetition of the words, and it means something different now. One control. One real
email address in plain text.

**INTERACTIONS** Button: detent behaviour. Entry 80ms, exit 160ms, fill shift only. No movement,
no scale, no glow, no magnetic lean. Email is a real `mailto:`, selectable, copyable.

**ANIMATION** **None.** Every animation on the page has ended. Room tone fades to silence over
2s. Nothing pulses, nothing counts down, nothing re-enters the viewport.

**3D** Object whole at Station 01, identical to F01's final state. The film ends where it
opened. Render loop idle — zero GPU.

**CTA**
```
PRIMARY     [ START A COMMISSION ]  →  /commission
DIRECT      commission@partechnologys.com  →  plain text, no obfuscation
SECONDARY   footer: download the standard  →  the highest-volume conversion,
                                              deliberately placed below the primary
```

**PERFORMANCE** All rAF loops terminated. All `will-change` removed. 3D context retained but
not rendering. Page at rest should register zero main-thread activity.

**ACCESSIBILITY** Button is a real `<button>` inside a `<form>`, or an `<a>` to `/commission` —
never a styled `<div>`. Focus ring visible. Footer navigation is a `<nav>` with a label. The
title block is `<footer>` with real, accurate `<time>` elements. Tab order ends at the primary
action.

---

# PART 8 — MOBILE

Award sites die on mobile, and enterprise buyers read on phones between meetings. Mobile is not
a reduction; it is a different cut of the same film.

```
F01   Object above, headline below. Object 60% viewport height.
      Hold retained at 2000ms — the pace is the brand and it survives.
F02   Descent retained but shortened to 1.0 viewport height.
      Plane still spans edge to edge. This frame works better on mobile
      than desktop, because the object fills the screen.
F03   Annotations stack beneath the object. Leader lines become
      short vertical stubs. Bidirectional highlight retained on tap.
F04   Full-width label/value pairs, label above value. Hairlines retained.
      Unchanged in substance — a spec sheet is naturally mobile.
F05   ⚑ Frame expansion has no meaning at mobile width. Replaced with
      a scale change: the object shrinks to a node in place. The turn
      survives; the IMAX device does not, and forcing it would be
      an imitation of an effect rather than the effect.
F06   Terms then refusals, stacked. Asymmetry expressed by measure
      width rather than columns.
F07   Unchanged.
```

**Rail** collapses to a 32px left margin carrying the frame reference only.
**Parallax** disabled entirely. **3D** loads at reduced polygon count, or falls to the static
axonometric SVG below a capability threshold. **Total mobile payload budget: 900KB** including
the object.

---

# PART 9 — MEASUREMENT

The page is not judged on time-on-site or bounce rate in aggregate. It is judged on whether
the right people go deep.

```
PRIMARY     commission submissions from sessions that reached F04
            — the only number that matters

SECONDARY   standard downloads              → inheritor persona engaged
            F02 → F03 completion rate       → is the descent the right length
            /work entries from F03          → is the evidence landing
            returning sessions              → commissioner journey is 3–6 visits;
                                              first-visit conversion is not the goal

IGNORE      aggregate bounce rate           → we are filtering deliberately
            average session duration        → a 4s exit by a price shopper is a success
            scroll depth as a headline      → depth without the right visitor is noise
```

**Diagnostic thresholds.** If F02→F03 completion falls below 60%, the descent is too long —
shorten it before changing anything else. If F04 is reached but `/commission` does not convert,
the engagement floor is wrong, not the page.

---

# BLOCKERS

Unchanged from the storyboard, now with the specific fields that must be filled:

1. **The subject** — which real system. Drives F01 metadata, F03 annotations, F04 tolerances.
2. **The refusal** — F04, row four. The single most persuasive element on the page.
3. **The node field** — F05. Real counts of PAR systems and Pontis sites.
4. **The floor** — F06. A number.
5. **The email** — F07. A real address that a real person reads.

**F01, F02, F06 and F07 can be prototyped now.** F03, F04 and F05 cannot be filled by me and
should not be filled with placeholders that later get replaced — the entire page depends on a
visitor being able to check the numbers.

```
REV 1.0 — Issued 2026-07 — Wireframe Round 1 — Awaiting subject
```
