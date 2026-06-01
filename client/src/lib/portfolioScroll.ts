export const PORTFOLIO_SCROLL = {
  SENS_W: 0.00018,
  SENS_T: 0.00078,
  LERP_SPD: 0.062,
  FADE: 0.16,
  VIRT_H: 28000,
} as const;

export const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const smoothstep = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

export type SlideStyle = {
  opacity: number;
  translateY: number;
  pointerEvents: "auto" | "none";
};

export function getSlideStyle(
  progress: number,
  index: number,
  total: number,
  fade = PORTFOLIO_SCROLL.FADE,
): SlideStyle {
  const start = index / total;
  const end = (index + 1) / total;

  if (progress < start) {
    return { opacity: 0, translateY: 52, pointerEvents: "none" };
  }
  if (progress >= end) {
    return { opacity: 0, translateY: -52, pointerEvents: "none" };
  }

  const t = (progress - start) / (end - start);
  let opacity: number;
  let translateY: number;

  if (t < fade) {
    const e = smoothstep(t / fade);
    opacity = e;
    translateY = lerp(52, 0, e);
  } else if (t > 1 - fade) {
    const e = smoothstep((t - (1 - fade)) / fade);
    opacity = 1 - e;
    translateY = lerp(0, -52, e);
  } else {
    opacity = 1;
    translateY = 0;
  }

  return {
    opacity,
    translateY,
    pointerEvents: opacity > 0.2 ? "auto" : "none",
  };
}
