/**
 * Pure TypeScript interfaces for all data entities.
 * Single source of truth — no Mongoose dependency.
 */

// ========== Blog ==========
export interface IBlog {
    id: string;
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
    created_at: string;
}

// ========== Project ==========
export interface IProjectLanguage {
    name: string;
    percentage: string;
}

export interface IProject {
    id: string;
    name: string;
    description: string;
    repo_url: string;
    demo_url: string;
    img_url: string;
    topics: string[];
    framework: string[];
    language: IProjectLanguage[];
    tech_stack: string[];
    stargazers_count: number;
    forks_count: number;
    category: string;
    status: string;
    created_at: string;
    updated_at: string;
}

// ========== Gallery ==========
export interface IGallery {
    id: string;
    name: string;
    img: string;
    created_at: string;
}

// ========== GitHub ==========
export interface IGitHubEventPayload {
    action?: string;
    commits?: { sha: string; message: string }[];
    ref?: string;
    ref_type?: string;
}

export interface IGitHubEvent {
    id: string;
    github_id: string;
    type: string;
    repo: string;
    payload: IGitHubEventPayload;
    event_at: string;
    synced_at: string;
}

export interface IGitHubProfile {
    id: string;
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
    github_created_at: string;
    github_updated_at: string;
    synced_at: string;
}

export interface IGitHubRepo {
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
    fork: boolean;
    archived: boolean;
    visibility: string;
    default_branch: string;
    pushed_at: string;
    github_created_at: string;
    github_updated_at: string;
    synced_at: string;
}

export interface IMonthlyActivity {
    month: string;
    commits: number;
    prs: number;
    issues: number;
}

export interface IProjectStatus {
    active: number;
    inactive: number;
    archived: number;
}

export interface ITopRepo {
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
}

export interface IGitHubStats {
    id: string;
    totalStars: number;
    totalForks: number;
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalCreateEvents: number;
    repoCount: number;
    languageDistribution: Record<string, number>;
    monthlyActivity: IMonthlyActivity[];
    commitsByMonth: Record<string, number>;
    dayOfWeekActivity: number[];
    hourActivity: number[];
    projectStatus: IProjectStatus;
    topRepos: ITopRepo[];
    profile: {
        login: string;
        name: string | null;
        avatar_url: string;
        bio: string | null;
        public_repos: number;
        followers: number;
        following: number;
    };
    synced_at: string;
}

/**
 * Combined GitHub data stored in a single file.
 */
export interface IGitHubData {
    profiles: IGitHubProfile[];
    events: IGitHubEvent[];
    repos: IGitHubRepo[];
    stats: IGitHubStats[];
}
