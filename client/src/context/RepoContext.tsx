import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { githubApi, type GitHubRepo } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";

/**
 * The repository list, fetched once for the whole /work section.
 *
 * WHY
 *
 * `githubApi.getRepos()` had six independent call sites — Dashboard, Docs,
 * GraphView, Performance, Repository and SkillShowcase (which itself serves
 * four routes). Each one mounted its own `useFetch`, so moving between any two
 * of those pages re-fetched the same ~50KB payload from scratch, and a session
 * that visited five of them made five requests for one unchanging list.
 *
 * React Context only, deliberately: this project has no TanStack Query and
 * CLAUDE.md says to keep it that way. That costs the cache-invalidation and
 * background-refresh machinery a query library would give, which is the right
 * trade here — the list changes when a GitHub sync runs, not while someone is
 * reading the page.
 *
 * TWO DECISIONS WORTH KNOWING ABOUT
 *
 * 1. `severity: "transient"`, never "fatal". Dashboard's own combined fetch
 *    used `fatal`, which escalates a 5xx to the full-page error screen. That
 *    is defensible for one page's primary fetch and wrong for a shared one —
 *    a fatal shared fetch means a repos outage blanks the entire /work section
 *    including pages that only use the list decoratively. This is exactly the
 *    failure useFetch's own docs describe: "a single failing background
 *    request blanked the whole app". Pages that genuinely cannot render
 *    without their data still escalate their OWN fetches (Dashboard still does
 *    this for getStats).
 * 2. `notifyOnError: false`. Every consumer either renders the failure inline
 *    (Repository and SkillShowcase both mount ErrorDisplay) or treats the list
 *    as optional and degrades to an empty section (Docs, Performance). A toast
 *    on top of an inline error reports the same failure twice, and the old
 *    per-page call sites had already independently set this to false for that
 *    reason. `error` is exposed so a consumer can still render it.
 */
interface RepoContextValue {
  repos: GitHubRepo[];
  loading: boolean;
  /** Non-null when the fetch failed; consumers render it inline. */
  error: string | null;
  refetch: () => Promise<void>;
}

const RepoContext = createContext<RepoContextValue | null>(null);

export const useRepos = (): RepoContextValue => {
  const ctx = useContext(RepoContext);
  if (!ctx) {
    throw new Error("useRepos must be used within a RepoProvider");
  }
  return ctx;
};

export const RepoProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading, error, refetch } = useFetch(githubApi.getRepos, [], {
    errorMessage: "Failed to fetch repositories from GitHub",
    notifyOnError: false,
    severity: "transient",
  });

  // `data ?? []` inline would be a new array identity on every render, which
  // would defeat the useMemo in every consumer that derives from this list.
  const repos = useMemo(() => data ?? [], [data]);

  const value = useMemo(
    () => ({ repos, loading, error, refetch }),
    [repos, loading, error, refetch],
  );

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
};
