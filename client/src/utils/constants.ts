/** * Language-to-color mapping for GitHub and chart UIs. * Single source for repo language badges and chart segments. */
export const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  "C#": "#239120",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Shell: "#89e051",
}; /** Default color when language is not in LANG_COLORS */
export const LANG_COLOR_DEFAULT = "#6e7681";
