import type { ComponentType } from "react";
import {
  SiMongodb,
  SiExpress,
  SiVite,
  SiFigma,
  SiGo,
  SiRust,
  SiVuedotjs,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiDart,
  SiDocker,
  SiGithub,
  SiGit,
  SiRedux,
  SiNextdotjs,
  SiJsonwebtokens,
} from "react-icons/si";
import {
  FaCode,
  FaPalette,
  FaCube,
  FaCheckSquare,
  FaPython,
  FaHtml5,
  FaCss3,
  FaReact,
} from "react-icons/fa";
import { FaNodeJs } from "react-icons/fa6";
import { RiTailwindCssFill } from "react-icons/ri";
import { BsJavascript, BsTypescript } from "react-icons/bs";

export interface IconMeta {
  Icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
  label: string;
}

export const LANG_ICONS: Record<string, IconMeta> = {
  TypeScript: { Icon: BsTypescript, color: "#3178c6", label: "TypeScript" },
  JavaScript: { Icon: BsJavascript, color: "#f1e05a", label: "JavaScript" },
  Python: { Icon: FaPython, color: "#3572A5", label: "Python" },
  HTML: { Icon: FaHtml5, color: "#e34c26", label: "HTML" },
  CSS: { Icon: FaCss3, color: "#563d7c", label: "CSS" },
  Go: { Icon: SiGo, color: "#00ADD8", label: "Go" },
  Rust: { Icon: SiRust, color: "#dea584", label: "Rust" },
  Vue: { Icon: SiVuedotjs, color: "#41b883", label: "Vue" },
  PHP: { Icon: SiPhp, color: "#4F5D95", label: "PHP" },
  Ruby: { Icon: SiRuby, color: "#701516", label: "Ruby" },
  Swift: { Icon: SiSwift, color: "#F05138", label: "Swift" },
  Kotlin: { Icon: SiKotlin, color: "#A97BFF", label: "Kotlin" },
  Dart: { Icon: SiDart, color: "#00B4AB", label: "Dart" },
};

export const TOOL_ICONS = {
  code: { Icon: FaCode, color: "#7a90ff", label: "Code" },
  uxui: { Icon: SiFigma, color: "#a259ff", label: "UX / UI" },
  rendering: { Icon: FaReact, color: "#61dafb", label: "Rendering" },
  tasks: { Icon: FaCheckSquare, color: "#6de6c1", label: "Tasks" },
  languages: { Icon: FaCube, color: "#e5c07b", label: "Languages" },
  design: { Icon: FaPalette, color: "#f472b6", label: "Design" },
} as const;

export const STACK_ICONS: Record<string, IconMeta> = {
  ...LANG_ICONS,
  Node: { Icon: FaNodeJs, color: "#3c873a", label: "Node" },
  MongoDB: { Icon: SiMongodb, color: "#4DB33D", label: "MongoDB" },
  Express: { Icon: SiExpress, color: "#eaeaea", label: "Express" },
  Vite: { Icon: SiVite, color: "#bd34fe", label: "Vite" },
  Tailwind: { Icon: RiTailwindCssFill, color: "#38bdf8", label: "Tailwind" },
  React: { Icon: FaReact, color: "#61dafb", label: "React" },
  Next: { Icon: SiNextdotjs, color: "#ffffff", label: "Next.js" },
  Redux: { Icon: SiRedux, color: "#764abc", label: "Redux" },
  Docker: { Icon: SiDocker, color: "#2496ed", label: "Docker" },
  Git: { Icon: SiGit, color: "#f05033", label: "Git" },
  GitHub: { Icon: SiGithub, color: "#e6e6e6", label: "GitHub" },
  JWT: { Icon: SiJsonwebtokens, color: "#d63aff", label: "JWT" },
  Figma: { Icon: SiFigma, color: "#a259ff", label: "Figma" },
};

export function inferStackFromRepo(repo: {
  name: string;
  description: string | null;
  topics: string[];
  language: string | null;
}): IconMeta[] {
  const hay = `${repo.name} ${repo.description ?? ""} ${repo.topics.join(" ")}`.toLowerCase();
  const picks: IconMeta[] = [];
  const push = (k: string) => {
    const m = STACK_ICONS[k];
    if (m && !picks.some((p) => p.label === m.label)) picks.push(m);
  };
  if (/\breact\b/.test(hay)) push("React");
  if (/\bnext(js)?\b/.test(hay)) push("Next");
  if (/\bvite\b/.test(hay)) push("Vite");
  if (/\btailwind\b/.test(hay)) push("Tailwind");
  if (/\bredux\b/.test(hay)) push("Redux");
  if (/\bnode(js)?\b|\bexpress\b/.test(hay)) push("Node");
  if (/\bexpress\b/.test(hay)) push("Express");
  if (/\bmongo(db)?\b|\bmern\b/.test(hay)) push("MongoDB");
  if (/\bmern\b/.test(hay)) {
    push("MongoDB");
    push("Express");
    push("React");
    push("Node");
  }
  if (/\bdocker\b/.test(hay)) push("Docker");
  if (/\bjwt\b/.test(hay)) push("JWT");
  if (/\bfigma\b/.test(hay)) push("Figma");
  if (repo.language && LANG_ICONS[repo.language]) {
    picks.push(LANG_ICONS[repo.language]);
  }
  return picks.slice(0, 6);
}
