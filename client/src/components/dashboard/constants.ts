// Shared constants for the Dashboard page sections.

export const SKILL_ICONS: Record<string, { icon: string; color: string }> = {
  react: { icon: "ri-reactjs-line", color: "#61dafb" },
  reactjs: { icon: "ri-reactjs-line", color: "#61dafb" },
  tailwindcss: { icon: "ri-tailwind-css-fill", color: "#06b6d4" },
  tailwind: { icon: "ri-tailwind-css-fill", color: "#06b6d4" },
  nodejs: { icon: "ri-nodejs-line", color: "#339933" },
  javascript: { icon: "ri-javascript-line", color: "#f7df1e" },
  typescript: { icon: "ri-code-s-slash-line", color: "#3178c6" },
  python: { icon: "ri-code-line", color: "#3572A5" },
  html: { icon: "ri-html5-line", color: "#e34c26" },
  css: { icon: "ri-css3-line", color: "#563d7c" },
  mongodb: { icon: "ri-database-2-line", color: "#47A248" },
  express: { icon: "ri-server-line", color: "#000000" },
  fullstack: { icon: "ri-stack-line", color: "#5983FC" },
  portfolio: { icon: "ri-user-line", color: "#964EC2" },
};

export const TH = {
  royal: "#3E60C1",
  azure: "#5983FC",
  indigo: "#50409A",
  orchid: "#964EC2",
  flamingo: "#FF7BBF",
  blue: "#4285f4",
  purple: "#608dee",
  green: "#0f9d58",
  yellow: "#f4b400",
  pink: "#e863fa",
};

// Chart styling
export const gridColor = "var(--color-border-primary)";
export const tickColor = "var(--color-text-secondary)";
export const cardBg = "var(--color-surface-primary)";
export const cardCls =
  "bg-light-surface dark:bg-dark-bg backdrop-blur-xl border border-light-border dark:border-dark-border rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)]";
