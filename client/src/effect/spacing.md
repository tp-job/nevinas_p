# Design System: Spacing

## Grid & Layout
- **Max Width:** `1440px` (Desktop)
- **Side Padding:** `clamp(1rem, 5vw, 4rem)`

## Parallax Gaps
To prevent "Visual Crowding" during scroll:
- **Vertical Section Gap:** `12rem` (Allows layers to transition smoothly)
- **Layer Offset (Z-Space):**
  - Foreground: `z-index: 30` (Fastest movement)
  - Midground: `z-index: 20` (Standard scroll)
  - Background: `z-index: 10` (Slowest movement/Fixed)
  - Effect Layers: `z-index: -1` (LaserFlow/LiquidEther)