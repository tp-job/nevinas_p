import { Router, type Request, type Response } from 'express';
import { dataStore } from '../services/fileManager';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
    const projects = dataStore.projects.readAll();
    res.json({ success: true, count: projects.length, data: projects });
});

export default router;
