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
export const projectDetailByRepo: Record<string, typeof architecture> = {
  nevinas_p: architecture,
  nevinas_ka_i: architecture,
};
export const folderStructure = `project/
├── client/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ │ ├── card/ # Card components (Blog, Repo, Project, Tool, TechStack)
│ │ │ ├── charts/ # Data visualization components
│ │ │ ├── common/ # Loading, Error, NotFound pages
│ │ │ └── layouts/ # Navbar, Sidebar, Header, Footer
│ │ ├── context/ # React Context providers
│ │ ├── data/ # Static data files
│ │ ├── layouts/ # Page layout wrappers
│ │ ├── pages/ # Route page components
│ │ ├── routes/ # Route configuration
│ │ ├── styles/ # CSS files
│ │ ├── types/ # TypeScript interfaces
│ │ └── utils/ # API service, helpers
│ ├── package.json
│ └── vite.config.ts
├── server/
│ ├── src/
│ │ ├── data/ # Seed data (JSON)
│ │ ├── middleware/ # Auth middleware
│ │ ├── models/ # Mongoose models
│ │ ├── routes/ # API routes (auth, github)
│ │ └── server.js # Express entry point
│ ├── .env # Environment variables
│ └── package.json
└── docs/ # Documentation`;
