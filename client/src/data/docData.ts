// ============================
// API Endpoints Documentation
// ============================
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
    response: "GalleryImage[]",
    auth: false,
  },
];

// ============================
// Data Models
// ============================
export const dataModels = [
  {
    name: "GitHubRepo",
    collection: "github api",
    fields: [
      {
        name: "id",
        type: "Number",
        required: true,
        description: "GitHub repository ID",
      },
      {
        name: "name",
        type: "String",
        required: true,
        description: "Repository name",
      },
      {
        name: "description",
        type: "String",
        required: false,
        description: "Repository description",
      },
      {
        name: "html_url",
        type: "String",
        required: true,
        description: "GitHub URL",
      },
      {
        name: "homepage",
        type: "String",
        required: false,
        description: "Live demo URL",
      },
      {
        name: "language",
        type: "String",
        required: false,
        description: "Primary programming language",
      },
      {
        name: "topics",
        type: "String[]",
        required: false,
        description: "Topics (auto-inferred from name/desc/lang)",
      },
      {
        name: "stargazers_count",
        type: "Number",
        required: false,
        description: "Star count",
      },
      {
        name: "forks_count",
        type: "Number",
        required: false,
        description: "Fork count",
      },
      {
        name: "size",
        type: "Number",
        required: false,
        description: "Repository size in KB",
      },
      {
        name: "created_at",
        type: "Date",
        required: false,
        description: "Creation date",
      },
      {
        name: "updated_at",
        type: "Date",
        required: false,
        description: "Last update date",
      },
      {
        name: "pushed_at",
        type: "Date",
        required: false,
        description: "Last push date",
      },
    ],
  },
  {
    name: "GitHubStats",
    collection: "github api",
    fields: [
      {
        name: "profile",
        type: "Object",
        required: true,
        description: "User profile (login, name, avatar, bio)",
      },
      {
        name: "totalStars",
        type: "Number",
        required: true,
        description: "Total stars across all repos",
      },
      {
        name: "totalForks",
        type: "Number",
        required: true,
        description: "Total forks across all repos",
      },
      {
        name: "totalCommits",
        type: "Number",
        required: true,
        description: "Total commits from recent events",
      },
      {
        name: "repoCount",
        type: "Number",
        required: true,
        description: "Number of public repos",
      },
      {
        name: "languageDistribution",
        type: "Record<string, number>",
        required: true,
        description: "Language usage count",
      },
      {
        name: "monthlyActivity",
        type: "Array",
        required: true,
        description: "Commits, PRs, issues by month",
      },
      {
        name: "dayOfWeekActivity",
        type: "Number[]",
        required: true,
        description: "Activity count per day (Mon-Sun)",
      },
      {
        name: "projectStatus",
        type: "Object",
        required: true,
        description: "Active, inactive, archived counts",
      },
      {
        name: "topRepos",
        type: "Array",
        required: true,
        description: "Top 6 repos by stars + forks",
      },
    ],
  },
  {
    name: "Blog",
    collection: "blogs",
    fields: [
      {
        name: "title",
        type: "String",
        required: true,
        description: "Blog post title",
      },
      {
        name: "excerpt",
        type: "String",
        required: true,
        description: "Short summary text",
      },
      {
        name: "content",
        type: "String",
        required: true,
        description: "Full HTML content",
      },
      {
        name: "author",
        type: "String",
        required: true,
        description: "Author name",
      },
      {
        name: "date",
        type: "String",
        required: true,
        description: "Display date string",
      },
      {
        name: "readTime",
        type: "String",
        required: false,
        description: "Estimated read time",
      },
      {
        name: "category",
        type: "String",
        required: false,
        description: "Blog category",
      },
      {
        name: "imageUrl",
        type: "String",
        required: false,
        description: "Cover image URL",
      },
    ],
  },
];

// ============================
// Architecture Overview
// ============================
export const architecture = {
  frontend: {
    framework: "React 19 + TypeScript",
    styling: "Tailwind CSS 4 + MUI 7",
    buildTool: "Vite 7 (SWC)",
    routing: "React Router DOM 7",
    charts: "Recharts + MUI X-Charts",
    icons: "Remixicon",
  },
  backend: {
    runtime: "Node.js",
    framework: "Express 5",
    database: "MongoDB + Mongoose 8",
    externalApi: "GitHub REST API v3",
    auth: "JWT + bcryptjs",
  },
  devTools: {
    linter: "ESLint 9 + TypeScript-ESLint",
    compiler: "TypeScript 5.9",
    hotReload: "Vite HMR + nodemon",
  },
};

// Project Detail by Repo — maps repo name → architecture. Shown when clicking repo card on Docs.
export const projectDetailByRepo: Record<string, typeof architecture> = {
  nevinas_p: architecture,
  nevinas_ka_i: architecture,
};

// ============================
// Folder Structure
// ============================
export const folderStructure = `project/
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── card/         # Card components (Blog, Repo, Project, Tool, TechStack)
│   │   │   ├── charts/       # Data visualization components
│   │   │   ├── common/       # Loading, Error, NotFound pages
│   │   │   └── layouts/      # Navbar, Sidebar, Header, Footer
│   │   ├── context/          # React Context providers
│   │   ├── data/             # Static data files
│   │   ├── layouts/          # Page layout wrappers
│   │   ├── pages/            # Route page components
│   │   ├── routes/           # Route configuration
│   │   ├── styles/           # CSS files
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # API service, helpers
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── data/             # Seed data (JSON)
│   │   ├── middleware/       # Auth middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes (auth, github)
│   │   └── server.js         # Express entry point
│   ├── .env                  # Environment variables
│   └── package.json
└── docs/                     # Documentation`;

// ============================
// Getting Started Steps
// ============================
export const gettingStarted = [
  {
    step: 1,
    title: "Clone Repository",
    command: "git clone <repository-url>\ncd <project-name>",
    description:
      "Clone the project from GitHub and navigate to the project directory.",
  },
  {
    step: 2,
    title: "Install Dependencies",
    command:
      "# Frontend\ncd client && npm install\n\n# Backend\ncd ../server && npm install",
    description: "Install npm packages for both client and server.",
  },
  {
    step: 3,
    title: "Configure Environment",
    command:
      "# server/.env\nMONGODB_URI=mongodb://127.0.0.1:27017/your_db\nPORT=3000\nGITHUB_TOKEN=your_github_personal_access_token",
    description:
      "Create .env file in the server directory with MongoDB URI and GitHub token.",
  },
  {
    step: 4,
    title: "Start MongoDB",
    command: "mongod",
    description: "Make sure MongoDB is running locally on port 27017.",
  },
  {
    step: 5,
    title: "Seed Database",
    command: "cd server && node src/seed.js",
    description: "Populate the database with initial data.",
  },
  {
    step: 6,
    title: "Run Development Servers",
    command:
      "# Terminal 1 — Backend\ncd server && npm run dev\n\n# Terminal 2 — Frontend\ncd client && npm run dev",
    description:
      "Start both development servers. Frontend runs on :5173, backend on :3000.",
  },
];

// ============================
// Design System Colors
// ============================
export const designSystem = {
  mainTheme: [
    { name: "Periwinkle Pale", variable: "--color-periwinkle-pale", hex: "#E8EAF5" },
    { name: "Periwinkle", variable: "--color-periwinkle", hex: "#C8CDEB" },
    { name: "Periwinkle Mid", variable: "--color-periwinkle-mid", hex: "#A8B0D9" },
    { name: "Cool", variable: "--color-cool", hex: "#878CB4" },
    { name: "Cool Deep", variable: "--color-cool-deep", hex: "#5E6491" },
    { name: "Haze Light", variable: "--color-haze-light", hex: "#6B739A" },
    { name: "Haze", variable: "--color-haze", hex: "#465078" },
    { name: "Haze Deep", variable: "--color-haze-deep", hex: "#2E3558" },
    { name: "Midnight", variable: "--color-midnight", hex: "#1E233C" },
    { name: "Midnight Deep", variable: "--color-midnight-deep", hex: "#13172B" },
    { name: "Charcoal", variable: "--color-charcoal", hex: "#0A0F19" },
  ],
  subPalette: [
    { name: "French Gray", variable: "--color-sub-french", hex: "#B8BED7" },
    { name: "Cool Gray Sub", variable: "--color-sub-cool", hex: "#AFAECC" },
    { name: "Mountbatten Pink", variable: "--color-sub-mount", hex: "#85758F" },
    { name: "English Violet 1", variable: "--color-sub-ev1", hex: "#524E68" },
    { name: "English Violet 2", variable: "--color-sub-ev2", hex: "#44405A" },
  ],
  lightMode: [
    { name: "Background", variable: "--color-light-bg", hex: "#F0F1F8" },
    { name: "Surface", variable: "--color-light-surface", hex: "rgba(255,255,255,0.55)" },
    { name: "Surface 2", variable: "--color-light-surface-2", hex: "rgba(255,255,255,0.82)" },
    { name: "Border", variable: "--color-light-border", hex: "rgba(30,35,60,0.10)" },
    { name: "Text", variable: "--color-light-text", hex: "#1E233C" },
    { name: "Text Secondary", variable: "--color-light-text-secondary", hex: "#2C3352" },
    { name: "Text Tertiary", variable: "--color-light-text-tertiary", hex: "#465078" },
    { name: "Text Muted", variable: "--color-light-text-muted", hex: "#5E6491" },
  ],
  darkMode: [
    { name: "Background", variable: "--color-dark-bg", hex: "#0A0F19" },
    { name: "Surface", variable: "--color-dark-surface", hex: "rgba(30,35,60,0.50)" },
    { name: "Surface 2", variable: "--color-dark-surface-2", hex: "rgba(46,53,88,0.65)" },
    { name: "Border", variable: "--color-dark-border", hex: "rgba(200,205,235,0.10)" },
    { name: "Text", variable: "--color-dark-text", hex: "#E8EAF5" },
    { name: "Text Secondary", variable: "--color-dark-text-secondary", hex: "#AEB5D9" },
    { name: "Text Tertiary", variable: "--color-dark-text-tertiary", hex: "#C8CDEB" },
    { name: "Text Muted", variable: "--color-dark-text-muted", hex: "#878CB4" },
  ],
  semanticTokens: [
    { name: "Accent", variable: "--color-accent", hex: "#2E3558" },
    { name: "Accent Foreground", variable: "--color-accent-foreground", hex: "#FFFFFF" },
    { name: "Success", variable: "--color-success", hex: "#2E7D32" },
    { name: "Error", variable: "--color-error", hex: "#C62828" },
    { name: "Warning", variable: "--color-warning", hex: "#E65100" },
  ],
  fonts: [
    { name: "Inter", variable: "--font-inter", usage: "Body text, UI elements" },
    { name: "Zen Kaku Gothic New", variable: "--font-zen", usage: "Japanese subtitles, decorative headings" },
  ],
};

// ============================
// Changelog
// ============================
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
