import { LANG_COLORS } from "@/utils/constants";

export { LANG_COLORS };

// Graph nodes use a purple fallback that reads better on the dark canvas
// than the shared grey LANG_COLOR_DEFAULT.
export const langColor = (name: string) => LANG_COLORS[name] || "#7c5bf6";
export const langAbbr = (name: string) =>
  name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "?";

export const fmtNum = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};
