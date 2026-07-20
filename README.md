# Nevinas-ka

> 異世界 — *another world.*
> A frontend portfolio built as a single, continuous experience where restraint and precision lead to interfaces that feel effortless.

[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Experience it live →** https://nevinas-p.onrender.com/

---

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [The Experience](#the-experience)
- [Design System](#design-system)
  - [Color](#color)
  - [Typography](#typography)
  - [Surface & Depth](#surface--depth)
  - [Motion](#motion)
- [Architecture of the System](#architecture-of-the-system)
- [Signature Craft](#signature-craft)
- [Explore Locally](#explore-locally)

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

The site is not a set of pages but a **single continuous journey**. Content is
staged as a stack of full-viewport slides — hero, statements, timeline,
services, work, testimonials, contact — that the visitor moves through by
scroll, each transition deliberate and snap-aligned.

- **Bilingual by design** — English carries the message; Japanese (異世界 /
  ネヴィナス) carries the mood. The two typographic voices are woven together,
  never merely translated.
- **A living backdrop** — a fluid, ink-like field drifts behind the composition,
  reacting to presence without ever competing with content.
- **Light and dark as equals** — the entire system is authored twice over, so
  neither theme is an afterthought. Switching is a smooth, deliberate
  cross-fade, not a jarring flip.

## Design System

The visual language is expressed entirely through **design tokens** — a single
source of truth in CSS custom properties that every component, chart, and
surface consumes. Change a token, and the whole world shifts in step.

### Color

A disciplined palette anchors the mood in cool twilight blues.

**Primary scale — fourteen steps from mist to midnight**

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
Flamingo) power the statement gradients, one signature blend per idea:

```
I design.   → rose → coral → amber
I develop.  → cyan → blue → indigo
I think.    → violet → fuchsia → rose
And listen. → emerald → cyan → blue
```

Every hue is mapped to a **semantic layer** (`text-primary`, `surface-elevated`,
`border-subtle`, `focus-ring`…) so components speak in meaning, not raw values —
and the light/dark inversion happens in one place.

### Typography

Four voices, each with a clear role:

| Token | Typeface | Role |
|---|---|---|
| Display | **Bricolage Grotesque** | Oversized headlines, expressive character |
| Body | **Inter** (variable) | Clarity at every size |
| Mono | **DM Mono** | Labels, metadata, the "engineered" voice |
| Japanese | **Noto Serif JP** · **Zen Kaku Gothic New** | Mood, atmosphere, 異世界 |

Headlines lean into tight tracking and generous scale (`clamp()`-driven, up to
`13vw`) so type becomes composition, not just words.

### Surface & Depth

Depth is built from three deliberate material systems rather than flat drop
shadows:

- **Glassmorphism** — layered blur, saturation, and inset highlights tuned per
  theme, so panels feel like frosted glass floating over the backdrop.
- **Neumorphism** — soft, periwinkle-tinted dual shadows for tactile,
  pressed-from-the-surface controls.
- **Elevation shadows** — a midnight-tinted `sm → md → lg → glow` ramp for
  consistent, calm layering.

### Motion

Movement follows a single easing philosophy — a confident
`cubic-bezier(0.16, 1, 0.3, 1)` that decelerates into place — applied through
shared duration and timing tokens. Animation is choreographed, never random:
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

## Signature Craft

- **One shared WebGL backdrop, not many.** The fluid field behind the slides is
  a *single* rendering context shared across the entire stack — rather than one
  per section — preserving the full visual effect while keeping the experience
  smooth and light on the GPU.
- **Scroll as the primary instrument.** A precise, snap-aligned scroll model
  drives every transition and the active-slide state, with animations bound to
  `requestAnimationFrame` and passive listeners to keep frames buttery.
- **Composable, token-driven components** — cards, timelines, charts, and
  navigation all draw from the same vocabulary, so the system stays coherent as
  it grows.

## Explore Locally

```bash
# Frontend
cd client
npm install
npm run dev
```

The experience is best viewed full-screen, in both light and dark, with the
sound on.

---

<div align="center">
  <sub>Designed & built with intention · 異世界 出身 · Nevinas</sub>
</div>
