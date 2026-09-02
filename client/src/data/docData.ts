// ============================
// Architecture Overview
// ============================
// Every entry below is checked against the real dependency lists by
// `client/scripts/check-docs-truth.mjs`. If you change one, run that script.
//
// Previously this block claimed MongoDB + Mongoose 8, JWT + bcryptjs, MUI 7,
// MUI X-Charts and nodemon. None of those are dependencies of this project:
// there is no database (the store is JSON files), no auth of any kind, and the
// server's dev script runs ts-node-dev. Meanwhile the genuinely notable parts
// of the stack — three.js, @xyflow/react, Zod, Helmet — were undocumented.
export const architecture = {
  frontend: {
    framework: "React 19 + TypeScript",
    styling: "Tailwind CSS 4",
    buildTool: "Vite 7 (SWC)",
    routing: "React Router DOM 7",
    animation: "Framer Motion 12",
    charts: "Recharts",
    graph: "@xyflow/react",
    threeD: "three.js (raw WebGL, guarded)",
    markdown: "react-markdown",
    icons: "Remix Icon (subset)",
  },
  backend: {
    runtime: "Node.js",
    framework: "Express 5",
    dataStore: "JSON files — no database",
    validation: "Zod 4",
    security: "Helmet + CORS",
    uploads: "Multer",
    scheduling: "node-cron",
    externalApi: "GitHub REST API v3",
  },
  devTools: {
    linter: "ESLint 9 + TypeScript-ESLint",
    compiler: "TypeScript 5.9",
    clientDev: "Vite HMR",
    serverDev: "ts-node-dev",
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
export const folderStructure = `nevinas_ka_i/
├── client/
│   ├── src/
│   │   ├── components/       # Feature-organised UI
│   │   │   ├── card/         # Blog, Repo, Project, Tool, TechStack cards
│   │   │   ├── charts/       # Recharts wrappers
│   │   │   ├── common/       # AsyncBoundary, loading, error pages
│   │   │   ├── dashboard/    # Dashboard sections
│   │   │   ├── docs/         # This page's building blocks
│   │   │   ├── effect/       # WebGL / visual effects
│   │   │   ├── graph/        # @xyflow/react nodes
│   │   │   ├── homepage/     # Slide stack
│   │   │   ├── layouts/      # Navbar, Sidebar, Header, Footer
│   │   │   ├── performance/  # Performance page widgets
│   │   │   └── ui/           # Toast, ScrollReveal, primitives
│   │   ├── context/          # Theme, Profile, Error, Notification
│   │   ├── data/             # Static content (this file)
│   │   ├── hooks/            # useFetch, useDeviceCapability, ...
│   │   ├── layouts/          # Route layout wrappers
│   │   ├── pages/            # One file per route
│   │   ├── routes/           # AppRoutes
│   │   ├── styles/           # index.css @theme + modular CSS
│   │   ├── three/            # webglGuard — the single WebGL gate
│   │   ├── types/            # Shared TypeScript types
│   │   └── utils/            # api.ts, formatters, helpers
│   ├── scripts/              # Icon subset, model optimisation
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── data/             # *.json — the actual data store
│   │   ├── middleware/       # Zod validation
│   │   ├── routes/           # github, blogs, gallery, projects
│   │   ├── schemas/          # Zod schemas
│   │   ├── services/         # File manager
│   │   ├── sync/             # GitHub + gallery sync jobs
│   │   ├── utils/            # Response helpers, asyncHandler
│   │   ├── seed.ts
│   │   └── server.ts         # Express entry point
│   ├── .env
│   └── package.json
└── README.md`;

// ============================
// Design System Colors
// ============================
export const designSystem = {
  mainTheme: [
    {
      name: "Periwinkle Pale",
      variable: "--color-periwinkle-pale",
      hex: "#E8EAF5",
    },
    { name: "Periwinkle", variable: "--color-periwinkle", hex: "#C8CDEB" },
    {
      name: "Periwinkle Mid",
      variable: "--color-periwinkle-mid",
      hex: "#A8B0D9",
    },
    { name: "Cool", variable: "--color-cool", hex: "#878CB4" },
    { name: "Cool Deep", variable: "--color-cool-deep", hex: "#5E6491" },
    { name: "Haze Light", variable: "--color-haze-light", hex: "#6B739A" },
    { name: "Haze", variable: "--color-haze", hex: "#465078" },
    { name: "Haze Deep", variable: "--color-haze-deep", hex: "#2E3558" },
    { name: "Midnight", variable: "--color-midnight", hex: "#1E233C" },
    {
      name: "Midnight Deep",
      variable: "--color-midnight-deep",
      hex: "#13172B",
    },
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
    {
      name: "Surface",
      variable: "--color-light-surface",
      hex: "rgba(255,255,255,0.55)",
    },
    {
      name: "Surface 2",
      variable: "--color-light-surface-2",
      hex: "rgba(255,255,255,0.82)",
    },
    {
      name: "Border",
      variable: "--color-light-border",
      hex: "rgba(30,35,60,0.10)",
    },
    { name: "Text", variable: "--color-light-text", hex: "#1E233C" },
    {
      name: "Text Secondary",
      variable: "--color-light-text-secondary",
      hex: "#2C3352",
    },
    {
      name: "Text Tertiary",
      variable: "--color-light-text-tertiary",
      hex: "#465078",
    },
    {
      name: "Text Muted",
      variable: "--color-light-text-muted",
      hex: "#5E6491",
    },
  ],
  darkMode: [
    { name: "Background", variable: "--color-dark-bg", hex: "#0A0F19" },
    {
      name: "Surface",
      variable: "--color-dark-surface",
      hex: "rgba(30,35,60,0.50)",
    },
    {
      name: "Surface 2",
      variable: "--color-dark-surface-2",
      hex: "rgba(46,53,88,0.65)",
    },
    {
      name: "Border",
      variable: "--color-dark-border",
      hex: "rgba(200,205,235,0.10)",
    },
    { name: "Text", variable: "--color-dark-text", hex: "#E8EAF5" },
    {
      name: "Text Secondary",
      variable: "--color-dark-text-secondary",
      hex: "#AEB5D9",
    },
    {
      name: "Text Tertiary",
      variable: "--color-dark-text-tertiary",
      hex: "#C8CDEB",
    },
    { name: "Text Muted", variable: "--color-dark-text-muted", hex: "#878CB4" },
  ],
  semanticTokens: [
    { name: "Accent", variable: "--color-accent", hex: "#2E3558" },
    {
      name: "Accent Foreground",
      variable: "--color-accent-foreground",
      hex: "#FFFFFF",
    },
    { name: "Success", variable: "--color-success", hex: "#2E7D32" },
    { name: "Error", variable: "--color-error", hex: "#C62828" },
    { name: "Warning", variable: "--color-warning", hex: "#E65100" },
  ],
  fonts: [
    {
      name: "Inter",
      variable: "--font-inter",
      usage: "Body text, UI elements",
    },
    {
      name: "Zen Kaku Gothic New",
      variable: "--font-zen",
      usage: "Japanese subtitles, decorative headings",
    },
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
