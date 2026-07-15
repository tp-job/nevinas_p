export const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Shell: "#89e051",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Vue: "#41b883",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  Dockerfile: "#384d54",
  Makefile: "#427819",
};

export const langColor = (name: string) => LANG_COLORS[name] || "#7c5bf6";
export const langAbbr = (name: string) =>
  name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "?";

export const fmtNum = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};
