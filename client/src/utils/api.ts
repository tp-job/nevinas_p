// In production the client (static site) and API live on different origins,
// so VITE_API_URL points at the backend (e.g. https://nevinas-api.onrender.com).
// When unset — local dev — the empty base lets the vite proxy (see
// vite.config.ts) route "/api" to localhost:3000. Trailing slash is stripped
// so we never build a "//api" URL.
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

// ----------------------------
// GitHub API
// ----------------------------

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: string;
  github_id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  size: number;
  github_created_at: string;
  github_updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  visibility: string;
  default_branch: string;
}

export interface GitHubStats {
  profile: {
    login: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
  };
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalCreateEvents: number;
  repoCount: number;
  languageDistribution: Record<string, number>;
  monthlyActivity: {
    month: string;
    commits: number;
    prs: number;
    issues: number;
  }[];
  commitsByMonth: Record<string, number>;
  dayOfWeekActivity: number[];
  hourActivity: number[];
  projectStatus: { active: number; inactive: number; archived: number };
  topRepos: {
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    topics: string[];
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    pushed_at: string;
  }[];
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: string;
  created_at: string;
  payload: {
    action?: string;
    commits?: { sha: string; message: string }[];
    ref?: string;
    ref_type?: string;
  };
}

// ----------------------------
// HTTP layer
// ----------------------------

/** One field-level validation failure, as produced by the Zod middleware. */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Error thrown for any failed API call.
 *
 * Carries what the SERVER actually said rather than a generic string. The
 * backend speaks three shapes and this type flattens all of them:
 *
 *   { success: false, message, error? }        — responseHelpers / 404 / 500
 *   { success: false, errors: [{field,message}] } — Zod validate middleware
 *   (no body / unparseable)                    — network failure, timeout, proxy
 *
 * `status` is 0 for failures that never produced an HTTP response at all.
 */
export class ApiError extends Error {
  status: number;
  /** Field-level failures from the Zod middleware, when present. */
  fieldErrors?: FieldError[];
  /** True when the request was aborted by our own timeout. */
  isTimeout: boolean;
  /** True when the request never reached the server (offline, DNS, CORS). */
  isNetwork: boolean;

  constructor(
    status: number,
    message?: string,
    opts: {
      fieldErrors?: FieldError[];
      isTimeout?: boolean;
      isNetwork?: boolean;
    } = {},
  ) {
    super(message ?? `Request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = opts.fieldErrors;
    this.isTimeout = opts.isTimeout ?? false;
    this.isNetwork = opts.isNetwork ?? false;
  }
}

/**
 * How badly a failure should be surfaced.
 *
 * `fatal` replaces the whole page with a 500/503/504 screen. `transient` is
 * reported in place — an inline error region today, a toast once the
 * notification system lands.
 *
 * The distinction exists because the old code escalated EVERY 5xx globally:
 * one failing background request (a single repo's languages call, a stale
 * README) blanked the entire app. Only a page's primary fetch — the one
 * without which the page has nothing to show — may be fatal, and it has to opt
 * in explicitly.
 */
export type ErrorSeverity = "fatal" | "transient";

/** Status codes that have a dedicated full-page screen. */
export type ServerErrorCode = 500 | 503 | 504;
const SERVER_ERROR_CODES: ServerErrorCode[] = [500, 503, 504];

/** True when this failure has a full-page screen available for it. */
export function isFatalStatus(status: number): status is ServerErrorCode {
  return SERVER_ERROR_CODES.includes(status as ServerErrorCode);
}

let _notifyServerError: ((code: ServerErrorCode) => void) | null = null;

/** AppRoutes registers ErrorContext's setError here. */
export const registerErrorHandler = (
  fn: (code: ServerErrorCode) => void,
): void => {
  _notifyServerError = fn;
};

/**
 * Escalate a failure to the full-page error screen.
 *
 * Deliberately NOT called from apiFetch. The HTTP layer cannot know whether a
 * given request was the reason the user opened the page or an optional
 * enrichment, so it reports facts and lets the caller decide. See useFetch's
 * `severity` option.
 */
export function escalateToErrorPage(status: number): void {
  if (isFatalStatus(status)) _notifyServerError?.(status);
}

/**
 * Default per-request timeout. A hung request otherwise spins forever.
 *
 * Sized for endpoints served straight from the JSON store, which answer in
 * milliseconds. Endpoints that proxy to GitHub need UPSTREAM_TIMEOUT_MS.
 */
export const DEFAULT_TIMEOUT_MS = 8000;

/**
 * Timeout for endpoints that proxy to api.github.com on the request path.
 *
 * Measured: `/repos/:name/readme` takes ~7.3 s against the unauthenticated
 * GitHub API, which the 8 s default clipped — aborting requests that were
 * about to succeed and reporting a timeout to the user. These calls are worth
 * waiting for because nothing else on the page substitutes for them.
 */
export const UPSTREAM_TIMEOUT_MS = 20000;

export interface ApiRequestOptions {
  /** Caller's abort signal; combined with the internal timeout. */
  signal?: AbortSignal;
  /** Override the default timeout. Pass 0 to disable it. */
  timeoutMs?: number;
}

/** Pull whatever the server said out of an error response body. */
async function readErrorBody(
  res: Response,
): Promise<{ message?: string; fieldErrors?: FieldError[] }> {
  try {
    const json = await res.json();
    if (!json || typeof json !== "object") return {};
    const fieldErrors = Array.isArray(json.errors)
      ? (json.errors as FieldError[])
      : undefined;
    // `error` carries the underlying detail in development builds.
    const message =
      typeof json.message === "string"
        ? json.message
        : typeof json.error === "string"
          ? json.error
          : fieldErrors?.length
            ? fieldErrors.map((e) => `${e.field}: ${e.message}`).join(", ")
            : undefined;
    return { message, fieldErrors };
  } catch {
    // Non-JSON body (proxy HTML, empty 502). Nothing to salvage.
    return {};
  }
}

// Generic fetch helper
async function apiFetch<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  const controller = new AbortController();
  const timer =
    timeoutMs > 0
      ? window.setTimeout(() => controller.abort(), timeoutMs)
      : null;
  // Honour a caller's signal as well as our timeout.
  const onExternalAbort = () => controller.abort();
  signal?.addEventListener("abort", onExternalAbort);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
    });
  } catch (err) {
    // An abort we caused is a timeout; an abort the caller caused should
    // propagate untouched so their cancellation logic still works.
    if (signal?.aborted) throw err;
    const timedOut = controller.signal.aborted;
    throw new ApiError(
      0,
      timedOut
        ? `Request timed out after ${timeoutMs}ms`
        : "Network error — could not reach the server",
      { isTimeout: timedOut, isNetwork: !timedOut },
    );
  } finally {
    if (timer !== null) window.clearTimeout(timer);
    signal?.removeEventListener("abort", onExternalAbort);
  }

  if (!res.ok) {
    const { message, fieldErrors } = await readErrorBody(res);
    throw new ApiError(res.status, message, { fieldErrors });
  }

  const json = await res.json();
  if (json.success === false) {
    throw new ApiError(res.status, json.message || "API error");
  }
  return json.data;
}

export interface GitHubReadme {
  content: string;
  encoding: string;
  name: string;
  html_url: string | null;
}

export const githubApi = {
  getProfile: (o?: ApiRequestOptions) =>
    apiFetch<GitHubProfile>("/api/github/profile", o),
  getRepos: (o?: ApiRequestOptions) =>
    apiFetch<GitHubRepo[]>("/api/github/repos", o),
  getStats: (o?: ApiRequestOptions) =>
    apiFetch<GitHubStats>("/api/github/stats", o),
  getEvents: (o?: ApiRequestOptions) =>
    apiFetch<GitHubEvent[]>("/api/github/events", o),
  // These two hit api.github.com on the request path — see UPSTREAM_TIMEOUT_MS.
  getRepoLanguages: (name: string, o?: ApiRequestOptions) =>
    apiFetch<Record<string, number>>(`/api/github/repos/${name}/languages`, {
      timeoutMs: UPSTREAM_TIMEOUT_MS,
      ...o,
    }),
  getRepoReadme: (name: string, o?: ApiRequestOptions) =>
    apiFetch<GitHubReadme>(`/api/github/repos/${name}/readme`, {
      timeoutMs: UPSTREAM_TIMEOUT_MS,
      ...o,
    }),
};

// ----------------------------
// Existing APIs (MongoDB)
// ----------------------------

export interface BlogData {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  authorAvatar: string;
  created_at?: string;
}

export const blogsApi = {
  getAll: (o?: ApiRequestOptions) => apiFetch<BlogData[]>("/api/blogs", o),
  getById: (id: string, o?: ApiRequestOptions) =>
    apiFetch<BlogData>(`/api/blogs/${id}`, o),
};

export interface GalleryItem {
  id: string;
  img: string;
  name?: string;
  category?: string;
  created_at?: string;
}

export const galleryApi = {
  getAll: (o?: ApiRequestOptions) => apiFetch<GalleryItem[]>("/api/gallery", o),
};
