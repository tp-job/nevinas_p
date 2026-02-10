const API_BASE_URL = 'http://localhost:3000';

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
    id: number;
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
    created_at: string;
    updated_at: string;
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
    monthlyActivity: { month: string; commits: number; prs: number; issues: number }[];
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

// Generic fetch helper
async function apiFetch<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    if (json.success === false) throw new Error(json.message || 'API error');
    return json.data;
}

export const githubApi = {
    getProfile: () => apiFetch<GitHubProfile>('/api/github/profile'),
    getRepos: () => apiFetch<GitHubRepo[]>('/api/github/repos'),
    getStats: () => apiFetch<GitHubStats>('/api/github/stats'),
    getEvents: () => apiFetch<GitHubEvent[]>('/api/github/events'),
    getRepoLanguages: (name: string) => apiFetch<Record<string, number>>(`/api/github/repos/${name}/languages`),
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
    getAll: () => apiFetch<BlogData[]>('/api/blogs'),
    getById: (id: string) => apiFetch<BlogData>(`/api/blogs/${id}`),
};

export const projectsApi = {
    getAll: () => apiFetch<any[]>('/api/projects'),
};
