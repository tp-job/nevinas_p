import { z } from 'zod';

export const createBlogSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    excerpt: z.string().min(1, 'Excerpt is required').max(500),
    content: z.string().min(1, 'Content is required'),
    author: z.string().min(1, 'Author is required'),
    role: z.string().optional().default(''),
    date: z.string().min(1, 'Date is required'),
    readTime: z.string().optional().default('5 min read'),
    category: z.string().optional().default('General'),
    imageUrl: z.string().optional().default(''),
    authorAvatar: z.string().optional().default(''),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
