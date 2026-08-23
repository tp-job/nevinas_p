/**
 * Capability probe for the experimental html-in-canvas APIs.
 *
 * Deliberately its own module with NO imports: callers need to answer "can this
 * effect do anything at all?" without pulling in createParticleScroll.ts and its
 * ~600 lines of GLSL and WebGL setup. Those APIs ship only behind a Chromium
 * flag, so for nearly every visitor the answer is no and the core must never be
 * downloaded. See ParticleScrollLazy.tsx.
 */

export type PaintableCanvas = HTMLCanvasElement & {
  onpaint?: (() => void) | null;
  requestPaint?: () => void;
};

export type ElementImageContext = CanvasRenderingContext2D & {
  drawElementImage?: (element: Element, x: number, y: number) => void;
};

export function supportsHtmlInCanvas(): boolean {
  if (typeof document === "undefined") return false;
  const probe = document.createElement("canvas") as PaintableCanvas;
  const ctx = probe.getContext("2d") as ElementImageContext | null;
  return Boolean(
    ctx &&
      typeof ctx.drawElementImage === "function" &&
      typeof probe.requestPaint === "function",
  );
}
