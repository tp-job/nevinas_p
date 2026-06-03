# Design System: Motion & Parallax

## Scroll Physics
We use a "Dampened Scroll" approach to avoid jittery movements on high-refresh-rate monitors.

- **Smoothing (Lerp):** `0.1`
- **Mass:** `1`
- **Tension:** `100`
- **Friction:** `30`

## Parallax Ratios
When calculating the `y` transform based on `scrollYProgress`:

1. **Deep Background:** `0.1x` scroll speed (appears far away).
2. **Floating Icons:** `0.3x` scroll speed + subtle rotation.
3. **Text Content:** `1.0x` (Standard scroll).
4. **Foreground Accents:** `1.5x` scroll speed (appears to "zoom" past).

## Component-Specific Effects
- **LiquidEther:** Velocity-based intensity (`Math.abs(scrollVelocity) / 1500`).
- **LaserFlow:** Tilt-to-mouse response (`uTiltScale`).
- **GlassSurface:** Transition duration `260ms` ease-out for hover lift.

*Always use `will-change: transform` on parallax layers to trigger GPU acceleration.*