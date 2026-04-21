export const apiEndpoints = [
  {
    method: "GET" as const,
    path: "/api/github/profile",
    description:
      "Get GitHub user profile — returns name, bio, followers, repos count",
    response: "{ success, data: GitHubProfile }",
    auth: false,
  },
  {
    method: "GET" as const,
    path: "/api/github/repos",
    description:
      "Get all GitHub repositories — sorted by updated date, with auto-inferred topics",
    response: "{ success, count, data: GitHubRepo[] }",
    auth: false,
  },
  {
    method: "GET" as const,
    path: "/api/github/stats",
    description:
      "Get aggregated GitHub statistics — commits, stars, forks, language distribution",
    response: "{ success, data: GitHubStats }",
    auth: false,
  },
  {
    method: "GET" as const,
    path: "/api/github/events",
    description:
      "Get recent GitHub activity events — push, PR, issue, create events",
    response: "{ success, count, data: GitHubEvent[] }",
    auth: false,
  },
  {
    method: "GET" as const,
    path: "/api/github/repos/:name/languages",
    description: "Get language breakdown for a specific repository",
    response: "{ success, data: Record<string, number> }",
    auth: false,
  },
  {
    method: "GET" as const,
    path: "/api/blogs",
    description: "Get all blog posts — sorted by created_at descending",
    response: "{ success, count, data: Blog[] }",
    auth: false,
  },
  {
    method: "GET" as const,
    path: "/api/blogs/:id",
    description: "Get a single blog post by ID",
    response: "{ success, data: Blog }",
    auth: false,
  },
  {
    method: "GET" as const,
    path: "/api/gallery",
    description: "Get all gallery images — sorted by created_at descending",
    response: "{ success, count, data: GalleryImage[] }",
    auth: false,
  },
];
