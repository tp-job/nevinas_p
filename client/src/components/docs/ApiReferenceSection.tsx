import type { FC } from "react";
import { apiEndpoints } from "@/data/docData";
import DocSection from "./DocSection";

/**
 * API Reference — the section the page's own lead paragraph promises and,
 * until now, never delivered.
 *
 * `apiEndpoints` was corrected in Phase 1 of this plan: 4 real routes were
 * missing (this page's own README call among them), and the gallery response
 * shape was wrong. `npm run docs:check` keeps this list honest against
 * `server/src/routes/*.ts` going forward.
 *
 * None of the 12 endpoints require auth — the project has none — so a
 * per-row "Auth: No" badge repeated 12 times would be noise; said once in
 * the subtitle instead.
 *
 * SOLID fills with fixed white text, not `TH.token` at low alpha on the page
 * background. That was the first version, and it measured 2.67:1 for GET
 * (10 of the 12 rows) in light mode against the 4.5 bar — caught by
 * re-measuring, not assumed safe. The root cause was two-fold: compositing a
 * translucent copy of a colour onto a background pulls contrast toward 1:1 as
 * alpha rises, and `TH.primary` (#878CB4, "Cool Gray") is independently too
 * light for text on a near-white page — 2.96:1 even with NO tint at all, the
 * same failure class already fixed once this session in Loading.tsx's
 * spinner. A solid fill sidesteps both: the badge is its own opaque surface,
 * so its contrast is independent of the page and the theme, and only needs
 * checking once. Verified against white: haze 7.84, haze-deep 11.89,
 * english-violet-1 7.93, the DS error red 5.62 — all comfortably ≥ 4.5.
 */
const METHOD_COLOR: Record<string, string> = {
  GET: "#465078", // Haze Purple
  POST: "#2E3558", // Haze Deep
  PUT: "#524E68", // English Violet 1 (sub-palette; opaque fill, not text/border)
  // DELETE is the one legitimate case for the semantic error red here — this
  // communicates a genuinely destructive method, not decoration, which is
  // exactly what DS v3.2 §1.10 reserves status colour for.
  DELETE: "#C62828",
};
const DEFAULT_METHOD_COLOR = "#465078";

const ApiReferenceSection: FC = () => (
  <DocSection
    title="API Reference"
    subtitle="All endpoints are public — this project has no authentication."
    wide
  >
    <div className="overflow-x-auto rounded-xl border border-light-border dark:border-dark-border">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-light-border dark:border-dark-border bg-light-surface-2 dark:bg-dark-surface">
            <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-light-text-tertiary dark:text-dark-text-muted">
              Method
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-light-text-tertiary dark:text-dark-text-muted">
              Path
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-light-text-tertiary dark:text-dark-text-muted">
              Description
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-light-text-tertiary dark:text-dark-text-muted">
              Response
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-light-border dark:divide-dark-border">
          {apiEndpoints.map((ep) => (
            <tr key={`${ep.method} ${ep.path}`}>
              <td className="px-4 py-2.5 align-top">
                <span
                  className="inline-block rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white"
                  style={{
                    backgroundColor: METHOD_COLOR[ep.method] ?? DEFAULT_METHOD_COLOR,
                  }}
                >
                  {ep.method}
                </span>
              </td>
              <td className="px-4 py-2.5 align-top font-mono text-xs text-light-text dark:text-dark-text whitespace-nowrap">
                {ep.path}
              </td>
              <td className="px-4 py-2.5 align-top text-light-text-secondary dark:text-dark-text-secondary">
                {ep.description}
              </td>
              <td className="px-4 py-2.5 align-top font-mono text-xs text-light-text-tertiary dark:text-dark-text-muted">
                {ep.response}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DocSection>
);

export default ApiReferenceSection;
