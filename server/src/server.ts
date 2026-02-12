import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/auth';
import githubRoutes from './routes/github';
import Project from './models/Project';
import Blog from './models/Blog';
import Gallery from './models/Gallery';
import { startGitHubScheduler } from './services/githubScheduler';

const app = express();

// ----------------------------
// Environment Variables
// ----------------------------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nevinas';
const PORT = Number(process.env.PORT) || 3000;

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
// Routes
// ----------------------------
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);

// ----------------------------
// Multer Config
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
// Health Check
// ----------------------------
app.get('/health', (_req: Request, res: Response) => {
    const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const readyState = mongoose.connection.readyState;
    res.json({
        status: 'OK',
        database: dbStates[readyState] || 'unknown',
        dbHost: MONGODB_URI.replace(/\/\/.*@/, '//***@'),
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
        version: '2.0.0',
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
// Projects API
// ----------------------------
app.get('/api/projects', async (_req: Request, res: Response) => {
    try {
        const projects = await Project.find();
        res.json({ success: true, count: projects.length, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: (err as Error).message });
    }
});

// ----------------------------
// Blogs API
// ----------------------------
app.get('/api/blogs', async (_req: Request, res: Response) => {
    try {
        const blogs = await Blog.find().sort({ created_at: -1 });
        res.json({ success: true, count: blogs.length, data: blogs });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: (err as Error).message });
    }
});

app.get('/api/blogs/:id', async (req: Request, res: Response) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        res.json({ success: true, data: blog });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: (err as Error).message });
    }
});

// ----------------------------
// Gallery API
// ----------------------------
app.post('/api/gallery/upload', upload.single('image'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }

        const newImage = new Gallery({
            name: req.file.filename,
            img: `/uploads/images/${req.file.filename}`,
        });

        await newImage.save();
        res.json({ success: true, message: 'Image uploaded successfully', data: newImage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Upload failed', error: (err as Error).message });
    }
});

app.get('/api/gallery', async (_req: Request, res: Response) => {
    try {
        const images = await Gallery.find().sort({ created_at: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: (err as Error).message });
    }
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
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// ----------------------------
// Connect MongoDB & Start Server
// ----------------------------
async function startServer(): Promise<void> {
    try {
        console.log(`Connecting to MongoDB: ${MONGODB_URI}`);
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully');

        // Start GitHub scheduler after DB is connected
        startGitHubScheduler();

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err.message);
        });
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', (err as Error).message);
        console.log('Server will start without database connection.');
    }

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
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});
