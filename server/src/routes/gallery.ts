import { Router, type Request, type Response, type RequestHandler } from 'express';
import { dataStore } from '../services/fileManager';
import { asyncHandler } from '../utils/asyncHandler';

export default function createGalleryRoutes(uploadSingle: RequestHandler): Router {
    const router = Router();

    router.post('/upload', uploadSingle, asyncHandler(async (req: Request, res: Response): Promise<void> => {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }

        const newImage = await dataStore.gallery.create({
            name: req.file.filename,
            img: `/uploads/images/${req.file.filename}`,
            created_at: new Date().toISOString(),
        });

        res.json({ success: true, message: 'Image uploaded successfully', data: newImage });
    }));

    router.get('/', (_req: Request, res: Response): void => {
        const images = dataStore.gallery
            .readAll()
            .slice()
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        res.json({ success: true, count: images.length, data: images });
    });

    return router;
}
