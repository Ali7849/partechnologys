# PAR TECHNOLOGYS
## Design System — The Bible

Version 1.0 · Design Round 1
Derived entirely from `02-brand-strategy.md`. No decision in this document exists for
aesthetic reasons alone. If a rule here cannot be traced back to the doctrine, it is wrong
and should be removed.

**Governing sentence:** *We build systems that hold.*
**Design translation:** *Everything on screen either carries load or gets cut.*

---

# PART 0 — THE THREE LAWS

Every rule in this document descends from these. When a new situation is not covered, resolve
it against these three.

### Law I — Structure before surface
Hierarchy is built with position, scale, and weight. Never with color, decoration, or effect.
If the layout only works once color is applied, the layout is broken.

### Law II — Nothing floats unless it is temporary
In a structural system, things rest on things. Shadows and blur are reserved exclusively for
elements that will disappear — modals, dropdowns, toasts. A permanent element that floats is
a lie about load.

### Law III — Every mark is a measurement
Rules, numbers, labels, dividers, and indices encode real information or they are deleted.
No decorative line. No sequence numbering on content that is not a sequence. Ornament is the
signature of a company that had nothing to say.

---

# PART 1 — COLOR

## Philosophy

Color in this system is **material, not mood.** Every value is drawn from the physical world
the group works in — cured concrete, galvanized zinc, unlit steel, drawing vellum, Prussian
blue drafting ink. None were chosen because they were attractive.

The system is **almost entirely achromatic.** There is exactly one chromatic accent and one
failure signal. This is not minimalism as a style — it is a consequence of Law I. If color
carried hierarchy, the layout would be doing less work than it should.

**Why not the obvious palette:** construction reads instantly as safety orange, hi-vis yellow,
and hard-hat white. We refuse all three. That palette signals *hazard and site labor* — it is
the visual language of the people being managed, not the people engineering the system. It is
also the cheapest possible read of the category, deployed by every contractor website in
existence. PAR is the engineer's desk, not the site fence.

**Why not pure white:** white is unbuilt. It is a default, an absence, a blank canvas. Our
primary surface is a *cured material* — it has been mixed, poured, and set. It carries a
faint cool green, the color of concrete under north light. Nobody arrives at that color by
accident, which is exactly the point.

## Core palette — six values, no more

| Token | Hex | Name | Material origin | Role |
|---|---|---|---|---|
| `--cured` | `#D9DCD6` | **Cured** | Concrete under north light | Primary surface. The default ground of the entire system. |
| `--vellum` | `#EEEFEA` | **Vellum** | Drafting film | Raised planes. Plates, inputs, tables. The only lighter surface. |
| `--zinc` | `#8D9599` | **Zinc** | Galvanized steel | Secondary text, hairlines, metadata, inactive states. |
| `--substrate` | `#101417` | **Substrate** | Unlit steel | Primary text. Structural dark sections. Never pure black. |
| `--prussian` | `#16344E` | **Prussian** | Drafting ink, 1842–present | The single chromatic accent. Links, active states, focus. |
| `--fault` | `#A83226` | **Fault** | Stress indication | **Failure only.** Never decorative. Never a brand color. |

### Derived values
```
--substrate-90   #1C2226   raised dark surface
--substrate-80   #2A3136   dark hairline
--zinc-60        #B3B9BB   disabled text, faint rule
--zinc-30        #CFD3D2   hairline on Cured
--vellum-hair    #E3E5E0   hairline on Vellum
--prussian-tint  #E4E8EC   selected row, active background
```

### Two absolute rules

**1. Fault is failure.** `--fault` appears on screen only when something has broken, failed
validation, or exceeded tolerance. It is never used for emphasis, never for a badge, never
for a CTA, never for a chart series. A user who sees this color learns instantly that
something is wrong — and that only works if we never lie with it.

**2. Prussian is one thing.** The single accent marks *interactivity and current state*. Not
brand presence. There is no requirement for the accent to appear on every screen. Most screens
should have almost none of it.

## Ratios

The whole system runs on a fixed proportion. Deviating from it is how systems rot.

```
70%   Cured or Substrate        ground
20%   Vellum or Substrate-90    raised planes
 8%   Zinc                      metadata, rules, secondary
 2%   Prussian                  interaction only
 0%   Fault                     until something breaks
```

If a screen has more than 2% Prussian, something is being decorated.

## Light and dark

This is not a theme toggle. **Cured is the system.** Substrate sections are a *deliberate
compositional device* — the load-bearing moments in a page, used two or three times maximum
across an entire site. They mark depth, not preference.

A user-facing dark mode may exist for application interfaces where people work for hours.
It inverts to Substrate ground / Substrate-90 planes / Cured text. Marketing surfaces do not
get a toggle. A brand with two equal appearances has one weak one.

## Contrast floor

| Pairing | Ratio | Use |
|---|---|---|
| Substrate on Cured | 14.8:1 | body text |
| Substrate on Vellum | 16.1:1 | body on plates |
| Zinc on Cured | 3.1:1 | **metadata only, 14px+ , never body** |
| Prussian on Cured | 9.6:1 | links |
| Cured on Substrate | 14.8:1 | inverted body |

Nothing below 4.5:1 carries meaning. Zinc is deliberately quiet and therefore deliberately
limited — it may never be the only carrier of information.

---

# PART 2 — TYPOGRAPHY

## Philosophy

An engineering practice produces three kinds of document: **the drawing, the specification,
and the readings.** They have never shared a typeface, because they do not share a job. Our
system uses three faces for exactly these three roles, and mixing them is a grammatical error,
not a style choice.

## The three faces

### Structural — display
**`Archivo` (variable, width axis)** — grotesque, sturdy, low contrast, engineered rather than
drawn. Used at expanded widths for the largest sizes: at display scale a headline should
*spread*, distributing across the measure the way load distributes across a beam. Set tight,
never loose. Optical tracking corrections at every size — this is non-negotiable and is the
single most common failure in otherwise competent systems.

*Licensed upgrade path:* ABC Monument Grotesk, Suisse Int'l, or GT America.

### Record — body
**`Source Serif 4`** — a low-contrast serif drawn for technical documentation and long reading.

The pairing rationale matters: **serif body is the brand's inheritance promise made visible.**
Serifs are the typography of records, contracts, and specifications — things written to be read
correctly by someone who was not in the room. A sans body would have been the default and
would have said nothing.

*This is not the high-contrast display serif of fashion and editorial.* Source Serif is a
workhorse. It carries authority through durability, not elegance.

### Instrument — utility and data
**`IBM Plex Mono`** — from an explicitly industrial design lineage. Carries every number,
tolerance, coordinate, timestamp, label, eyebrow, index, and unit in the system.

**Rule: numbers that mean something are always mono.** A figure in a proportional face is
prose. A figure in mono is a reading.

## Scale

Two behaviours: text steps finely, display leaps. A single ratio across an entire range
produces either cramped headlines or bloated body copy.

```
Display    D1  clamp(4.5rem, 9vw, 9rem)     Archivo Expanded 500   tracking -0.03em   lh 0.92
           D2  clamp(3rem, 6vw, 5.5rem)     Archivo Expanded 500   tracking -0.025em  lh 0.96
           D3  clamp(2.25rem, 4vw, 3.5rem)  Archivo 500            tracking -0.02em   lh 1.04

Heading    H1  2rem       Archivo 500      tracking -0.015em   lh 1.15
           H2  1.5rem     Archivo 500      tracking -0.01em    lh 1.25
           H3  1.25rem    Archivo 600      tracking  0         lh 1.35

Body       B1  1.125rem   Source Serif 400  lh 1.65   measure 68ch
           B2  1rem       Source Serif 400  lh 1.7    measure 72ch
           B3  0.9375rem  Source Serif 400  lh 1.65   measure 76ch

Instrument M1  0.875rem   Plex Mono 450    tracking 0.02em
           M2  0.75rem    Plex Mono 500    tracking 0.06em   uppercase
           M3  0.6875rem  Plex Mono 500    tracking 0.1em    uppercase
```

## Typographic doctrine

- **Measure is a hard limit.** Body text never exceeds 76 characters. Ever. A wide column is
  the most common signal of a designer who has not read their own page.
- **Two weights per face maximum on any screen.** Weight variety is a substitute for hierarchy,
  not a form of it.
- **Never center body copy.** Centered display is permitted once per page, at most.
- **Never justify.** Rivers are a defect.
- **All-caps only in Instrument, only at M2/M3, always with tracking.** All-caps in a
  proportional face is shouting.
- **Widows are corrected manually** in display type. This is exactly the kind of unseen work
  the brand claims to do. Failing it on our own site is disqualifying.

## The name

`PAR TECHNOLOGYS` — always uppercase, always Archivo, always as a locked unit. Tracking
`0.04em` at all sizes. Never split across lines. Never abbreviated. Never set in the serif.

The deliberate irregularity in the spelling means **every other typographic detail must be
perfect.** One intentional break in a flawless system reads as a signature. The same break in
a loose system reads as a mistake. This single fact raises the standard on kerning, hyphenation,
and hanging punctuation across the entire brand.

---

# PART 3 — SPACING, GRID, LAYOUT

## The module

Base unit: **8px.** Named the **module**. Twelve modules make a **bay** (96px) — the structural
term for the span between columns. All vertical rhythm is expressed in modules; all major
section spacing in bays.

```
--m-05    4px      hairline offsets only
--m-1     8px
--m-2    16px
--m-3    24px
--m-4    32px
--m-6    48px
--m-8    64px
--bay    96px
--bay-15 144px
--bay-2  192px
--bay-3  288px
--bay-4  384px
```

Nothing exists between steps. A 20px gap is a decision nobody made.

## Grid

**12 columns, 24px gutters, 1440px max content width, 1680px max full-bleed.**

Twelve is not a creative choice, it is arithmetic — it divides by 2, 3, 4, and 6. Inventing an
unusual column count to appear original is decoration pretending to be structure.

**The originality is in the rail, not the column count.**

### The annotation rail — signature layout device

Every page carries a **persistent 64px rail** on the left (desktop) holding drawing-sheet
metadata in Instrument type, rotated or stacked: section reference, revision, date, and
sequence position.

```
┌────┬──────────────────────────────────────────────┬────┐
│    │                                              │    │
│ R  │              12-column content field         │ R  │
│ A  │                                              │ A  │
│ I  │   ┌──────┬──────┬──────┬──────┬──────┐       │ I  │
│ L  │   │      │      │      │      │      │       │ L  │
│    │   └──────┴──────┴──────┴──────┴──────┘       │    │
│ 64 │                                              │ 64 │
└────┴──────────────────────────────────────────────┴────┘
     └─ hairline column line, full height ─┘
```

This is taken directly from the margin of an engineering drawing sheet, where revision and
reference information lives outside the drawing field. It satisfies Law III: **it carries real
information — where you are, which revision you are reading — rather than decorating the edge.**

On mobile the rail collapses to a 32px left margin carrying only the section reference.

### Column lines
Vertical hairlines at column boundaries may be revealed at low opacity in structural sections.
Not always on — that becomes wallpaper. Revealed where a section is explicitly about structure.

## Layout doctrine

- **Asymmetry by default.** Content sits on columns 2–8 or 4–12. Full-width centered blocks are
  reserved for genuine full-bleed moments.
- **Vertical rhythm is absolute.** Every baseline lands on a 8px grid. Every one.
- **Sections separated by hairline, not by whitespace alone.** A rule is a statement that one
  thing ended and another began. Whitespace alone is ambiguous.
- **White space is structural, not generous.** It exists to create hierarchy, not to signal
  luxury. Space with no job gets removed.

## Breakpoints

```
site      1680+     full bleed permitted, rail visible
desk      1280      standard, rail visible
tablet     900      rail collapses, 8-column
mobile     600      4-column, 20px margin, 16px gutter
```

---

# PART 4 — DEPTH, ELEVATION, LIGHTING

## Depth philosophy

**Depth in this system is achieved by surface value and hairline — not by shadow.**

This is a direct consequence of Law II. In a structural world, planes rest on other planes.
They are distinguished by material and edge, the way a steel plate sits on concrete: you can
see the join, and there is no gap. The Material Design convention of everything hovering at
different heights above an invisible floor is a fiction we reject.

## Elevation scale

| Level | Surface | Edge | Shadow | Use |
|---|---|---|---|---|
| **E0** | Substrate | — | none | Ground. Deep sections. |
| **E1** | Cured | — | none | Default page surface. |
| **E2** | Vellum | 1px `--zinc-30` | none | Plates, tables, inputs, resting content. |
| **E3** | Vellum | 1px `--zinc` | none | Active or focused plate. Edge darkens; nothing lifts. |
| **E4** | Vellum | 1px `--zinc` | permitted | **Temporary only** — modal, dropdown, toast, tooltip. |

**E4 is the only shadow in the system.**
```
--shadow-temp: 0 24px 48px -12px rgba(16,20,23,0.18),
               0 2px 6px -2px rgba(16,20,23,0.10);
```
Single direction. Cool, not black. If it appears on anything permanent, it is a bug.

## Lighting

**One sun.** A single directional source, high and slightly forward-left — the angle of north
studio light. This applies to shadows, 3D renders, photography selection, and any depth cue in
the system.

- **One direction across the entire brand.** No element is lit from a different angle. Ever.
- **No coloured light.** No rim lights, no gradient meshes, no neon.
- **No specular highlights.** Materials in this system are matte. Gloss reads as consumer
  electronics and cosmetics, not structure.

Rationale: a scene with multiple light sources is a photographed *set*. A scene with one source
is a photographed *object*. We are in the business of objects.

## The edge break

**Every corner in the system has a 2px radius. Nothing has 0. Nothing has more.**

This is the signature detail of the entire design language.

In machining, a truly sharp edge is a defect — it is fragile, dangerous, and indicates the part
was not finished. Every real machined component receives a small chamfer called an *edge break*.
2px is our edge break. It is nearly invisible, and it is on absolutely everything: buttons,
plates, inputs, images, video, modals.

Zero radius would be a brutalist affectation. Eight or twelve would be a SaaS product. Two is
a machined part.

---

# PART 5 — GLASS

## The challenge, stated plainly

**Glassmorphism was requested. As a style, it is rejected.**

It is a 2020–2021 interface trend, it dates any surface it touches to within eighteen months,
and it directly contradicts the brand's central claim. Frosted translucency communicates *this
element carries no weight and obscures what is behind it.* We are the company that says
structure before surface. Blurring the structure to make the surface prettier is the exact
failure we accuse our competitors of.

It also fails on merit: it reduces contrast, it degrades legibility over unpredictable
backgrounds, it costs GPU on mobile, and it is the single most-copied effect in the industry.
The brand promised to be timeless. This is the definition of trendy.

## The reframe — curtain wall

**Glass has a real and honourable place in structural engineering, and it is precise:
curtain wall.** Non-load-bearing infill, hung off a structural frame, always with a visible
mullion, always clearly not carrying the building.

So glass exists in this system, under a rule that makes it meaningful rather than decorative:

> **Translucency is permitted only on elements that carry no information you would be liable
> for, and only on elements that are temporary.**

That is architecturally correct, doctrinally consistent, and it produces restraint automatically.

## Specification

**Permitted on:** navigation bar on scroll, image overlay captions, video controls, the
scrim behind a modal, hover states over 3D canvas.

**Forbidden on:** any card containing data, any pricing surface, any form, any table, any
project evidence, any text a client might rely on, anything permanent.

```
--glass-fill:   rgba(217,220,214,0.72);
--glass-blur:   blur(16px);
--glass-edge:   1px solid rgba(255,255,255,0.5);   /* the glazing bead */
--glass-mullion:1px solid var(--zinc-30);          /* the frame it hangs on */
```

**Non-negotiables:** blur never exceeds 16px. No saturation boost — saturation is the tell of
the trend. Every glass surface has a visible 1px edge, because real glazing has a bead and
frameless glass is the fantasy version. `@supports` fallback to solid `--cured` at 0.94 alpha.
Disabled entirely under `prefers-reduced-transparency`.

**The test:** if it carries information you would be liable for, it is not glass.

---

# PART 6 — 3D LANGUAGE

## Philosophy

The default AI and agency 3D idiom — floating spheres, iridescent blobs, chrome torus knots,
particle fields, gradient meshes — is rejected in full. It is decorative, it is universal, and
it says nothing about the subject.

**Our 3D language is drawing, not rendering.**

## The central call: axonometric, not perspective

Engineering has represented three dimensions in **orthographic and axonometric projection** for
two hundred years, because perspective distorts measurement. Parallel lines stay parallel. A
dimension at the back of the object is the same length as the same dimension at the front. It
is the projection of people who need to *measure* what they are looking at, not be impressed
by it.

**This is the most distinctive decision in the design system.** Almost no competitor will make
it, because perspective is the default of every 3D library and every showreel. Axonometric
instantly reads as *technical drawing* rather than *marketing render*, and it is legible at any
scale on any device.

Perspective is permitted in exactly one circumstance: a photographic sequence where the camera
represents a human eye on a site.

## Materials

```
Base        matte, roughness 0.85, metalness 0.0
Structure   matte, roughness 0.7, metalness 0.15   (steel, still non-reflective)
Wireframe   1px Prussian or Zinc, no depth fade
Section cut Fault — the only place Fault appears outside failure states, because
            a section cut is literally the material being broken open
```

Forbidden: chrome, iridescence, glass refraction, subsurface scattering, emissive materials,
bloom, lens flare, chromatic aberration, depth-of-field as decoration.

## Behaviour

The 3D language expresses three operations, all borrowed from how engineers actually examine
a design:

1. **Wireframe to solid** — the structure exists before the surface. Literally Law I, animated.
2. **Section cut** — a plane slices the object and reveals what is inside. The brand's entire
   argument in one interaction: everyone else shows you the outside.
3. **Exploded assembly** — components separate along a single axis to show how the whole is
   composed, then reassemble.

**One object, examined.** Never a scene of many objects drifting. A single subject, interrogated
properly, is the difference between engineering and wallpaper.

## Budget

3D is a load-bearing claim about our capability, so it is held to a real standard:
- Under 2.5MB total payload, draco-compressed
- 60fps on a mid-tier Android device or it does not ship
- Static axonometric SVG fallback, visually consistent, for reduced-motion and low-power
- Never blocks first contentful paint

A slow WebGL hero on a site that promises systems which hold is a self-inflicted wound.

---

# PART 7 — MOTION

## Philosophy

**Motion in this system communicates mass under control.**

Real structures do not bounce. A crane load, a lift, a hydraulic door — these accelerate,
travel, and *settle*. They never overshoot and spring back, because overshoot means something
was not under control.

Therefore: **no spring. No bounce. No elastic. No overshoot.** Anywhere. This one prohibition
removes ninety percent of the motion vocabulary of contemporary web design, and every removal
is a gain in credibility.

## Timing scale

```
--t-instant     80ms    state feedback: press, toggle, checkbox
--t-quick      160ms    micro-interactions: hover, underline, icon
--t-standard   240ms    element entrance, disclosure, tab change
--t-considered 400ms    section reveal, modal, panel
--t-structural 640ms    page-load sequence, hero orchestration
```

**Nothing exceeds 640ms.** A user who has time to notice the duration is being made to wait.

## Easing

```
--ease-settle: cubic-bezier(0.16, 0.84, 0.24, 1);   entrances — fast start, long settle
--ease-exit:   cubic-bezier(0.4, 0, 1, 1);          exits — accelerate away
--ease-move:   cubic-bezier(0.4, 0, 0.2, 1);        position changes within view
```

Forbidden: `ease-in-out` (mushy, characterless), any curve with a control point above 1
(overshoot), any spring physics library default.

## Distance law

**Entrance travel never exceeds 24px.** Elements arrive from very close, at speed, and settle.
Long-travel entrances — content flying up 80px on scroll — are the most common tell of a
template. Short travel plus correct easing reads as precision; long travel reads as effort.

Fade paired with travel, always. Opacity 0→1 over the same duration.

## Orchestration

Sequences use **60ms stagger**, maximum six elements. Beyond six the sequence becomes a
performance and the user starts waiting.

Page-load runs once, at `--t-structural`, and is never repeated on back-navigation. Scroll
reveals fire once at 20% viewport entry and are never re-triggered — content that re-animates
when scrolled past twice is content that has forgotten the user has been there before.

## Reduced motion

`prefers-reduced-motion` is honoured completely: all travel removed, opacity transitions
retained at `--t-quick`, 3D falls back to its static axonometric render, no parallax, no
autoplay. **This is not an accessibility checkbox — it is Law II applied to people.** Not
everyone can carry the load a motion-heavy page places on them.

## Explicitly forbidden

Parallax on text. Scroll-jacking. Cursor-following blobs. Custom cursors outside the 3D canvas.
Magnetic buttons. Scroll-triggered horizontal sections. Text that assembles letter by letter.
Marquees. Number counters that spin up. Preloaders with progress percentages that are fake.

Every one of these was interesting in 2019 and is now the visual signature of a studio that
learned its craft from other studios' websites.

---

# PART 8 — COMPONENTS

Components are named in the group's structural vocabulary where a real term exists. This is
not whimsy — shared language between design, engineering, and the parent group reduces
translation loss, which is precisely what the brand sells.

## Buttons

Three tiers only. A fourth tier means the page has too many decisions on it.

**Primary — Filled**
`Substrate` fill, `Cured` label, 2px radius, `48px` height, `24px` horizontal padding,
Instrument M1 uppercase, tracking `0.06em`.
Hover: fill lightens to `--substrate-90`, `160ms`. No lift, no shadow, no scale.
Press: fill darkens, `80ms`.
Maximum **one per view.**

**Secondary — Outlined**
Transparent fill, `1px --substrate` border, `Substrate` label, same metrics.
Hover: border and label to `--prussian`.

**Tertiary — Marked**
Label only, `--prussian`, with a `1px` underline offset `4px`.
Hover: underline thickens to `2px` over `160ms`. The underline is the entire interaction.

**Universal button law:** buttons do not move. No translate, no scale, no shadow, no glow.
The surface changes state; the object stays where it was placed. A control that jumps when
approached is a control that cannot be trusted.

## Plates *(cards)*

Not cards. **Plates** — flat elements resting on the surface, bounded by an edge.

```
surface      --vellum
edge         1px --zinc-30
radius       2px
padding      --m-4 (32px), --m-3 on mobile
shadow       none, at any state
```

Internal structure, in fixed order:
```
[Instrument M3, uppercase, --zinc]     label or reference — only if it carries meaning
[Archivo H3, --substrate]              title
[Source Serif B3, --substrate]         body, max 3 lines before truncation
[hairline --zinc-30, full bleed]       divider
[Instrument M2, --prussian]            action
```

Hover (interactive plates only): edge darkens `--zinc-30 → --zinc` over `160ms`. Nothing else.

**Index numbering** (`01 / 02 / 03`) is permitted **only where the content is a real sequence** —
a process with dependent stages, a timeline. Never on a grid of services or features. Applying
sequence notation to unordered content is a false measurement and violates Law III.

## Navigation

Persistent, `72px` tall, hairline bottom rule, `--cured` background.

- Left: `PAR TECHNOLOGYS` lockup, Archivo, tracking `0.04em`
- Right: 4–5 items maximum, Instrument M2 uppercase, tracking `0.08em`
- Active item: `--prussian` with a `1px` underline offset `6px`
- Hover: underline draws left-to-right over `160ms`, `--ease-settle`

**On scroll** it becomes curtain wall — this is glass's primary permitted use. `--glass-fill`,
`blur(16px)`, mullion hairline beneath. Transition `240ms`.

**No hamburger above 900px.** A desktop hamburger hides navigation to protect a layout that
was not designed properly.

**Mobile menu** replaces the full plane rather than floating over it — `--substrate` ground,
items at D3, staggered `60ms`. It is a place you go, not a thing that hovers.

## Footer — the title block

**Signature component.** The footer is an engineering drawing's title block: the standardized
block in the corner of every sheet carrying the information that makes the drawing accountable.

```
┌──────────────────────────────────────────────────────────────────┐
│  PAR TECHNOLOGYS                                                 │
│  We build systems that hold.                                     │
│                                                                  │
├────────────────┬────────────────┬───────────────┬────────────────┤
│ PRACTICE       │ WORK           │ GROUP         │ CONTACT        │
│ ...            │ ...            │ Pontis        │ ...            │
│                │                │ PAR Group     │                │
├────────────────┴────────────────┴───────────────┴────────────────┤
│ REV 2.1 │ ISSUED 2026-07 │ SHEET 01 OF 01 │ a PAR Group Global   │
│                                                     company      │
└──────────────────────────────────────────────────────────────────┘
```

The bottom bar is set entirely in Instrument M3, uppercase, `--zinc`, separated by pipe rules.
It carries a **real revision number and a real issue date**, updated at every deploy. Law III:
this is not styled to look technical — it is technical. A visitor who checks it and finds it
accurate learns more about the company than any headline could.

## Forms

Forms are where a brand's respect for the user is actually measurable.

- **Underline fields, not boxes.** `1px --zinc` bottom rule, no fill, no radius. Less chrome
  around the thing the user is actually doing.
- **Labels are always visible,** above the field, Instrument M2, `--zinc`. Placeholder-as-label
  is forbidden — it destroys context the moment typing starts and fails screen readers.
- **Focus:** rule thickens to `2px --prussian`, `80ms`. Plus a visible focus ring for keyboard
  users, always, never removed.
- **Input text** is Source Serif B2, except numeric, date, reference, and quantity fields which
  are Instrument M1. Data is mono.
- **Validation on blur, never on keystroke.** Correcting someone mid-word is condescending.
- **Errors** are `--fault`, sit beneath the field, and state the correction rather than the
  complaint: *"Enter a work email"* — not *"Invalid input."*
- **Required is written as the word "required"** in Instrument M3, not an asterisk. An asterisk
  is a symbol that requires a legend.
- **Optional fields are marked instead** where most fields are required — less visual noise.

## Icons

- **24px grid, 1.5px stroke, square terminals, no fills, no rounded caps.**
- Drawn on the same 8px module as everything else.
- Source language: **drafting and survey symbols** — section markers, elevation flags, north
  arrows, dimension lines, revision clouds — not a general-purpose UI icon set.
- **Maximum set: 24 icons.** A large icon library means the interface is compensating with
  pictures for words it should have chosen better.
- **An icon never appears without a label** except in universally understood controls
  (close, back, external link).

## Illustration

**PAR does not illustrate. PAR draws.**

There are no characters, no isometric people, no abstract shapes, no spot illustrations, no
hand-drawn accents. The illustrative language of this brand is **technical drawing**:
axonometric assemblies, section drawings, exploded views, dimension lines, node diagrams,
load paths.

Executed in `1px` Zinc or Prussian line on Cured or Vellum. No fills except section hatch.

Rationale: illustration humanizes a brand that needs warmth. This brand does not need warmth —
it needs credibility. Cheerful vector figures on a page selling structural reliability actively
subtract from the argument.

## Photography

**Direction: documentary, available light, mid-task.**

| Do | Never |
|---|---|
| Available light only | Studio lighting, flash, gloss |
| People mid-task, unaware of camera | Anyone looking at the lens |
| Environment visible and legible | Isolated crops on white |
| Wide and mid-shots | Handshakes, boardrooms, laptops on desks |
| Real sites, real screens, real teams | Stock photography, at any price |
| Slight cool cast, muted saturation | Warm filters, HDR, heavy grade |
| Fine grain permitted | Blur-as-mood, bokeh backgrounds |
| 3:2 and 4:5, 2px radius | Circles, arbitrary crops, tilted frames |

Grade: desaturate `-15%`, cool the shadows toward `--substrate`, hold the highlights below pure
white so imagery sits inside the palette rather than punching a hole through it.

The test: **if the photograph could appear on a competitor's site with a different logo, it
does not go on ours.**

---

# PART 9 — MICRO-INTERACTIONS

## Philosophy

**A surface acknowledges. It does not perform.**

Every micro-interaction answers exactly one question: *did the system register what I did?*
Anything beyond that answer is the interface asking for attention it has not earned.

## Standard responses

| Event | Response | Duration |
|---|---|---|
| Link hover | Underline draws left→right | 160ms |
| Plate hover | Edge darkens one step | 160ms |
| Button hover | Fill or border shifts one step | 160ms |
| Press | Fill darkens, no scale, no depression | 80ms |
| Focus | 2px Prussian ring, offset 2px | 80ms |
| Field focus | Underline thickens and turns Prussian | 80ms |
| Toggle | Handle traverses, `--ease-move` | 160ms |
| Copy action | Label swaps to "Copied", reverts after 2s | 160ms |
| Load | Hairline progress rule, top edge, real progress only | actual |
| Disclosure | Height animates, content fades at 60% | 240ms |

## Rules

- **Maximum 2px displacement** on any hover. Nothing moves further to say hello.
- **No scale transforms on interactive elements.** Scaling is the default hover of every
  template on earth.
- **No glow, no halo, no shadow bloom** on hover.
- **The cursor is the system cursor** everywhere except inside a 3D canvas, where it becomes a
  crosshair — a drafting instrument, and functionally honest: it indicates a precision surface.
- **Loading is honest.** If progress cannot be measured, use an indeterminate hairline. Never
  a fake percentage. The brand's fifth value is *say the number* — a fabricated progress bar
  breaks a stated company value in the interface.

---

# PART 10 — QUALITY FLOOR

These are brand requirements, not engineering preferences. A site that promises systems which
hold cannot itself be slow, inaccessible, or fragile. Failing here contradicts the strategy
more severely than any visual mistake could.

**Performance budget**
```
LCP              < 1.8s on 4G mid-tier Android
CLS              < 0.05
INP              < 150ms
Total JS         < 180KB gzipped, excluding 3D
3D payload       < 2.5MB, lazy, never blocking
Fonts            < 180KB, subset, WOFF2, preloaded, font-display: swap
```

**Accessibility floor**
- WCAG 2.2 AA, verified, not assumed
- Every interactive element keyboard-reachable with a visible focus ring
- Focus never removed. Not once. Not for aesthetics.
- Semantic headings in order, correct landmarks, real labels
- `prefers-reduced-motion` and `prefers-reduced-transparency` fully honoured
- Zoom to 200% without loss of function
- No information carried by color alone

**Resilience**
- Functions with JavaScript disabled for all core content
- Every image has meaningful alt text
- Print stylesheet exists — a proposal page that prints badly is a broken proposal

---

# PART 11 — GOVERNANCE

## The five tests

Applied to every new component, page, and asset:

1. **The load test.** Does this element carry information, or does it decorate?
2. **The subtraction test.** Remove it. Is anything worse? If not, it stays removed.
3. **The origin test.** Can this choice be traced to the strategy document? Name the line.
4. **The swap test.** Put a competitor's name on it. Does it still work? If yes, it is generic.
5. **The inheritance test.** Could a designer who has never met us extend this correctly from
   this document alone?

## What would break this system

- Adding a second accent color
- Using Fault for anything other than failure
- Shadows on permanent elements
- A spring or bounce curve entering the motion vocabulary
- Illustration of people or abstract shapes
- Stock photography
- Glass on anything carrying data
- Perspective 3D outside a photographic sequence
- Index numbering on unordered content
- Any radius other than 2px
- Body copy wider than 76 characters
- Removing a focus ring

## Change control

This document carries a revision number, like everything else in the group. Amendments require
a stated rationale traced to strategy, not preference. **A design system that changes because
someone got bored is a design system that was never a system.**

```
REV 1.0 — Issued 2026-07 — Design Round 1 — Awaiting founder review
```

## Open items

- Licensed typeface budget — Archivo and Source Serif are strong open-source choices, but a
  licensed display face (Monument Grotesk, Suisse Int'l) would add distinction if budget allows
- 3D subject: what object gets examined in the hero — should come from real project material
- Photography: does a shoot exist, or do we commission one? Stock is not an option
- Motion prototype required before component build to validate the settle curve at scale
