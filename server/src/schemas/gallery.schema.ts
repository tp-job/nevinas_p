import { z } from 'zod';

export const createGallerySchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    img: z.string().min(1, 'Image path is required'),
});

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;
