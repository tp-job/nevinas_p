# Nevinas-ka

> 異世界 — *another world.*
> A frontend portfolio built as a single, continuous experience where restraint and precision lead to interfaces that feel effortless.

[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)

**Experience it live →** https://nevinas-p.onrender.com/

---

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [The Experience](#the-experience)
- [The Work Section](#the-work-section)
- [Design System](#design-system)
  - [Color](#color)
  - [Typography](#typography)
  - [Surface & Depth](#surface--depth)
  - [Motion](#motion)
- [Architecture of the System](#architecture-of-the-system)
- [Signature Craft](#signature-craft)
- [Run It Locally](#run-it-locally)

---

## Design Philosophy

Every pixel, every interaction, and every line of code should serve a purpose.

Nevinas-ka is built on **intentional design** — a belief drawn from Japanese
minimalism (間, *ma* — the meaningful use of negative space) that restraint is
not the absence of expression but its sharpest form. Nothing decorates for its
own sake; motion earns its place by guiding attention, and silence between
elements is treated as a material, not a gap.

The result is an interface that feels *quiet* — precise, immersive, and
otherworldly. A portfolio that doesn't ask to be admired so much as inhabited.

## The Experience

The landing route is not a set of pages but a **single continuous journey**.
Content is staged as a stack of fourteen full-viewport slides — hero,
statements, timeline, bento, node map, services, work, testimonial, FAQ,
contact — that the visitor moves through by scroll, each transition deliberate
and snap-aligned.

Four statements carry the spine of it, each doubled in English and Japanese so
the two voices arrive together rather than one translating the other:

```
I design.    デザインする
I develop.   開発する
I think.     考える
And listen…  そして、聴く
```

- **Bilingual by design** — English carries the message; Japanese (異世界 /
  ネヴィナス) carries the mood. The two typographic voices are woven together,
  never merely translated.
- **A living backdrop** — a fluid, ink-like field drifts behind the composition,
  reacting to presence without ever competing with content.
- **Light and dark as equals** — the entire system is authored twice over, so
  neither theme is an afterthought. Switching is a smooth, deliberate
  cross-fade, not a jarring flip.

## The Work Section

Behind the landing journey sits `/work` — a thirteen-route application with its
own persistent navigation, where the portfolio stops performing and starts
showing its instruments.

| Route | What it holds |
|---|---|
| `/work/dashboard` | Activity analytics — a 24-hour work-rhythm distribution, a per-day activity calendar, contribution and language breakdowns |
| `/work/docs` | Architecture, project structure, the live design-system reference, changelog, and per-repo READMEs |
| `/work/repository` | Every public repository, filterable by language |
| `/work/repository/graph-view` | The same repositories as an interactive node graph |
| `/work/performance` | Lighthouse scores, Core Web Vitals, bundle analysis, API latency, code-quality metrics |
| `/work/tech-stack` · `/work/tooling` | The stack in use, and the working environment |
| `/work/gallery` · `/work/blog` | Image collection and written posts |
| `/work/website` · `/work/react` · `/work/tailwindcss` · `/work/flutter` | Project showcases, filtered by skill |

The data behind these is real: an Express API syncs from the GitHub REST API
into a set of JSON files, and the front end reads them through a single shared
provider so the repository list is fetched once per visit rather than once per
page.

## Design System

The visual language is expressed entirely through **design tokens** — a single
source of truth in CSS custom properties that every component, chart, and
surface consumes. Change a token, and the whole world shifts in step.

### Color

A disciplined palette anchors the mood in cool twilight blues.

**Primary scale — from mist to midnight**

```
Periwinkle  #E8EAF5 → #C8CDEB → #A8B0D9      (light, airy highs)
Cool / Haze #878CB4 → #465078 → #2E3558      (structural mids)
Midnight    #1E233C → #13172B                 (grounding depths)
Charcoal    #0A0F19 → #05080F                 (the deepest night)
```

**Sub-palette — "Hue Aesthetic"** — a warmer bridge of French Gray, Mountbatten
Pink, and English Violet, reserved for effects, gradients, and glass so accents
never feel bolted on.

**Accent set** — matte and velvet tones (Royal, Azure, Indigo, Orchid,
Flamingo), each an alias onto the palette rather than a colour of its own, so
the accents cannot drift away from the scale they sit on.

Every hue is mapped to a **semantic layer** (`text-primary`, `surface-elevated`,
`border-subtle`, `focus-ring`…) so components speak in meaning, not raw values —
and the light/dark inversion happens in one place. Charts read the same tokens
at runtime, so a palette change reaches the data visualisations too.

### Typography

**Two typefaces. No weight above 600.**

| Token | Typeface | Role |
|---|---|---|
| `--font-inter` | **Inter** (variable, 300–600) | Everything — headings, body, UI, numerals |
| `--font-zen` | **Zen Kaku Gothic New** | Japanese captions and subtitles |

The discipline is deliberate: hierarchy is carried by **size and spacing, not
weight**, so a page title is a large light face rather than a small heavy one.
Nothing on the site is bolder than 600, and the two families are self-hosted and
subset — the Japanese face ships Latin-only, with the ~151 Japanese glyphs the
site actually uses requested separately, rather than pulling a 24 MB CJK family
into the render path.

### Surface & Depth

Depth is built from three deliberate material systems rather than flat drop
shadows:

- **Glassmorphism** — layered blur, saturation, and inset highlights tuned per
  theme, so panels feel like frosted glass floating over the backdrop.
- **Elevation shadows** — a midnight-tinted `sm → md → lg → glow` ramp for
  consistent, calm layering.
- **Hairlines and whitespace** — the newer surfaces carry no box at all:
  sections are separated by a one-pixel rule and the space around them, which
  is what keeps dense, data-heavy pages from reading as a wall of cards.

A fourth system, **neumorphism** — soft periwinkle-tinted dual shadows — is
being retired. It now survives on a single component and is not the direction
new surfaces follow.

### Motion

Movement follows one easing family — confident curves that decelerate into
place, led by `cubic-bezier(0.22, 1, 0.36, 1)` — applied through shared duration
and timing tokens. Animation is choreographed, never random:
elements enter to lead the eye and exit to release it. All motion respects
`prefers-reduced-motion`.

## Architecture of the System

The stylesheet is engineered as carefully as the visuals, using an explicit
**CSS cascade-layer order** so specificity never becomes a guessing game:

```
tokens → reset → base → components → layouts → theme
```

- **Tokens first, always** — colors, type, spacing, and motion resolve before
  anything paints.
- **Scoped theming** — the homepage runs its own token namespace, letting it
  carry a distinct atmosphere without leaking into the rest of the app.
- **One source of truth for dark mode** — a single semantic override block
  re-points every meaning-level token, so the whole product themes in lockstep.

Beneath the styles, the shape is a small MERN-adjacent stack: React 19 + Vite on
the front, Express 5 + Zod on the back, and **JSON files as the store** — no
database. Global state is React Context only.

## Signature Craft

- **One shared WebGL backdrop, not many.** The fluid field behind the slides is
  a *single* rendering context shared across the entire stack — rather than one
  per section — preserving the full visual effect while keeping the experience
  smooth and light on the GPU.
- **Scroll as the primary instrument.** A precise, snap-aligned scroll model
  drives every transition and the active-slide state, with animations bound to
  `requestAnimationFrame` and passive listeners to keep frames buttery.
- **Only the active slide computes.** Scroll-linked work runs for the slide in
  view; the rest render as inert placeholders, which is what keeps fourteen
  full-viewport slides from costing fourteen slides' worth of layout.
- **Composable, token-driven components** — cards, timelines, charts, and
  navigation all draw from the same vocabulary, so the system stays coherent as
  it grows.

## Run It Locally

The front end reads its data from the API, so **start both**. With the server
down, every data-backed route renders the error screen rather than content.

```bash
# 1. API — http://localhost:3000
cd server
npm install
npm run dev

# 2. Front end — http://localhost:10005
cd client
npm install
npm run dev
```

Vite proxies `/api` to port 3000, so no extra configuration is needed. Open
http://localhost:10005.

Useful extras:

```bash
npm run build            # client: production build
npm run icons:subset     # client: regenerate the icon subset after adding ri-* classes
npm run sync:github      # server: refresh the JSON store from the GitHub API
npm run seed             # server: seed projects and blog posts
```

The experience is best viewed full-screen, in both light and dark, with the
sound on.

---

<div align="center">
  <sub>Designed & built with intention · 異世界 出身 · Nevinas</sub>
</div>
