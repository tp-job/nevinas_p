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
