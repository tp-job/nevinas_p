import type { Edge, Node } from "@xyflow/react";
import type { GitHubProfile, GitHubRepo } from "@/utils/api";
import { LANG_COLORS } from "@/components/graph/langColors";
import { inferStackFromRepo } from "@/components/graph/techIcons";
import { formatRelativeTimeLong } from "@/utils/date";

export interface RepoDetails {
  languages: Record<string, number>;
  topContributor: {
    login: string;
    avatar_url: string;
    contributions: number;
    html_url: string;
  } | null;
}

export function buildFlow(
  repos: GitHubRepo[],
  profile: GitHubProfile,
  details: Record<string, RepoDetails>,
): { nodes: Node[]; edges: Edge[] } {
  const sorted = [...repos].sort(
    (a, b) =>
      new Date(a.github_created_at).getTime() -
      new Date(b.github_created_at).getTime(),
  );

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const yearsSeen = new Set<string>();

  sorted.forEach((repo, i) => {
    const x = i * 460; // Spacing to allow tree layout
    const y = 80;

    const year = new Date(repo.github_created_at).getFullYear().toString();
    if (!yearsSeen.has(year)) {
      yearsSeen.add(year);
      nodes.push({
        id: `year-${year}-${i}`,
        type: "marker",
        position: { x, y: 0 },
        data: { label: year },
        draggable: false,
        selectable: false,
      });
    }

    const repoCardId = `repo-${repo.id}`;
    const lang = repo.language || "Unknown";
    const langColor = LANG_COLORS[lang] || "#6e7681";

    // 1. Repo Card Node
    nodes.push({
      id: repoCardId,
      type: "repoCard",
      position: { x, y },
      data: {
        name: repo.name,
        description: repo.description || "No description available",
        language: lang,
        languageColor: langColor,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: formatRelativeTimeLong(repo.github_updated_at),
        url: repo.html_url,
      },
    });

    // 2. Tech Stack Subnode
    const stack = inferStackFromRepo(repo);
    const techStackId = `tech-${repo.id}`;
    nodes.push({
      id: techStackId,
      type: "techStack",
      position: { x: x - 130, y: y + 280 },
      data: {
        stack,
        repoName: repo.name,
      },
    });

    // 3. Languages Subnode
    const langs = details[repo.name]?.languages || (repo.language ? { [repo.language]: 1 } : {});
    const total = Object.values(langs).reduce((a, b) => a + b, 0);
    const langList = Object.entries(langs)
      .map(([name, bytes]) => ({
        name,
        percentage: total > 0 ? Math.round((bytes / total) * 100) : 100,
        color: LANG_COLORS[name] || "#6e7681",
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const languagesId = `langs-${repo.id}`;
    nodes.push({
      id: languagesId,
      type: "languages",
      position: { x: x, y: y + 280 },
      data: {
        languages: langList,
        repoName: repo.name,
      },
    });

    // 4. Last Commit Subnode
    const contributor = details[repo.name]?.topContributor ?? (profile ? {
      login: profile.login,
      avatar_url: profile.avatar_url,
      contributions: 0,
      html_url: profile.html_url,
    } : null);

    const contributorData = contributor ? {
      login: contributor.login,
      avatarUrl: contributor.avatar_url,
      contributions: contributor.contributions,
      htmlUrl: contributor.html_url,
    } : null;

    const lastCommitId = `commit-${repo.id}`;
    nodes.push({
      id: lastCommitId,
      type: "lastCommit",
      position: { x: x + 130, y: y + 280 },
      data: {
        contributor: contributorData,
        repoName: repo.name,
      },
    });

    // 5. Connect Main Card to Subnodes
    edges.push({
      id: `e-sub-tech-${repo.id}`,
      source: repoCardId,
      sourceHandle: "bottom",
      target: techStackId,
      type: "smoothstep",
      style: { stroke: "var(--gv-line)", strokeWidth: 2 },
    });
    edges.push({
      id: `e-sub-langs-${repo.id}`,
      source: repoCardId,
      sourceHandle: "bottom",
      target: languagesId,
      type: "smoothstep",
      style: { stroke: "var(--gv-line)", strokeWidth: 2 },
    });
    edges.push({
      id: `e-sub-commit-${repo.id}`,
      source: repoCardId,
      sourceHandle: "bottom",
      target: lastCommitId,
      type: "smoothstep",
      style: { stroke: "var(--gv-line)", strokeWidth: 2 },
    });

    // 6. Connect timeline spine between repo cards
    if (i > 0) {
      const prevRepoId = `repo-${sorted[i - 1].id}`;
      edges.push({
        id: `e-spine-${i}`,
        source: prevRepoId,
        target: repoCardId,
        type: "smoothstep",
        animated: true,
        style: { stroke: "var(--gv-line)", strokeWidth: 2 },
      });
    }
  });

  return { nodes, edges };
}
