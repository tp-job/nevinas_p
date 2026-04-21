import { Router, type Request, type Response } from 'express';
import { dataStore } from '../services/fileManager';
import { send404 } from '../utils/responseHelpers';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
    const blogs = dataStore.blogs
        .readAll()
        .slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json({ success: true, count: blogs.length, data: blogs });
});

router.get('/:id', (req: Request, res: Response): void => {
    const blog = dataStore.blogs.findById(String(req.params.id));
    if (!blog) {
        send404(res, 'Blog not found');
        return;
    }
    res.json({ success: true, data: blog });
});

export default router;
