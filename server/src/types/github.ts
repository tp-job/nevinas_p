/**
 * Minimal types for GitHub REST API responses used in sync.
 */

export interface GitHubApiProfile {
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

export interface GitHubApiRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    topics?: string[];
    stargazers_count: number;
    forks_count: number;
    watchers_count?: number;
    open_issues_count?: number;
    size: number;
    fork: boolean;
    archived: boolean;
    visibility?: string;
    default_branch?: string;
    pushed_at: string;
    created_at: string;
    updated_at: string;
}

export interface GitHubApiEventPayloadCommit {
    sha?: string;
    message?: string;
}

export interface GitHubApiEvent {
    id: string;
    type: string;
    created_at: string;
    repo?: { name?: string };
    payload?: {
        action?: string;
        commits?: GitHubApiEventPayloadCommit[];
        ref?: string;
        ref_type?: string;
    };
}
