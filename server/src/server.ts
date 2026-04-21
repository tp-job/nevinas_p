import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import githubRoutes from './routes/github';
import projectsRoutes from './routes/projects';
import blogsRoutes from './routes/blogs';
import createGalleryRoutes from './routes/gallery';
import { startGitHubScheduler } from './services/githubScheduler';
import { dataStore } from './services/fileManager';

const app = express();

// ----------------------------
// Environment Variables
// ----------------------------
const PORT = Number(process.env.PORT) || 3000;

// ----------------------------
// Initialize Data Store
// ----------------------------
dataStore.init();

// ----------------------------
// Security & Middleware
// ----------------------------
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow serving static images cross-origin
    })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ----------------------------
// Multer Config (must be before gallery routes)
// ----------------------------
const uploadDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, uploadDir);
    },
    filename(_req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// ----------------------------
// Routes
// ----------------------------
app.use('/api/github', githubRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/gallery', createGalleryRoutes(upload.single('image')));

// ----------------------------
// Health Check
// ----------------------------
app.get('/health', (_req: Request, res: Response) => {
    res.json({
        status: 'OK',
        storage: 'file-based',
        dataStore: dataStore.isReady() ? 'ready' : 'not initialized',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// ----------------------------
// Root Route
// ----------------------------
app.get('/', (_req: Request, res: Response) => {
    res.json({
        message: 'Welcome to Nevinas API',
        version: '3.0.0',
        status: 'running',
        endpoints: {
            health: 'GET /health',
            projects: 'GET /api/projects',
            blogs: 'GET /api/blogs',
            gallery: 'GET /api/gallery',
            github_profile: 'GET /api/github/profile',
            github_repos: 'GET /api/github/repos',
            github_stats: 'GET /api/github/stats',
            github_events: 'GET /api/github/events',
            github_sync: 'POST /api/github/sync',
        },
        timestamp: new Date().toISOString(),
    });
});

// ----------------------------
// 404 Handler
// ----------------------------
app.all('{*path}', (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method,
    });
});

// ----------------------------
// Error Handler (Express 5 requires 4 parameters)
// ----------------------------
interface ErrorWithStatus extends Error {
    status?: number;
}

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status = (err as ErrorWithStatus).status ?? 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('Server Error:', message);
    res.status(status).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: message }),
    });
});

// ----------------------------
// Start Server
// ----------------------------
function startServer(): void {
    // Start GitHub scheduler
    startGitHubScheduler();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
}

startServer();

// ----------------------------
// Graceful Shutdown
// ----------------------------
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    process.exit(0);
});
