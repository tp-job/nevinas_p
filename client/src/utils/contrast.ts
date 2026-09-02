/**
 * WCAG 2.1 relative luminance and contrast ratio.
 *
 * Used by the Docs design-system spec sheet to state, as data, what every text
 * token actually measures against its background. A palette page that shows
 * swatches and no ratios is decoration; the ratio is the number anyone has to
 * check before shipping a token, so the page computes it rather than asserting
 * it in prose that can go stale.
 *
 * Deliberately hex-only. Several tokens in this palette are `rgba(...)` with
 * alpha, and a contrast ratio against a translucent colour is meaningless
 * without compositing it over a known backdrop first — so `parseHex` returns
 * null for those and callers render a dash instead of a wrong number. Silently
 * treating alpha as opaque would produce plausible ratios that are wrong, which
 * is worse than showing nothing.
 */

/** #RGB and #RRGGBB only. Returns null for rgba(), named colours, or garbage. */
function parseHex(color: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return null;
  const h =
    m[1].length === 3
      ? m[1]
          .split("")
          .map((c) => c + c)
          .join("")
      : m[1];
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
function luminance([r, g, b]: [number, number, number]): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Contrast ratio between two hex colours, 1–21.
 * Returns null if either colour is not a plain hex (see the note above).
 */
export function contrastRatio(a: string, b: string): number | null {
  const ca = parseHex(a);
  const cb = parseHex(b);
  if (!ca || !cb) return null;
  const la = luminance(ca);
  const lb = luminance(cb);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** The WCAG 2.1 grade a ratio earns for normal-size body text. */
export function wcagGrade(ratio: number): "AAA" | "AA" | "AA Large" | "Fail" {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

/** True when the colour is a plain opaque hex we can reason about. */
export function isOpaqueHex(color: string): boolean {
  return parseHex(color) !== null;
}
