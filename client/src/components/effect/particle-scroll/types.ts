/**
 * Shared types and defaults for the ParticleScroll effect.
 *
 * Split out of ParticleScroll.tsx so the .tsx exports only the component
 * (react-refresh requires that), mirroring the liquid-ether/ layout.
 */

export interface ParticleScrollOptions {
  /** Viewport fraction of the formation line. Content assembles as it scrolls up past this line and dissolves back below it. */
  point?: number;
  /** Height in CSS pixels of the transition band where particles progressively reassemble. */
  band?: number;
  /** Grain spacing in CSS pixels. Smaller values mean finer, denser sand. */
  density?: number;
  /** Size of fully scattered dust grains in CSS pixels. Grains grow to cover their cell as they land. */
  size?: number;
  /** Maximum distance in CSS pixels particles scatter from their home position. */
  spread?: number;
  /** Downward bias of the scattered cloud (-1 to 1), like sand settling. Negative values lift it. */
  gravity?: number;
  /** Idle float speed of scattered particles (0 to 1). 0 freezes the cloud. */
  drift?: number;
  /** Sideways arc in CSS pixels particles take while flying home. */
  swirl?: number;
  /** Per-particle randomness of reassembly timing (0 to 1). */
  stagger?: number;
  /** Opacity of fully scattered particles (0 to 1). */
  fade?: number;
  /** Seconds a row of dust takes to condense into the page once the reveal reaches it. */
  settle?: number;
  /** Seconds the damped scroll takes to catch up with the real scroll. Higher feels more fluid. */
  smoothing?: number;
  /** Progress at which the block finishes assembling. Progress-driven mode only. */
  enter?: number;
  /** Progress at which the block starts dissolving again. Progress-driven mode only. */
  exit?: number;
}

/**
 * Where the effect reads its scroll position from.
 *
 * Default (`null`) is *element mode*: the content element is itself a
 * scroller and the effect reads its `scrollTop` — the standalone behaviour.
 *
 * Supplying a source switches to *progress mode*: the content does not scroll
 * at all, and the formation line is swept across it by an external 0→1 signal.
 * That is what lets the effect sit inside a homepage slide, which already
 * lives in the page's single scroll container — a nested scroller there would
 * starve the outer one and freeze `activeSlide`.
 */
export interface ParticleScrollProgressSource {
  /** Current progress, 0→1, of the host through its own scroller. */
  get: () => number;
  /** Subscribe to changes. Returns an unsubscribe function. */
  subscribe: (onChange: () => void) => () => void;
}

export interface ParticleScrollElements {
  /** Canvas with layoutsubtree that hosts the HTML content. */
  source: HTMLCanvasElement;
  /** The scrollable element inside the source canvas that gets captured. */
  content: HTMLElement;
  /** Canvas the WebGL effect renders to. */
  output: HTMLCanvasElement;
}

export interface ParticleScrollInstance {
  /** Update effect options live. */
  setOptions: (options: ParticleScrollOptions) => void;
  /** Re-read canvas size. Call when the element is resized. */
  resize: () => void;
  /**
   * Pause or resume the render loop.
   *
   * The IntersectionObserver below cannot do this job on the homepage: slides
   * are absolutely stacked and always intersecting, merely at `opacity: 0`.
   * Without an explicit signal the effect would render at full cost while
   * completely invisible. Mirrors `LiquidEtherBackdrop active={...}`.
   */
  setActive: (active: boolean) => void;
  /** Stop the loop and release all GPU resources. */
  destroy: () => void;
}

export const DEFAULTS: Required<ParticleScrollOptions> = {
  point: 0.68,
  band: 420,
  density: 2,
  size: 1.25,
  spread: 220,
  gravity: 0.35,
  drift: 0.7,
  swirl: 60,
  stagger: 0.7,
  fade: 0.85,
  settle: 1.2,
  smoothing: 0.6,
  // Assembled across the middle of the slide's travel. Mirrors the opacity
  // curve in SlideWrapper's ActiveSlide ([0, .3, .7, 1] → [0, 1, 1, 0]) so the
  // content is solid exactly while the slide is the visible one.
  enter: 0.3,
  exit: 0.7,
};

// PaintableCanvas / ElementImageContext live in ./support so the capability
// probe can be imported without pulling in the WebGL core.
export type { ElementImageContext, PaintableCanvas } from "./support";
