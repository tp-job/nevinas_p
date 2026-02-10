console.log('Starting server.js execution...');
// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('./models/Project');
const Gallery = require('./models/Gallery');
const Blog = require('./models/Blog');

const app = express();
const authRoutes = require('./routes/auth');
const githubRoutes = require('./routes/github');

// ----------------------------
// 🔑 Environment Variables
// ----------------------------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nevinas';
const PORT = process.env.PORT || 3000;

// ----------------------------
// 🔧 Middleware
// ----------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);

// ----------------------------
// 📁 Multer Config
// ----------------------------
const uploadDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// ----------------------------
// 🏥 Health Check (ตรวจสอบก่อน routes อื่น)
// ----------------------------
app.get('/health', (req, res) => {
    const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const readyState = mongoose.connection.readyState;
    res.json({
        status: 'OK',
        database: dbStates[readyState] || 'unknown',
        dbHost: MONGODB_URI.replace(/\/\/.*@/, '//***@'),
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// ----------------------------
// 🏠 Root Route
// ----------------------------
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Nevinas API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: 'GET /health',
            projects: 'GET /api/projects',
            blogs: 'GET /api/blogs',
            gallery: 'GET /api/gallery',
            github_profile: 'GET /api/github/profile',
            github_repos: 'GET /api/github/repos',
            github_stats: 'GET /api/github/stats',
            github_events: 'GET /api/github/events'
        },
        timestamp: new Date().toISOString()
    });
});

// ----------------------------
// 📂 Projects API
// ----------------------------
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// ----------------------------
// 📝 Blogs API
// ----------------------------

// Get All Blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ created_at: -1 });
        res.json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// Get Single Blog
app.get('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }
        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// ----------------------------
// 🖼️ Gallery API
// ----------------------------

// Upload Image
app.post('/api/gallery/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const newImage = new Gallery({
            name: req.file.filename,
            img: `/uploads/images/${req.file.filename}`
        });

        await newImage.save();

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: newImage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message
        });
    }
});

// Get All Images
app.get('/api/gallery', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ created_at: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// ----------------------------
// ❌ 404 Handler
// ----------------------------
app.all('{*path}', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// ----------------------------
// ⚠️ Error Handler (Express 5 ต้องมี 4 parameters)
// ----------------------------
app.use((err, req, res, _next) => {
    console.error('Server Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ----------------------------
// 🔗 Connect MongoDB & Start Server
// ----------------------------
async function startServer() {
    try {
        console.log(`🔗 Connecting to MongoDB: ${MONGODB_URI}`);
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully');

        // MongoDB connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err.message);
        console.log('⚠️ Server will start without database connection.');
        console.log('   Make sure MongoDB is running: mongod');
    }

    // Start server regardless (health check will show DB status)
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });
}

startServer();

// ----------------------------
// 🛑 Graceful Shutdown
// ----------------------------
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});