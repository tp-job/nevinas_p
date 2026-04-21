export const changelog = [
  {
    version: "2.0.0",
    date: "Feb 2026",
    changes: [
      "Integrated GitHub REST API for real-time data across all pages",
      "Added GitHub routes: /api/github/profile, repos, stats, events",
      "Auto-infer topics from repo name, description, and language",
      "Created ProjectCard component matching BlogCard design",
      "Redesigned TechStack, Tool cards to unified BlogCard style",
      "Updated Docs to use GitHub API documentation",
      "Added in-memory caching (5 min TTL) for GitHub API calls",
    ],
  },
  {
    version: "1.3.0",
    date: "Jan 2026",
    changes: [
      "Added Performance & Docs pages",
      "Created unified seed script",
      "Added Blog API routes",
      "Added ComTech-Prep tech stack data",
    ],
  },
  {
    version: "1.2.0",
    date: "Dec 2025",
    changes: [
      "Redesigned Dashboard with custom SVG gauges and Recharts",
      "Implemented Contribution Heatmap component",
      "Migrated all components to theme CSS variables",
      "Created TechStackCharts with progress bars",
    ],
  },
  {
    version: "1.1.0",
    date: "Nov 2025",
    changes: [
      "Added responsive mobile sidebar",
      "Implemented dark/light theme system",
      "Created Gallery page with image sync",
      "Added MongoDB connection with error handling",
    ],
  },
  {
    version: "1.0.0",
    date: "Oct 2025",
    changes: [
      "Initial project setup with Vite + React 19 + TypeScript",
      "Tailwind CSS 4 with custom theme configuration",
      "Express 5 backend with MongoDB/Mongoose",
      "Dashboard, Repository, TechStack, and Tooling pages",
    ],
  },
];
