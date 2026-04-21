import { z } from 'zod';

export const projectLanguageSchema = z.object({
    name: z.string(),
    percentage: z.string(),
});

export const projectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(1, 'Description is required'),
    repo_url: z.string().url('Invalid repo URL'),
    demo_url: z.string().optional().default(''),
    img_url: z.string().optional().default(''),
    topics: z.array(z.string()),
    framework: z.array(z.string()),
    language: z.array(projectLanguageSchema),
    tech_stack: z.array(z.string()),
    stargazers_count: z.number().nonnegative(),
    forks_count: z.number().nonnegative(),
    category: z.string(),
    status: z.string(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
