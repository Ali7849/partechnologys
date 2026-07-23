# PAR TECHNOLOGYS
## Motion System — Storytelling Through Movement

Version 1.0 · Motion Round 1
Subordinate to `01-design-system.md`, which is subordinate to `02-brand-strategy.md`.
Where this document appears to contradict either, this document is wrong.

**Governing sentence:** *We build systems that hold.*
**Motion translation:** *Stillness is the default. Motion is an event, and events are earned.*

---

# PART 0 — THE ARGUMENT ABOUT "CINEMATIC"

The brief asks for cinematic. Accepted — but the word has to be defined correctly first,
because the industry uses it to mean the opposite of what it means in film.

**In web design, "cinematic" has come to mean: many things moving, continuously.**
Parallax layers, drifting particles, sweeping camera pushes, elements flying in from every
edge. That is not cinema. That is a showreel — the visual language of a demo, which by
definition has nothing to demonstrate.

**In actual filmmaking, the most cinematic directors use the least motion.**
Kubrick's locked-off symmetrical frames. Deakins' single, slow, motivated moves. Villeneuve
holding a static composition for eleven seconds until the audience leans in. Fincher's refusal
to cut until the scene has finished its work. The grammar of cinema is **the hold, the reveal,
and the cut** — not the transition effect.

A film that moved the camera constantly would be exhausting and cheap-looking, and everyone
in film knows this. The web learned the opposite lesson from other websites.

> **Our definition: cinematic means composed, motivated, and held.
> Every move has a reason a director could state out loud. Nothing drifts.**

This is also the only definition compatible with the brand. A company selling structural
reliability cannot present itself on a surface that will not sit still.

## The reference set

Not Active Theory. Not showreels.

- **Industrial test footage** — high-speed capture of structures under load. One subject,
  one lighting setup, absolute stillness until the moment of consequence.
- **Surveying and drafting** — the pen plotter drawing a line at constant velocity. Motion
  that produces a record rather than an impression.
- **Deakins and Villeneuve** — one motivated move per scene, held long, single light source.
- **Precision instruments** — the detent of a well-made dial. Feedback at arrival, not
  seduction on approach.

---

# PART 1 — THE FOUR LAWS OF MOTION

### Law I — Stillness is the default state
A page at rest is completely still. Nothing breathes, drifts, pulses, floats, or shimmers.
Ambient motion without cause is not atmosphere — it is a system that cannot stop fidgeting.
**If nothing has happened, nothing moves.**

### Law II — Motion is caused
Every movement is traceable to an event: the user scrolled, entered, clicked, focused, or
the system changed state. Motion with no cause is decoration, and decoration on a structural
brand is a confession.

### Law III — Mass is honest
Everything on screen behaves as though it has weight. It accelerates, travels, and **settles.**
It never bounces, springs, overshoots, or wobbles. Overshoot means the load was not under
control, and this brand's entire promise is that the load is under control.

### Law IV — The user drives
Scroll belongs to the user. We do not take it, hijack it, delay it, redirect it, or reinterpret
it. Motion responds to the user's input; it never replaces it.

---

# PART 2 — NARRATIVE STRUCTURE

Motion here is dramaturgy, not embellishment. A page is a three-act argument, and each act has
a distinct motion register.

```
ACT I — ASSERTION            ACT II — EVIDENCE           ACT III — CONSEQUENCE
stillness                    examination                 resolution

One object. One claim.       The object is opened.       The frame closes.
Camera locked.               Camera moves between        Camera returns to
Nothing moves for 2s         measured stations.          Station 01.
after load completes.        Section cuts reveal         Motion stops entirely.
                             internals.

Register: HELD               Register: PROCEDURAL        Register: SETTLED
Motion budget: 1 event       Motion budget: 3–4 events   Motion budget: 1 event
```

**Act I is the whole strategy in motion form.** After the load sequence resolves, the page
holds — completely static — for two full seconds before any scroll cue appears. Every
competitor fills that moment with something moving, because silence reads as risk. Holding it
is the most confident thing the site can do, and it is free.

**Act II is the brand's central argument, animated.** Everyone shows you the outside. We cut
the object open. The section-cut reveal is the single most important motion moment in the
entire system — it is the difference between marketing and engineering, expressed as movement.

**Act III stops.** No parting flourish, no final animation, no call-to-action that pulses.
The argument was made; the page rests.

---

# PART 3 — SCROLL BEHAVIOUR

## Doctrine

**Scroll is the user's instrument. We read it; we never take it.**

| Forbidden, absolutely | Why |
|---|---|
| Scroll-jacking | Removes control from the user. Violates Law IV. |
| Horizontal scroll sections | Breaks the input model people already learned. |
| Momentum or smooth-scroll libraries | Adds latency to the one interaction that must feel instant. Native scroll is already correct. |
| Scroll-triggered autoplay video with sound | Never. |
| Progress-locked sections | The user cannot leave. Hostile. |
| Re-triggering reveals on re-scroll | Content that forgets you have been there before. |

## Scroll drives state, not speed

Two permitted modes:

**Mode A — Trigger (default, 95% of cases)**
Element enters at 20% viewport intrusion → animates once → is never touched again.
`opacity 0→1`, `translateY 24px→0`, `--t-standard` (240ms), `--ease-settle`.

**Mode B — Scrub (rare, deliberate)**
Scroll position is bound directly to the progress of a *real sequence* — the section-cut plane
travelling through the 3D object, or an assembly separating along its axis.

Scrub is permitted **once per page, maximum.** It requires:
- A sequence with genuine start and end states, not a loop
- Full reversibility — scrolling up runs it backwards, exactly
- Under 200ms of scroll-lag; anything more feels broken
- A discrete fallback under reduced motion (jump to end state)

Scrub is the most expensive motion device we own. Spending it twice devalues it.

## Stagger

Grid and list reveals stagger at **60ms**, maximum **six elements.**

Beyond six the sequence becomes a performance and the user begins waiting for the interface to
finish talking. Items seven onward appear with the sixth.

## The scroll cue

One only, in Act I, appearing after the 2-second hold. A `1px` Zinc rule, `32px` tall, whose
lower `8px` travels down and fades, `1200ms`, repeating every `3200ms`. It disappears
permanently on first scroll and never returns.

Not a bouncing chevron. Not a mouse-with-a-wheel icon. A dimension line.

---

# PART 4 — CAMERA

## The central rule: the camera has stations, not freedom

In perspective 3D, cameras dolly, orbit, and push freely — which is why every 3D website feels
like the same drifting hover shot. Our projection is axonometric (see design system, Part 6),
and axonometric drawing has **named, measured views.** A drawing sheet does not contain a
camera path. It contains Plan, Elevation, Section, and Isometric.

**The camera moves only between defined stations. It is never free, never handheld, never
continuously drifting.**

```
STATION 01 — ISO         default. 35.264° / 45°. True isometric. Act I and Act III.
STATION 02 — PLAN        top orthographic. Used for system and network views.
STATION 03 — ELEVATION   front orthographic. Used for scale and stack.
STATION 04 — SECTION     cut plane view. The Act II payload.
STATION 05 — DETAIL      framed on one component, orthographic. Used once, for the
                         single most technically credible detail on the page.
```

## Movement between stations

- **Duration `--t-structural` (640ms)**, `--ease-settle`
- Interpolated along a defined arc, never a straight line through the object
- **One station change per scroll section.** Never two moves in one viewport.
- Between moves, the camera is **locked.** Absolutely still. No idle orbit, no breathing,
  no slow drift, no mouse-parallax on the camera.

## Forbidden camera behaviour

Free orbit on drag as a default state. Mouse-position camera parallax. Continuous rotation.
Auto-orbit while idle. Dolly zoom. Shake. Handheld simulation. Any camera move without a
scroll or click that caused it.

**The single most common failure in 3D web design is a camera that never stops moving.** It
reads as a screensaver. A locked camera reads as an instrument.

## When perspective is permitted

Exactly one circumstance: a photographic or video sequence where the camera represents a human
eye standing in a real place. A person on a site sees in perspective. A drawing does not.

---

# PART 5 — TRANSITIONS

## Scene transitions *(route change)*

**Cut, don't dissolve.**

Film learned this a century ago: the cut is the confident transition, the dissolve is the
apologetic one. Long cross-fades between pages are how a site says *please wait, something is
happening.*

```
Outgoing:  opacity 1→0, translateY 0→-8px    160ms   --ease-exit
[hard cut — no overlap]
Incoming:  opacity 0→1, translateY 12px→0    240ms   --ease-settle
Total:     400ms
```

**Persistent elements do not transition.** Navigation, rail, and title block remain fixed
across route changes. They are the frame; only the content field changes. This is the drawing
sheet metaphor working: you are turning to a new sheet in the same set, not entering a new
building.

**Shared-element transitions** are permitted in exactly one case: a project thumbnail expanding
into that project's page. It must be the *same image*, exactly matched, `400ms`, `--ease-move`.
A morph between two different images is a lie about continuity.

## Section transitions *(within page)*

Sections are separated by hairline rules, not by animated wipes.

**Transitions into Substrate sections** are the one exception, and they are the compositional
punctuation of the whole page. Entering a dark section, the background transitions
`--cured → --substrate` over `400ms`, `--ease-move`, driven by scroll position at the boundary.
Text colour transitions on the same curve, offset `80ms` — the ground changes first, then what
sits on it. This ordering is small and it is the difference between deliberate and automatic.

Maximum **two** Substrate sections per page. A third makes them meaningless.

---

# PART 6 — LOADING SEQUENCE

## Doctrine

The load sequence is the brand's first sentence. It runs once per session, never on
back-navigation, and it is **honest** — the fifth company value is *say the number*, and a
fabricated progress bar breaks a stated company value in the first three seconds of contact.

## The sheet issue

The page assembles the way a drawing sheet is issued: frame first, reference second, content
last. It is not a preloader with a logo. It is the sheet arriving.

```
0ms      Ground: --cured. Nothing else. Held.

120ms    TITLE BLOCK — footer rule and revision data fade in, bottom edge.
         The accountability information arrives before the claim.
         opacity 0→1, 240ms

240ms    RAIL — left annotation rail draws downward, top to bottom.
         scaleY 0→1, transform-origin top, 400ms, --ease-settle

400ms    NAVIGATION — hairline rule draws left to right, then items fade.
         Rule: scaleX 0→1, 320ms. Items: opacity, 60ms stagger.

640ms    HEADLINE — plotter reveal (Part 11). Single line, left to right.

880ms    OBJECT — 3D subject fades in at Station 01 as wireframe,
         resolves to solid over 640ms. Wireframe before solid:
         Law I of the design system, animated.

1520ms   HOLD. Complete stillness. Two full seconds.

3520ms   Scroll cue appears.
```

Total to interactive: **1520ms.** If the 3D asset has not loaded by 880ms, the sequence
proceeds without it and the object fades in whenever it arrives. **The sequence never waits
for an asset** — that is how sites end up with fake progress bars.

## Subsequent loads

Session-flagged. Second visit: title block, rail, and navigation appear instantly; only the
headline and object animate. Returning visitors are not made to watch the overture again.

## Reduced motion

Everything appears at once, `--t-quick` opacity only, no travel, no wireframe stage, no hold.

---

# PART 7 — CURSOR

## Doctrine

**The cursor belongs to the operating system. We borrow it in one place, and only because
there it becomes an instrument.**

Custom cursors — the trailing blob, the expanding circle, the inverted-difference dot, the
"VIEW" bubble that follows the pointer — are the single most recognizable tell of a studio
that learned design from other studios' portfolios. They also break accessibility, lag on
low-end hardware, and hide the system cursor's own state information.

## Specification

**Everywhere:** the native system cursor. `default`, `pointer`, `text`. Unmodified.

**Inside the 3D canvas only:** a crosshair. Not decorative — a drafting instrument, and
functionally honest, because it marks a precision surface where position means something.

```
Crosshair    two 1px --prussian rules, 24px, 4px centre gap
Readout      Instrument M3, --zinc, offset 12px lower-right,
             live axonometric coordinates
Transition   opacity only, 80ms, on canvas enter/exit
Behaviour    the crosshair does NOT lag, ease, or trail the pointer.
             1:1 with the cursor, every frame.
```

The readout is the point. A crosshair alone is styling; a crosshair carrying live coordinates
is an instrument, and it satisfies Law III of the design system — every mark is a measurement.

**Hidden entirely** on touch devices, on `prefers-reduced-motion`, and when the pointer is
coarse.

---

# PART 8 — HOVER, AND THE MAGNETIC QUESTION

## Magnetic effects are refused

The brief requests them. They are declined, and this one is not negotiable, because it breaks
a law rather than a preference.

Magnetic buttons — elements that lean toward the cursor as it approaches — are prohibited by
the design system's universal button law: **buttons do not move.** A control that reaches
toward you before you have decided to press it is a control that is soliciting. On a brand
whose emotional territory is *relief* and whose personality is *composed*, an interface that
lunges at the pointer is off-character in the most literal way.

They also do measurable harm: they shift the hit target away from where the user aimed, which
is a Fitts's Law violation dressed as delight. And they are, at this point, the default hover
effect of the entire award-site category — the opposite of distinctive.

## What replaces it: the detent

There is a correct mechanical answer, and it is better than magnetism.

A precision dial does not pull your hand toward the next position. It **snaps crisply into
place when you arrive** — the detent. Feedback at arrival, not seduction on approach. That is
the physical vocabulary of instruments, which is our vocabulary.

```
Approach     nothing. No anticipation, no lean, no scale.
Entry        the state changes instantly and completely, 80ms, one step.
             Fill, border, or underline. Never position, never scale.
Exit         reverts, 160ms — slightly slower than entry.
```

**Entry is faster than exit.** This is the whole feel of the system in two numbers: the
interface responds immediately and lets go reluctantly. It reads as attentive rather than eager.

## Hover table

| Element | Response | Duration |
|---|---|---|
| Link | Underline draws left→right | 160ms |
| Plate | Edge darkens one step | 160ms |
| Button | Fill or border shifts one step | 80ms in / 160ms out |
| Nav item | Underline draws, offset 6px | 160ms |
| Image | Nothing. Images do not respond to hover. | — |
| Table row | Background to `--prussian-tint` | 80ms |
| 3D object | Node under crosshair takes Prussian, readout updates | 80ms |

**Maximum displacement on any hover: 2px.** Nothing scales. Nothing glows. Nothing lifts.

---

# PART 9 — PARALLAX AND DEPTH MOVEMENT

## The technical position

Parallax is the apparent displacement of objects at different depths as the viewpoint moves.
It is a **perspective phenomenon.** Our 3D projection is axonometric, where parallel lines stay
parallel and there is, by definition, **no parallax at all.** The design system's most
distinctive decision structurally forbids it in 3D space.

So parallax survives only as a 2D compositional device, and only under strict limits.

## Permitted

**Layer offset on scroll**, on image and 3D containers only:

```
Foreground content    1.0    (moves with scroll, normally)
Media container       0.92   (8% differential — maximum)
Background plane      0.96
```

**8% is the ceiling.** Above roughly 10% the effect becomes visible as an effect, and the
moment a user perceives parallax rather than depth, it has failed. The correct parallax is one
nobody notices.

Compositor-only: `transform: translate3d()`. Never `background-position`, never `top`.

## Forbidden

Parallax on text — at any ratio, in any context. Multi-layer parallax scenes. Mouse-position
parallax on the hero, the camera, or any element. Parallax on mobile, entirely — it costs
frames on the devices least able to spare them and the effect is invisible at that viewport.

---

# PART 10 — PHYSICS, PARTICLES, MORPHING

## Physics

**No physics engines. No springs. No damping libraries.**

Spring systems produce overshoot, and overshoot is the visual statement *this was not under
control.* Every off-the-shelf spring default in every animation library ends with a small
wobble. That wobble is charming on a consumer app and disqualifying here.

What replaces it: **implied mass through duration.** Larger elements take longer, within the
fixed scale. Not because a simulation says so, but because a director decided.

```
Small  (button, icon, label)     --t-quick        160ms
Medium (plate, input, row)       --t-standard     240ms
Large  (section, modal, panel)   --t-considered   400ms
Structural (page, hero, camera)  --t-structural   640ms
```

Everything decelerates into its final position via `--ease-settle` and **arrives exactly once.**
No settle wobble. No secondary motion. No follow-through.

## Particle systems

**A particle that represents nothing is snow.**

Ambient particle fields — drifting dots, connected-node backgrounds, floating geometry — are
prohibited. They are Law II violations by definition: motion with no cause. They are also the
most-copied 3D background of the last decade.

**Particles are permitted only when each particle is a datum.**

If a point on screen represents a real thing — a site, a vehicle, a sensor, a transaction, a
node in a client's actual system — then it may exist and it may move, because its movement
carries information. A field of 400 points where each point is a real asset in a real fleet is
not a particle system. It is a chart.

```
Permitted   each element maps 1:1 to a real data point
            movement encodes a real change of state
            a legend exists somewhere on the page
Forbidden   count chosen for visual density
            movement generated by noise, drift, or randomness
            connecting lines drawn by proximity rather than relationship
            anything described internally as "atmosphere"
```

## Morphing

Permitted only when both states are **genuinely the same object in different configurations.**

```
Permitted   wireframe → solid          (same geometry, different representation)
            assembled → exploded        (same components, different positions)
            chart state A → state B     (same dataset, different filter)
            icon → its own active state (same path, two configurations)
Forbidden   logo morphing into a shape
            one icon becoming a different icon
            arbitrary SVG path interpolation for delight
            text morphing into an object
```

A morph asserts *this is still the same thing.* Asserting that falsely is the motion equivalent
of a false measurement.

---

# PART 11 — TEXT ANIMATION

## Doctrine

**Text does not perform. Text is revealed.**

Character-by-character assembly, letter scrambling, word-by-word fade-up, typewriter effects,
scrolling number counters — all prohibited. They delay comprehension in order to draw attention
to themselves, which inverts the entire purpose of typography. A headline that assembles itself
is a headline that made the reader wait to find out what it said.

## The plotter reveal — signature text motion

The only display-scale text animation in the system.

A pen plotter draws by moving a pen at constant velocity from one end of a line to the other.
It is how engineering drawings were produced for forty years, it is mechanical rather than
decorative, and it is not the character-stagger that every other site uses.

```
Mechanism    clip-path inset, revealing left → right at constant rate
Speed        constant. No easing on the wipe itself — a plotter has one speed.
Duration     480ms per line, 80ms overlap between lines
Edge         a 1px --prussian rule travels at the leading edge and
             fades over the final 120ms
Scope        D1 and D2 only. Once per page. Never on body copy.
```

The travelling rule is the detail that makes it read as *drawing* rather than *wiping.* Without
it, it is a mask animation. With it, it is a plotter.

## Everything else

```
H1–H3        opacity + translateY 16px, 240ms, --ease-settle
Body         opacity only, 240ms. Body text does not travel.
Instrument   opacity only, 160ms.
Numbers      appear at final value. Never count up. A number that spins is a number
             the reader cannot trust while it is spinning.
```

Body copy animating on scroll is one of the most common and least examined habits in the
industry. Prose is for reading. Reading begins the moment it is on screen.

---

# PART 12 — OBJECT, 3D, LIGHTING, ENVIRONMENT

## The three object operations

The 3D subject performs exactly three moves, all borrowed from how engineers actually examine a
design. There is no fourth.

**1. Wireframe → Solid** — `640ms`
Structure resolves into surface. Design system Law I, made visible. Used once, on load.

**2. Section cut** — `800ms`, scrub-linked
A plane travels through the object; material behind it is clipped; the cut face renders in
`--fault`, the one permitted use of that colour outside failure states, because a section cut
*is* the material being broken open.

**This is the most important motion in the entire brand.** It is the argument — everyone shows
you the outside — executed as movement rather than claimed as copy. It gets the page's only
scrub budget and it is never used decoratively.

**3. Exploded assembly** — `640ms`, single axis, 60ms component stagger
Components separate along one axis to show composition, then reassemble on reverse scroll.
Never radial. Never rotational. Real exploded drawings separate along an axis of assembly.

## Lighting animation

**The sun does not move.** One directional source, fixed angle, for the life of the brand.

Light may change **intensity** to signal state — never direction, never colour, never count.

```
Permitted    intensity 1.0 → 0.7 when an overlay opens        240ms
             a single cut face receiving marginally more light
Forbidden    moving lights, rotating rim lights, colour shifts,
             pulsing, breathing, flicker, god rays, volumetrics,
             lens flare, bloom, any second light source
```

A moving light is a set being dressed. A fixed light is an object being examined.

## Background and environment

**Backgrounds do not move. The environment does not move. Nothing ambient exists.**

No gradient meshes drifting. No noise fields. No animated grain. No floating geometry. No
aurora. No slow-rotating anything. No "subtle" ambient motion of any kind — *subtle* is the
word used to defend motion that has no other justification.

**One exception:** a background carrying live system data — a real feed from a real deployed
system, updating at its real cadence. Then the movement is a reading, not a mood. It requires
a visible label identifying what it is showing. Unlabelled, it is atmosphere, and atmosphere
is prohibited.

---

# PART 13 — PERFORMANCE

Performance is a brand requirement, not an engineering preference. A site promising systems
that hold cannot itself stutter. **A dropped frame is an off-brand event.**

## Frame budget

```
Target                 60fps sustained, mid-tier Android
Main-thread per frame  < 8ms
Animated properties    transform and opacity ONLY
Never animated         width, height, top, left, margin, padding,
                       box-shadow, filter, background-position
```

Any property outside `transform` and `opacity` triggers layout or paint and will drop frames
on the devices our clients' operators actually carry.

## Discipline

- `will-change` applied on interaction start, removed on completion. Never left in CSS.
- Maximum **4** concurrently animating elements. Beyond that, stagger or cut.
- `IntersectionObserver` for all triggers. Never scroll listeners.
- All scroll-linked work inside `requestAnimationFrame`, single rAF loop for the page.
- 3D renders on demand. **No idle render loop** — when the camera is locked and nothing has
  changed, the frame is not redrawn. A static scene should cost zero GPU.
- Animation pauses entirely when the tab is hidden.

## Degradation ladder

Applied automatically, top to bottom, based on device capability and connection:

```
1  Full        3D, scrub section cut, plotter reveal, parallax
2  Reduced     3D static at Station 01, no scrub, no parallax
3  Static      axonometric SVG replaces 3D entirely, opacity transitions only
4  Minimal     no motion whatsoever, full content, full function
```

**Level 4 is a complete, credible experience.** Not a fallback — a version. If the page is
unconvincing without motion, the motion is carrying an argument the content should have made.

## Reduced motion

`prefers-reduced-motion: reduce` maps directly to Level 3, plus:
- All travel removed; opacity only, `--t-quick`
- Scrub sequences jump to end state
- Plotter reveal becomes an instant appearance
- Crosshair disabled
- Load sequence: everything appears at once

This is not a compliance item. It is Law II applied to people: not everyone can carry the load
that a motion-heavy page places on them.

---

# PART 14 — GOVERNANCE

## The four tests

Applied to every proposed motion, before it is built:

1. **The cause test.** What event caused this? Name it. "It looks better" is not an event.
2. **The subtraction test.** Remove it. Is anything less clear? If not, it stays removed.
3. **The director's test.** State the reason out loud in one sentence, as a director would to a
   crew. If the sentence is embarrassing, the motion is wrong.
4. **The swap test.** Would this same motion work on a competitor's site? If yes, it is generic
   and it goes.

## Forbidden — the complete list

Scroll-jacking · smooth-scroll libraries · horizontal scroll sections · magnetic elements ·
custom cursors outside the 3D canvas · cursor trails · parallax on text · mouse-position
parallax · spring and bounce curves · overshoot of any kind · ambient particle fields ·
connected-node backgrounds · drifting gradient meshes · animated grain · idle camera orbit ·
free camera drag · dolly zoom · camera shake · moving or coloured lights · bloom · lens flare ·
letter-by-letter text assembly · typewriter effects · text scramble · counting numbers ·
body copy travel on scroll · logo morphing · arbitrary path morphing · hover scale · hover glow ·
hover lift · re-triggering scroll reveals · fake progress bars · marquees · autoplay with sound

Every one of these was interesting once. All of them are now the visual signature of a studio
that learned motion from other studios' websites rather than from film, machinery, or drawing.

## Change control

```
REV 1.0 — Issued 2026-07 — Motion Round 1 — Awaiting founder review
```

Amendments require a stated cause traced to strategy. A motion system that grows by accretion
is a motion system that will eventually contain everything on the forbidden list.

## Open items

- The 3D subject remains undefined. The section cut — the most important motion in the brand —
  cannot be storyboarded until we know what object is being cut open. **This should come from
  a real project.**
- Motion prototype required before component build: the settle curve and the detent must be
  validated at full scale on real hardware, not judged from a specification.
- Plotter reveal requires a velocity test at D1 across viewport widths — constant rate means
  a wide headline takes measurably longer, and the ceiling needs to be set by eye.
