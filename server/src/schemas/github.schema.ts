import { z } from 'zod';

export const githubProfileSchema = z.object({
    login: z.string(),
    name: z.string().nullable(),
    avatar_url: z.string().url(),
    html_url: z.string().url(),
    bio: z.string().nullable(),
    location: z.string().nullable(),
    blog: z.string().nullable(),
    public_repos: z.number(),
    public_gists: z.number(),
    followers: z.number(),
    following: z.number(),
});

export const githubRepoSchema = z.object({
    name: z.string(),
    full_name: z.string(),
    description: z.string().nullable(),
    html_url: z.string().url(),
    homepage: z.string().nullable(),
    language: z.string().nullable(),
    topics: z.array(z.string()),
    stargazers_count: z.number(),
    forks_count: z.number(),
    visibility: z.string(),
});
