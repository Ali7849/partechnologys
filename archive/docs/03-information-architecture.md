# PAR TECHNOLOGYS
## Information Architecture

Version 1.0 · IA Round 1
Subordinate to `02-brand-strategy.md`. Every page below exists because the strategy requires
it. Any page that cannot name the strategic line it serves is deleted.

**Governing principle:** *A page earns existence through evidence, not intent.*

---

# PART 0 — THE CENTRAL DECISION

## There is no Services page

This is the single most consequential call in the architecture, and it is the difference
between reading as a $30k agency and a $300k engineering practice.

**Agencies lead with services because they are selling capacity.** A list of things they can
do, priced by the hour, differentiated by nothing. Every competitor's list is the same list:
web, mobile, cloud, AI, UI/UX, consulting. A visitor who reads it learns only that you are
available.

**Practices lead with evidence because they are selling judgment.** What you actually built,
what constrained it, what you refused to do, and what happened afterwards. A visitor who reads
that learns whether you can think.

The commissioner persona — owner or COO, previously burned by a failed rollout — does not
arrive asking *what do you offer.* They arrive asking *have you done this before, under
conditions like mine, and did it survive.* A services list cannot answer that question. A
single case study answers it completely.

**Capability is therefore not a destination. It is an attribute of evidence** — it surfaces
inside case studies, sector filters, and the engagement model, always attached to a real
instance of having done it.

## The second decision: the doctrine is public

The strategy commits to publishing our methodology as an open standard (Horizon Two), and
states that documentation is a moral position rather than a deliverable.

**So it gets a top-level slot: `/standard`.**

No competitor in this category publishes their engineering doctrine. It is the single most
defensible content asset available to this brand, and it does four jobs at once:
it serves the *inheritor* persona who writes our long-term reputation; it makes the premium
price legible before a sales conversation; it is the only genuinely linkable, citable asset
we will own; and it converts the roadmap's Horizon Two goal from an aspiration into a URL.

---

# PART 1 — THE SITEMAP

```
/                                    HOME · the assertion
│
├── /work                            EVIDENCE · the spine of the site
│   └── /work/[project]              ── the atomic unit
│
├── /standard                        DOCTRINE · how we build, published
│   └── /standard/[chapter]          ── versioned chapters
│
├── /practice                        THE FIRM · who, how we engage, what we refuse
│   └── /practice/careers            ── talent conversion
│
├── /group                           ORIGIN · Pontis, PAR Group Global
│
├── /record                          POST-MORTEMS · technical notes and failures
│   └── /record/[note]
│
├── /commission                      CONVERSION · start an engagement
│
└── /legal/privacy                   FOOTER ONLY
    /legal/terms
```

**Nine templates. Maximum depth: three levels.**

Enterprise sites rot at level four. If content cannot be reached in three clicks from home,
it will not be read, and if it will not be read it should not have been written.

---

# PART 2 — WHY EACH PAGE EXISTS

Each page has **one job** and **one primary action.** A page with two jobs has none.

---

### `/` — HOME
**Job:** Make one claim, prove it once, and route by intent.
**Serves:** all three personas, first contact.
**Primary action:** proceed to `/work`.
**Strategy line:** *"We build systems that hold."*

Home is Act I. One object, examined. One sentence. One piece of evidence — a single named
project with a real outcome, not a logo wall. Then three routes: *see the work*, *read the
standard*, *start a commission* — mapped to commissioner, inheritor, and ready-buyer.

**Home must not:** list services, carry a testimonial carousel, display a logo grid, count up
statistics, or contain more than one call to action per screen.

**The refusal statement appears on home.** A short line naming what we do not take on. Stating
a refusal on the highest-traffic page is the strongest possible price and quality signal, and
it costs us only the clients we did not want.

---

### `/work` — EVIDENCE
**Job:** Prove capability through instances, and let a visitor find themselves in one.
**Serves:** commissioner, primary.
**Primary action:** enter a case study.
**Strategy line:** *"Evidence density. One project shown in forensic depth outperforms twelve logos."*

An index of every engagement, filterable by **sector** and by **system type**. Each entry
carries the one fact that matters — what it does and what it survived — not a category tag.

**Sectors are filters, not pages.** A sector page with two thin projects behind it damages
credibility more than its absence. When a sector holds three or more substantial engagements,
it earns its own page and enters the sitemap. *A page earns existence through evidence.*

**Work must not:** contain an unnamed client without a stated reason for anonymity, or show a
project we would not discuss in detail on a call.

---

### `/work/[project]` — THE CASE STUDY
**Job:** Let a commissioner conclude, without being told, that we can carry their weight.
**Serves:** commissioner primarily, inheritor secondarily.
**Primary action:** `/commission`.

**This is the atomic unit of the entire site.** Everything else exists to deliver a visitor
here or to support what they read once they arrive. Five excellent case studies are worth
more than every other page combined.

**Template — brand-specific, not Challenge / Solution / Result:**

```
01  THE LOAD          What had to hold, and what failure would have cost.
                      Stated in the client's terms and in money or hours.

02  THE CONSTRAINT    Conditions that shaped the build — legacy systems,
                      regulation, field conditions, budget, uptime.
                      The constraints are the interesting part.

03  THE STRUCTURE     Architecture. Named, diagrammed axonometrically,
                      explained to a technical reader without condescension.

04  THE TOLERANCES    Stated limits. Throughput, failure modes, what breaks
                      first, what we deliberately did not build.
                      Value #2 made public.

05  WHAT WE REFUSED   Something the client asked for that we declined,
                      and why. This section builds more trust than any
                      other on the page, because nobody fakes it.

06  THE OUTCOME       Real numbers, real dates, measured after the fact.
                      Including anything that went wrong.

07  THE HANDOVER      Who operates it now. What they were given.
                      Whether they still need us. Value #4, proven.
```

Section 05 and section 07 are the two nobody else has. They are the entire argument.

---

### `/standard` — THE DOCTRINE
**Job:** Prove intellectual seriousness and make the premium price self-evident.
**Serves:** inheritor primarily; commissioner's technical advisor.
**Primary action:** download the standard *(email capture — the highest-value, lowest-friction
conversion on the site)*.
**Strategy line:** *"Publish the doctrine as a public standard."*

A versioned public engineering standard, carrying a revision number and issue date exactly like
the footer title block. Chapters cover the structural method, tolerance practice, handover
requirements, and refusal criteria.

Consequences: the technical evaluator who reads this becomes our advocate inside the client
organization before we have met them. It is also the only asset here that other people will
link to and cite — which is the entire long-term search position.

**Standard must not:** be gated behind a form to read. Only the PDF is exchanged for an email.
Gating the doctrine of a brand that claims documentation as a moral position would be
self-refuting.

---

### `/practice` — THE FIRM
**Job:** Answer *who are these people, how do we work together, and what does it cost.*
**Serves:** commissioner, late stage.
**Primary action:** `/commission`.

Contains the people, the engagement model, the stages of work, and — critically — **the
engagement floor.**

**We state a minimum engagement size.** Not a price list, not packages, not "starting from"
theatre. A single sentence naming the smallest engagement we take. This is uncommon and it is
correct: it filters price shoppers before they occupy a calendar, it signals confidence, and
it converts an awkward third-call conversation into a first-visit fact. A firm that will not
say its floor is a firm that negotiates.

The refusal list appears here in full.

**Practice must not:** become an About page. Nobody has ever been convinced by a founding story
and a set of adjectives. This page is about how the engagement actually runs.

---

### `/practice/careers` — TALENT
**Job:** Recruit senior engineers who will not respond to a normal job advertisement.
**Serves:** talent.
**Primary action:** apply.
**Strategy line:** *"The constraint on this brand is senior judgment, which does not scale by hiring."*

Since the firm's entire scaling model depends on senior judgment, this page is a commercial
asset, not an HR obligation. It should read as a standard to meet rather than a benefits list.

---

### `/group` — ORIGIN
**Job:** Convert the group relationship from a claim into evidence.
**Serves:** commissioner, mid-funnel; the "will you exist in five years" question.
**Primary action:** `/work`.
**Strategy line:** *"Software firms study operations. PAR runs one."*

The USP lives here. Pontis Construction as proof of domain, PAR Group Global as institutional
weight, and the joint physical-plus-digital capability as the group's most defensible offer.

This page answers the enterprise buyer's first unspoken question — *will you be here when this
system is eight years old* — which no amount of design can answer otherwise.

**Group must not:** read as a corporate holding-company page. It exists to make our engineering
credible, not to describe an org chart.

---

### `/record` — POST-MORTEMS
**Job:** Demonstrate the fifth value — *say the number* — in public.
**Serves:** inheritor, talent, search.
**Primary action:** `/standard`.

Not a blog. Not thought leadership. Not industry commentary. **Technical notes and post-mortems,
including our own failures.**

A firm that publishes what went wrong on its own projects is making a claim that cannot be
imitated by a competitor unwilling to do the same. It is also the only content type here with
a genuine reason to exist — most agency blogs are SEO landfill that actively lowers the
perceived seriousness of the brand.

**Publishing standard: if there is nothing worth writing, nothing is published.** A dormant
Record is better than a padded one. Cadence is not a goal.

---

### `/commission` — CONVERSION
**Job:** Convert intent into a qualified conversation.
**Serves:** all, terminal.
**Primary action:** submit.

Not "Contact." Commission is the word used for work that is engineered to order — architecture,
engineering, shipbuilding. It sets the register of the transaction before a single field is
filled.

The form qualifies rather than collects: sector, what has to hold, what failure costs, timeline,
and budget band. Asking about consequence rather than requirements filters unserious enquiries
and gives the first call somewhere real to start.

**Commission must not:** promise a response time we will not meet, or offer a "free consultation."
Free consultation is the vocabulary of a firm with unfilled capacity.

---

# PART 3 — WHAT WAS REMOVED, AND WHY

| Removed | Reason |
|---|---|
| **Services / Solutions** | Sells capacity instead of judgment. The defining page of a commodity firm. Capability lives inside evidence. |
| **About** | Founding stories and adjectives convince nobody. Replaced by `/practice`, which is about the engagement, and `/group`, which is evidence. |
| **Team** (standalone) | People matter in the context of how work runs. Folded into `/practice`. |
| **Testimonials** | Detached praise is unfalsifiable. Evidence belongs inside the case study it refers to. |
| **Clients / Logo wall** | Logos prove someone paid us. Case studies prove we can think. |
| **Blog / News / Insights** | Cadence-driven content is landfill. Replaced by `/record`, published only when there is something to say. |
| **FAQ** | An FAQ is a list of places the site failed to explain itself. Answer each question where it arises. |
| **Pricing** | Custom engagements cannot be priced on a page. Replaced by a stated engagement floor on `/practice` — stronger, and rarer. |
| **Portfolio** *(separate from case studies)* | Two names for one thing. |
| **Technologies / Stack** | Listing frameworks is how a firm advertises that its differentiator is tooling. Stack appears inside case studies where it was a decision. |
| **Process** *(standalone)* | Every agency has a four-step process graphic. Ours is `/standard`, which is real, versioned, and downloadable. |
| **Sector landing pages** *(for now)* | Held until three substantial projects exist per sector. Thin sector pages damage credibility. |

**Twelve conventional pages removed. Nine remain.** Each removal is a decision the visitor never
sees and always feels.

---

# PART 4 — NAVIGATION

## Primary navigation — five slots, narrative order

```
PAR TECHNOLOGYS      WORK   STANDARD   PRACTICE   GROUP   [ START A COMMISSION ]
```

**The order is the argument, not convention or alphabet:**

```
WORK       →  evidence          "here is what we have built"
STANDARD   →  method            "here is how, in full, published"
PRACTICE   →  terms             "here is how we work together, and the floor"
GROUP      →  origin            "here is why we can do this and they cannot"
COMMISSION →  act three         "begin"
```

A visitor who reads the navigation bar left to right has received the entire pitch before
clicking anything. **This is what it means for architecture to carry storytelling** — the menu
is a sentence, not an index.

## Rules

- **No dropdowns.** A menu that requires hover-and-wait to reveal itself is a menu that failed
  to name its sections well. Every primary destination is one click.
- **No search** until `/record` and `/standard` exceed roughly forty documents. A search box on
  a nine-page site advertises that the architecture does not work.
- **`/record` is not in primary navigation.** It is reached from `/standard` and the footer.
  It serves depth-seekers, and depth-seekers scroll.
- **Maximum five slots, permanently.** The sixth item is the beginning of every bad enterprise
  navigation ever built. When something new must be added, something existing is merged or
  removed.
- **Mobile:** full-plane replacement, items at D3, narrative order preserved. The commission
  action sits last, at the bottom, as the resolution.

## Secondary navigation — the rail

The persistent annotation rail (design system, Part 3) carries **position, not links**:
section reference, current chapter, revision. It answers *where am I in this document* — which
is the question a drawing sheet margin has always answered.

Long documents — `/standard` chapters and case studies — add an in-page chapter index in the
rail. This is the only secondary navigation in the system.

---

# PART 5 — FOOTER

The footer is the drawing title block (design system, Part 8). It is the most-scrolled-to
element on any site and it is where credibility is either confirmed or quietly lost.

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│   PAR TECHNOLOGYS                                                      │
│   We build systems that hold.                          [ COMMISSION ]  │
│                                                                        │
├──────────────┬──────────────┬──────────────┬──────────────────────────┤
│ WORK         │ STANDARD     │ PRACTICE     │ GROUP                     │
│ All projects │ The standard │ How we engage│ PAR Group Global          │
│ By sector    │ Download PDF │ Engagement   │ Pontis Construction       │
│ By system    │ The record   │   floor      │ Joint capability          │
│              │              │ What we      │                           │
│              │              │   refuse     │                           │
│              │              │ Careers      │                           │
├──────────────┴──────────────┴──────────────┴──────────────────────────┤
│                                                                        │
│  REV 2.1 │ ISSUED 2026-07-22 │ SHEET 01 OF 09 │ PRIVACY │ TERMS │      │
│  a PAR Group Global company                                            │
└────────────────────────────────────────────────────────────────────────┘
```

## Footer doctrine

**Four columns, matching the four primary sections.** Footer hierarchy that contradicts primary
navigation is the most common and least noticed architectural failure on enterprise sites — the
visitor has to learn the structure twice.

**The title block bar carries live, accurate data.** A real revision number, a real issue date,
a real sheet count. It updates at deploy. A visitor who checks it and finds it accurate learns
more about how this company operates than any headline could deliver — and it is the cheapest
credibility on the entire site.

**"What we refuse" is a footer link.** Putting a refusal in permanent navigation is a
statement no competitor will copy.

**No newsletter signup. No social icons above the title block. No "made with love."**
The footer is an accountability block, not a leftovers drawer.

---

# PART 6 — USER JOURNEYS

## Journey A — The Commissioner *(primary revenue path)*

Owner or COO, previously burned, evaluating quietly, will not identify themselves for weeks.

```
Entry     referral, or search for a sector-specific system problem
   ↓
/                  reads one claim and the refusal statement.
                   The refusal is what makes them continue.
   ↓
/work              filters to their sector. Looking for themselves.
   ↓
/work/[project]    reads THE LOAD and WHAT WE REFUSED.
                   ⚑ This is where the decision is actually made.
   ↓
/group             "will these people exist in five years"
                   The construction group answers it.
   ↓
/practice          engagement floor. Self-qualifies on budget, privately,
                   without a sales conversation.
   ↓
/commission        submits, having already decided.
```

**Duration: two to nine weeks. Three to six sessions.** They will read the same case study
more than once. The architecture must support returning to depth quickly — which is why
`/work` filters rather than paginates, and why nothing is behind a form.

## Journey B — The Inheritor *(the reputation path)*

Internal technical lead. No purchasing authority. Complete veto power.

```
Entry     sent a link by the commissioner, or found /standard directly
   ↓
/standard          reads with the specific intention of finding it shallow
   ↓
/standard/[ch]     it is not shallow
   ↓
/record            reads a post-mortem where we describe our own failure
                   ⚑ This is where the veto is withdrawn
   ↓
/work/[project]    goes straight to THE HANDOVER
   ↓
downloads the standard → enters the list → advocates internally
```

This person never fills in the commission form. They are the reason the form gets filled in
by someone else. **The strategy names them as the persona who writes our reputation, years
later, in one sentence to a peer.**

## Journey C — The Referral *(highest value, shortest path)*

Arrives already convinced, sent by a previous client.

```
/                  → /work/[the project they were told about] → /commission
```

Three pages. Any friction here is expensive. The commission route must be reachable from the
first viewport of every page, permanently, in the navigation bar.

## Journey D — Talent

```
/  or  /record  →  /standard  →  /practice  →  /practice/careers
```

Senior engineers evaluate a firm by reading its technical writing, not its careers page. The
Record is the recruitment channel; careers is only where they land afterwards.

---

# PART 7 — CONVERSION PATHS

Four paths, ordered by commitment. **A premium practice needs more than one way in, because
a single high-commitment form converts only visitors who were already sold.**

### 1 — Commission *(high commitment)*
`[ START A COMMISSION ]` — persistent in navigation, present in the footer, and terminal on
every case study.

Qualifying form: sector · what has to hold · what failure costs · timeline · budget band.
Asking about *consequence* rather than requirements filters unserious enquiries and gives the
first call a real starting point.

### 2 — The Standard *(low commitment, highest volume)*
Download the PDF in exchange for an email. No sales follow-up sequence — the asset does the
work. This is how the inheritor persona enters the system, and it should be the highest-volume
conversion on the site by a wide margin.

### 3 — The Structural Review *(recommended — the missing wedge)*

**A paid, fixed-fee, fixed-duration assessment of a system the client already owns.**

This is the most commercially valuable recommendation in this document. It exists because the
gap between *reading a case study* and *commissioning a six-figure build* is too wide to cross
in one step, and the alternative — a free consultation — signals unfilled capacity and gives
away the only thing we sell.

A structural review is priced, scoped, and delivered as a real artifact: a written assessment
of load, tolerances, failure modes, and inheritance risk in their existing system. It

- converts a stranger into a client at a fraction of the commitment,
- lets us assess *them* before a large engagement,
- is profitable on its own,
- and produces a document that makes the case for the build better than any proposal could.

It should be a section on `/practice` with its own anchor. **Recommended, pending founder
approval.**

### 4 — Direct
A real email address, published in plain text in the footer. Not a form. Not obfuscated. Some
of the largest engagements in this firm's future will begin with a two-line email from someone
who does not fill in forms.

## What is deliberately absent

No chat widget — a chat bubble on a practice selling considered engineering is a category
error. No newsletter — the Record has a feed for people who want it. No exit-intent modals.
No gated case studies. No calendar embed on first contact; a calendar link implies our time
is available, and the engagement floor already established that it is not.

---

# PART 8 — ARCHITECTURE AS STORYTELLING

The IA is not a container for the story. It **is** the story, and it is the same three-act
structure as the motion system.

```
ACT I — ASSERTION           /              one claim, one object, one refusal
ACT II — EVIDENCE           /work          "here is what held, and what it cost"
                            /standard      "here is the method, in full"
                            /group         "here is why we can and they cannot"
ACT III — CONSEQUENCE       /practice      "here are the terms"
                            /commission    "begin"
```

## Three devices that make the architecture narrative rather than indexical

**1. The navigation bar is a sentence.** Read left to right it delivers evidence, method, terms,
origin, action. Most navigation is a list of nouns in arbitrary order. Ours is an argument in
sequence, and it works on a visitor who never clicks anything.

**2. Every page has one job and one exit.** A page with three equal calls to action is a page
with no narrative. Each destination knows where the reader should go next, and says so once.

**3. The site is a set of drawings, not a collection of pages.** The rail carries the reference,
the footer carries the revision and sheet count, and the persistent frame does not change
between routes — you are turning to another sheet in the same set. This is why scene transitions
in the motion system hold the frame and change only the content field. Architecture, motion, and
design all express one idea, which is what makes an ecosystem rather than a set of decisions.

---

# PART 9 — SCALABILITY

The architecture must survive twenty years and four growth horizons without restructuring.
It does, because growth happens **inside** containers rather than by adding top-level sections.

```
Horizon 1 (now)      9 templates. Work thin, Standard v1, Record occasional.
                     Sectors are filters.

Horizon 2 (3–7y)     Work deepens. Sectors cross three projects and earn
                     /work/sector/[x] pages. Standard reaches v2 with more
                     chapters. Record becomes regular. → /group gains a joint
                     capability page. NO new primary nav items.

Horizon 3 (7–12y)    Products extracted from repeated engagements. This is the
                     only event that justifies a sixth navigation slot: /products.
                     It is a different business model and cannot live inside
                     an evidence container. Everything else still fits.

Horizon 4 (12–20y)   /standard becomes a cited external reference with its own
                     versioned subdomain. The rest of the architecture is
                     unchanged from Horizon 1.
```

**Governing rule for the next twenty years: growth deepens containers, it does not widen
navigation.** The moment a seventh navigation item is proposed, the architecture has stopped
being an argument and started being an index — and every enterprise site that became unusable
did so exactly this way, one reasonable addition at a time.

---

# PART 10 — GOVERNANCE

## The five tests for any proposed page

1. **The evidence test.** Does this page contain proof, or only claims?
2. **The job test.** Can its single job be stated in one sentence? What is its one exit?
3. **The strategy test.** Which line of the brand strategy requires it? Name it.
4. **The swap test.** Put a competitor's name on it. Does it still work? Then it is generic.
5. **The deletion test.** Delete it. What conversion breaks? If none, it stays deleted.

## What would break this architecture

- A Services page, under any name — Solutions, Capabilities, What We Do
- A sixth primary navigation item before Horizon 3
- Sector pages built before the evidence exists to fill them
- Gating case studies behind a form
- A blog on a publishing schedule
- A chat widget
- Free consultation as a call to action
- Removing the engagement floor because it cost an enquiry
- Footer hierarchy that stops matching primary navigation

## Change control

```
REV 1.0 — Issued 2026-07 — IA Round 1 — Awaiting founder review
```

## Open items

- **Real service list required.** Capability must be traceable to real engagements before
  `/work` filters can be defined. This is the fourth request for project material and it is
  now the constraint on every remaining deliverable.
- Structural Review: approve or reject. It changes the commercial model, not just the IA.
- Engagement floor: what is the number? It cannot be written until you decide it.
- Sector list: confirm against real project history, not intent.
- Client anonymity: which engagements can be named? Unnameable work weakens `/work` badly,
  and a named client is worth more than three anonymous ones.
