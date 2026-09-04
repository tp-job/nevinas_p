import { motion } from "framer-motion";
import { PillNode } from "@/components/ui/PillNode";
import { StaggerList, StaggerItem } from "@/components/ui/StaggerList";

/* ============================================================================
 * Tech reference data — the exact 10 tokens design-v3-2.md reserves under
 * "Tech Dot Colors" (Section 3), each paired with a real reference link.
 * ==========================================================================*/

type TechKey =
  | "javascript"
  | "css"
  | "html"
  | "python"
  | "react"
  | "tailwindcss"
  | "git"
  | "github"
  | "nodejs"
  | "vscode";

const TECH: Record<TechKey, { label: string; href: string }> = {
  javascript: { label: "JavaScript", href: "https://developer.mozilla.org/docs/Web/JavaScript" },
  css: { label: "CSS", href: "https://developer.mozilla.org/docs/Web/CSS" },
  html: { label: "HTML", href: "https://developer.mozilla.org/docs/Web/HTML" },
  python: { label: "Python", href: "https://docs.python.org/3/" },
  react: { label: "React", href: "https://react.dev" },
  tailwindcss: { label: "Tailwind CSS", href: "https://tailwindcss.com/docs" },
  git: { label: "Git", href: "https://git-scm.com/doc" },
  github: { label: "GitHub", href: "https://docs.github.com" },
  nodejs: { label: "Node.js", href: "https://nodejs.org/en/docs" },
  vscode: { label: "VS Code", href: "https://code.visualstudio.com/docs" },
};

/** Small colored swatch — same idea as Chip's `dot` prop, just per-tech instead of `currentColor`. Plugged into PillNode's existing `icon` slot, so PillNode itself is unmodified. */
function TechDot({ tech }: { tech: TechKey }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full ring-1 ring-white/15"
      style={{ background: `var(--color-${tech})` }}
    />
  );
}

/* ============================================================================
 * Timeline data
 * ==========================================================================*/

interface Contributor {
  id: string;
  name: string;
  role: string;
  blurb: string;
  /** Icon system allows max 30% warm (Mountbatten) variant — one of five here. */
  warm?: boolean;
  techs: TechKey[];
}

const CONTRIBUTORS: Contributor[] = [
  {
    id: "c1",
    name: "Alex Rivera",
    role: "Project Manager",
    blurb: "Coordinated scope and timeline across the build, from kickoff to handoff.",
    techs: ["git", "github"],
  },
  {
    id: "c2",
    name: "Priya Shah",
    role: "Backend Engineer",
    blurb: "Built the API and data layer the rest of the team's work runs on.",
    warm: true,
    techs: ["python", "nodejs"],
  },
  {
    id: "c3",
    name: "Marcus Lin",
    role: "Frontend Engineer",
    blurb: "Implemented the component library and wired it up to live data.",
    techs: ["react", "javascript", "tailwindcss"],
  },
  {
    id: "c4",
    name: "Sofia Tan",
    role: "UI/UX Designer",
    blurb: "Designed the interface and the motion language that ties it together.",
    techs: ["css", "html"],
  },
  {
    id: "c5",
    name: "Jordan Blake",
    role: "DevOps Engineer",
    blurb: "Set up the pipeline and the tooling the rest of the team works inside.",
    techs: ["vscode", "git"],
  },
];

/* ============================================================================
 * Avatar — cool gradient by default, warm (Mountbatten) for max 30% of cards
 * ==========================================================================*/

function Avatar({ name, warm }: { name: string; warm?: boolean }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                 bg-gradient-to-br text-[13px] font-medium text-(--dark-text)
                 ${warm ? "from-sub-mount to-midnight" : "from-periwinkle to-haze"}`}
    >
      {initials}
    </span>
  );
}

/* ============================================================================
 * Card — surface treatment lifted from FeatCard (13.4), content is bespoke
 * ==========================================================================*/

function ContributorCard({ contributor }: { contributor: Contributor }) {
  return (
    <div
      className="rounded-[24px] border border-[rgba(200,205,235,0.10)]
                 bg-[rgba(30,35,60,0.50)] p-6 text-left backdrop-blur-[16px]
                 transition-all duration-300
                 hover:border-[rgba(200,205,235,0.18)]
                 hover:bg-[rgba(46,53,88,0.60)]"
    >
      <div className="flex items-center gap-3">
        <Avatar name={contributor.name} warm={contributor.warm} />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-normal text-(--dark-text)">
            {contributor.name}
          </p>
          <p className="truncate text-xs text-(--dark-text-sec)">{contributor.role}</p>
        </div>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-(--dark-text-sec)">
        {contributor.blurb}
      </p>

      <p className="mb-2.5 mt-5 text-[0.65rem] font-semibold uppercase tracking-widest text-(--dark-text-muted)">
        Tech Stack
      </p>
      <div className="flex flex-wrap gap-2">
        {contributor.techs.map((key) => (
          <a
            key={key}
            href={TECH[key].href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-(--dark-border)"
          >
            <PillNode label={TECH[key].label} icon={<TechDot tech={key} />} />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * Rail — phase label, glow-pulse, dot, and the line segment through it.
 * Dot is centered via flex on a div with the same px-4 as the card below it,
 * so the line (absolute, ignores that padding) lands exactly on the dot.
 * ==========================================================================*/

function TimelineRail({ index, total }: { index: number; total: number }) {
  const lineSpan =
    index === 0
      ? "left-1/2 right-0"
      : index === total - 1
        ? "left-0 right-1/2"
        : "left-0 right-0";

  return (
    <div className="relative mb-6 flex h-3 items-center justify-center px-4">
      <span
        aria-hidden
        className={`absolute top-1/2 h-px -translate-y-1/2 bg-(--dark-border) ${lineSpan}`}
      />

      <span
        aria-hidden
        className="absolute -top-7 whitespace-nowrap text-[0.65rem] font-medium uppercase tracking-widest text-(--dark-text-muted)"
      >
        Phase {String(index + 1).padStart(2, "0")}
      </span>

      <motion.span
        aria-hidden
        className="absolute h-6 w-6 rounded-full bg-periwinkle"
        animate={{ scale: [1, 1.8, 1], opacity: [0.22, 0, 0.22] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
      />

      <span className="relative z-10 h-3 w-3 rounded-full bg-periwinkle ring-2 ring-(--dark-bg)" />
    </div>
  );
}

/* ============================================================================
 * Page
 * ==========================================================================*/

export default function ContributorTimeline() {
  return (
    <section className="grain relative bg-(--dark-bg) px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 max-w-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-(--dark-text-muted)">
            Timeline
          </p>
          <h2 className="mb-1.5 text-4xl font-light leading-tight text-(--dark-text) sm:text-5xl">
            Built by
          </h2>
          <p className="text-sm font-normal text-(--dark-text-sec)">
            Five people, five parts of the stack — left to right, in the order they touched it.
          </p>
        </div>

        <div className="-mx-6 overflow-x-auto px-6 pb-6 sm:-mx-10 sm:px-10">
          <StaggerList className="flex">
            {CONTRIBUTORS.map((contributor, i) => (
              <StaggerItem key={contributor.id} className="relative w-[272px] shrink-0">
                <TimelineRail index={i} total={CONTRIBUTORS.length} />
                <div className="px-4">
                  <ContributorCard contributor={contributor} />
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </div>
    </section>
  );
}