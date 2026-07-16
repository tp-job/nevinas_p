import type { GitHubRepo } from "@/utils/api";

/** * Match repos whose topics, name, or description mention any keyword * (case-insensitive). Optionally also match on exact repo language. */
export function filterReposByKeywords(
  repos: GitHubRepo[],
  keywords: string[],
  languages: string[] = [],
): GitHubRepo[] {
  return repos.filter((r) => {
    const topics = r.topics || [];
    const name = (r.name || "").toLowerCase();
    const desc = (r.description || "").toLowerCase();
    return (
      keywords.some(
        (kw) => topics.includes(kw) || name.includes(kw) || desc.includes(kw),
      ) || languages.includes(r.language ?? "")
    );
  });
}
