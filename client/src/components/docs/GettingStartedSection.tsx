import type { FC } from "react";
import { gettingStarted } from "@/data/docData";
import DocSection from "./DocSection";
import CodeBlock from "./CodeBlock";

/**
 * Getting Started — the one place on this page numbering is honest.
 *
 * Every other section here is reference material, read in whatever order the
 * reader needs it — numbering "Design System" or "Changelog" would imply a
 * sequence that does not exist. This section genuinely is a sequence: step 4
 * only makes sense after step 2. `gettingStarted` in docData.ts was corrected
 * in Phase 1 of this plan — no MongoDB, no `mongod`, real ports, an actual
 * `npm run seed` script.
 */
const GettingStartedSection: FC = () => (
  <DocSection
    title="Getting Started"
    subtitle="Clone, install, and run both dev servers."
  >
    {/* list-none + no padding: the numbered circle IS the marker, so a native
        "1." list-style would double it. */}
    <ol className="list-none space-y-8 pl-0">
      {gettingStarted.map((step) => (
        <li key={step.step} className="flex gap-4">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                       text-xs font-semibold tabular-nums
                       bg-light-surface-2 dark:bg-dark-surface
                       border border-light-border dark:border-dark-border
                       text-light-text-secondary dark:text-dark-text-secondary"
          >
            {step.step}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-light-text dark:text-dark-text mb-1">
              {step.title}
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3">
              {step.description}
            </p>
            <CodeBlock code={step.command} />
          </div>
        </li>
      ))}
    </ol>
  </DocSection>
);

export default GettingStartedSection;
