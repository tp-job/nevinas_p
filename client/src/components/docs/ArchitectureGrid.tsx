import type { FC } from "react";
import type { architecture } from "@/data/docData";
import GroupLabel from "./GroupLabel";

interface ArchitectureGridProps {
  data: typeof architecture;
}

/**
 * Architecture Overview — the stack as a spec sheet.
 *
 * MATCHED TO THE DESIGN SYSTEM SECTION, DELIBERATELY
 *
 * This was three hover-lifting cards, each with a gradient top bar and a
 * gradient circular icon badge, holding rounded tiles that each held another
 * icon tile — inside a `cardCls` panel that had its own gradient bar. Four
 * levels of rounded border, and the Design System section next to it had just
 * been flattened to one. Two adjacent sections of the same document rendering
 * the same kind of content in two different visual languages is worse than
 * either choice made consistently.
 *
 * So it now uses the same three devices: a GroupLabel over a hairline, rows on
 * the page rather than in boxes, and values set in `font-mono` on the right.
 * Read straight down, an entry here answers the same shape of question a token
 * row does — what is this slot called, and what is currently in it.
 *
 * WHAT WAS DROPPED AND WHY
 *
 * The per-row icons are gone. FIELD_ICONS mapped 13 keys, the data has 22, so
 * eleven rows — animation, graph, threeD, markdown, dataStore, validation,
 * security, uploads, scheduling, clientDev, serverDev — all fell through to
 * the same generic `ri-checkbox-blank-circle-line`. A glyph that is identical
 * on half the rows is not an aid to scanning, it is noise with a lookup table
 * behind it. Completing the map would also mean a new `ri-*` subset build
 * (see CLAUDE.md) to buy decoration that carries no information: unlike a
 * colour chip in the Design System, which IS the value it sits next to, an
 * icon here says nothing the role name does not already say.
 *
 * The per-layer accent colours went with them. They encoded "these three
 * groups are different", which the labels already state.
 */

/**
 * Keys whose sentence-cased form reads wrong.
 *
 * The generic rule below splits camelCase and lowercases the tail, which is
 * right for `buildTool` → "Build tool" and wrong for anything containing an
 * initialism or a numeral: `threeD` came out as "Three d" and `externalApi` as
 * "External api". Two exceptions are cheaper and clearer than a general
 * acronym-detection rule that would have to guess.
 */
const ROLE_LABELS: Record<string, string> = {
  threeD: "3D",
  externalApi: "External API",
};

/** Turn a data key into a readable role: `buildTool` → `Build tool`. */
function roleLabel(key: string): string {
  if (ROLE_LABELS[key]) return ROLE_LABELS[key];
  const spaced = key.replace(/([A-Z])/g, " $1").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

const LAYERS = [
  {
    title: "Frontend",
    subtitle: "client-side layer",
    key: "frontend",
  },
  {
    title: "Backend",
    subtitle: "server & data layer",
    key: "backend",
  },
  {
    title: "Dev Tools",
    subtitle: "build & tooling",
    key: "devTools",
  },
] as const;

const ArchitectureGrid: FC<ArchitectureGridProps> = ({ data }) => (
  <div>
    {LAYERS.map((layer) => {
      const entries = Object.entries(data[layer.key]);
      return (
        <div key={layer.title} className="mb-12 last:mb-0">
          <GroupLabel
            label={layer.title}
            note={`${layer.subtitle} · ${entries.length} entries`}
          />
          <dl className="text-sm">
            {entries.map(([key, value]) => (
              <div
                key={key}
                className="flex items-baseline gap-3 border-b border-light-border/60 py-1.5 last:border-0 dark:border-dark-border/60"
              >
                <dt className="min-w-0 flex-1 truncate text-light-text dark:text-dark-text">
                  {roleLabel(key)}
                </dt>
                {/* Values wrap rather than truncate: "three.js (raw WebGL,
                    guarded)" and "ESLint 9 + TypeScript-ESLint" are the two
                    longest, and both carry a qualifier in the tail that is the
                    most useful part of the entry to a reader. */}
                <dd className="max-w-[60%] shrink-0 text-right font-mono text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );
    })}
  </div>
);

export default ArchitectureGrid;
