import 'dotenv/config';
import mongoose from 'mongoose';
import Project from './models/Project';
import Blog from './models/Blog';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nevinas';

// ============================
// Projects Data
// ============================
const projects = [
    {
        name: 'nevinas_ka_i',
        description:
            'Personal developer portfolio and dashboard built with React 19, Tailwind CSS 4, MUI, Recharts, and Express 5 + MongoDB. Features analytics dashboard, gallery, blog, tech stack showcase, and project repository.',
        repo_url: 'https://github.com/tp-job/nevinas_ka_i',
        demo_url: '',
        img_url: '',
        topics: ['react', 'tailwindcss', 'mongodb', 'express', 'portfolio', 'dashboard'],
        framework: ['react', 'tailwindcss', 'mui', 'recharts'],
        language: [
            { name: 'TypeScript', percentage: '72.0%' },
            { name: 'CSS', percentage: '15.5%' },
            { name: 'JavaScript', percentage: '10.3%' },
            { name: 'HTML', percentage: '2.2%' },
        ],
        tech_stack: [
            'react', 'tailwindcss', 'typescript', 'vite', 'express',
            'mongodb', 'mongoose', 'mui', 'recharts', 'axios',
        ],
        stargazers_count: 2,
        forks_count: 0,
        category: 'fullstack',
        status: 'in-progress',
        created_at: new Date('2025-10-01'),
        updated_at: new Date('2026-02-08'),
    },
    {
        name: 'ApexOps',
        description:
            'Full-stack real-time operations platform with Socket.io, Google Gemini AI integration, Puppeteer automation, and PostgreSQL. Features live WebSocket communication, AI-powered tools, and interactive dashboards.',
        repo_url: 'https://github.com/tp-job/ApexOps',
        demo_url: '',
        img_url: '',
        topics: ['react', 'socket.io', 'gemini-ai', 'puppeteer', 'postgresql', 'real-time'],
        framework: ['react', 'tailwindcss', 'mui', 'recharts', 'socket.io'],
        language: [
            { name: 'TypeScript', percentage: '65.0%' },
            { name: 'JavaScript', percentage: '25.0%' },
            { name: 'CSS', percentage: '8.0%' },
            { name: 'HTML', percentage: '2.0%' },
        ],
        tech_stack: [
            'react', 'tailwindcss', 'typescript', 'vite', 'express',
            'postgresql', 'socket.io', 'gemini-ai', 'puppeteer', 'lucide-react',
        ],
        stargazers_count: 1,
        forks_count: 0,
        category: 'fullstack',
        status: 'in-progress',
        created_at: new Date('2025-12-01'),
        updated_at: new Date('2026-02-08'),
    },
    {
        name: 'ComTech-Prep',
        description:
            'Interactive Computer Technology learning platform with in-browser Python runtime (Pyodide/WebAssembly), Monaco code editor, ReactFlow flowchart lab, i18n multi-language support (TH/EN), and Zustand state management.',
        repo_url: 'https://github.com/tp-job/ComTech-Prep',
        demo_url: '',
        img_url: '',
        topics: ['react', 'education', 'python', 'pyodide', 'monaco-editor', 'reactflow', 'i18n'],
        framework: ['react', 'tailwindcss', 'recharts', 'reactflow', 'monaco-editor'],
        language: [
            { name: 'TypeScript', percentage: '78.0%' },
            { name: 'CSS', percentage: '12.0%' },
            { name: 'JavaScript', percentage: '8.0%' },
            { name: 'Python', percentage: '2.0%' },
        ],
        tech_stack: [
            'react', 'tailwindcss', 'typescript', 'vite', 'zustand',
            'pyodide', 'monaco-editor', 'reactflow', 'i18next', 'react-icons',
        ],
        stargazers_count: 0,
        forks_count: 0,
        category: 'fullstack',
        status: 'in-progress',
        created_at: new Date('2026-01-15'),
        updated_at: new Date('2026-02-08'),
    },
    {
        name: 'memonote',
        description:
            'A clean and minimal note-taking web app. Built with React and Tailwind CSS, it features a responsive UI for creating, editing, and organizing notes with an intuitive interface.',
        repo_url: 'https://github.com/tp-job/memonote',
        demo_url: 'https://memonotex.onrender.com/',
        img_url: '',
        topics: ['react', 'tailwindcss', 'notes'],
        framework: ['react', 'tailwindcss'],
        language: [
            { name: 'JavaScript', percentage: '91.7%' },
            { name: 'HTML', percentage: '3.2%' },
            { name: 'CSS', percentage: '5.1%' },
        ],
        tech_stack: ['react', 'tailwindcss'],
        stargazers_count: 0,
        forks_count: 0,
        category: 'frontend',
        status: 'completed',
        created_at: new Date('2025-08-18'),
        updated_at: new Date('2025-09-01'),
    },
    {
        name: 'project_tailwindcss_i',
        description:
            'First Tailwind CSS practice project exploring utility-first styling fundamentals. A responsive landing page demonstrating grid layouts, flexbox, gradients, and responsive breakpoints.',
        repo_url: 'https://github.com/tp-job/project_tailwindcss_i',
        demo_url: 'https://nevinas-project-i.onrender.com/',
        img_url: '',
        topics: ['react', 'tailwindcss', 'landing-page'],
        framework: ['react', 'tailwindcss'],
        language: [
            { name: 'JavaScript', percentage: '86.0%' },
            { name: 'HTML', percentage: '8.2%' },
            { name: 'CSS', percentage: '5.8%' },
        ],
        tech_stack: ['react', 'tailwindcss'],
        stargazers_count: 0,
        forks_count: 0,
        category: 'frontend',
        status: 'completed',
        created_at: new Date('2025-05-15'),
        updated_at: new Date('2025-05-16'),
    },
    {
        name: 'project_tailwindcss_ii',
        description:
            'Second Tailwind CSS project building on the fundamentals. Features dark mode toggle, animations, hover effects, and more complex responsive layouts with modern design patterns.',
        repo_url: 'https://github.com/tp-job/project_tailwindcss_ii',
        demo_url: 'https://nevinas-project-ii.netlify.app/',
        img_url: '',
        topics: ['react', 'tailwindcss', 'dark-mode'],
        framework: ['react', 'tailwindcss'],
        language: [
            { name: 'JavaScript', percentage: '89.0%' },
            { name: 'HTML', percentage: '7.1%' },
            { name: 'CSS', percentage: '3.9%' },
        ],
        tech_stack: ['react', 'tailwindcss'],
        stargazers_count: 0,
        forks_count: 0,
        category: 'frontend',
        status: 'completed',
        created_at: new Date('2025-05-16'),
        updated_at: new Date('2025-05-19'),
    },
    {
        name: 'buildly',
        description:
            'A web application builder concept with drag-and-drop interface. Showcases component composition, dynamic rendering, and a modern UI built with React and Tailwind CSS.',
        repo_url: 'https://github.com/tp-job/buildly',
        demo_url: 'https://buildly.onrender.com/',
        img_url: '',
        topics: ['react', 'tailwindcss', 'builder'],
        framework: ['react', 'tailwindcss'],
        language: [
            { name: 'JavaScript', percentage: '95.0%' },
            { name: 'HTML', percentage: '3.3%' },
            { name: 'CSS', percentage: '1.7%' },
        ],
        tech_stack: ['react', 'tailwindcss'],
        stargazers_count: 0,
        forks_count: 0,
        category: 'frontend',
        status: 'completed',
        created_at: new Date('2025-07-15'),
        updated_at: new Date('2025-07-15'),
    },
    {
        name: 'my_protfolio_i',
        description:
            'First portfolio website built with pure HTML and Tailwind CSS. A single-page design showcasing personal projects, skills, and contact information with a clean minimal aesthetic.',
        repo_url: 'https://github.com/tp-job/my_protfolio_i',
        demo_url: 'https://nevinas-ka.onrender.com/',
        img_url: '',
        topics: ['tailwindcss', 'portfolio', 'html'],
        framework: ['tailwindcss'],
        language: [
            { name: 'JavaScript', percentage: '9.9%' },
            { name: 'HTML', percentage: '90.1%' },
        ],
        tech_stack: ['html', 'tailwindcss'],
        stargazers_count: 0,
        forks_count: 0,
        category: 'frontend',
        status: 'completed',
        created_at: new Date('2025-01-08'),
        updated_at: new Date('2025-07-18'),
    },
    {
        name: 'chessgame',
        description:
            'A terminal-based chess game built entirely in Python. Features complete chess logic including move validation, check/checkmate detection, and a text-based board display.',
        repo_url: 'https://github.com/tp-job/chessgame',
        demo_url: '',
        img_url: '',
        topics: ['python', 'chess', 'game', 'cli'],
        framework: [],
        language: [{ name: 'Python', percentage: '100%' }],
        tech_stack: ['python'],
        stargazers_count: 0,
        forks_count: 0,
        category: 'cli',
        status: 'completed',
        created_at: new Date('2025-11-21'),
        updated_at: new Date('2025-11-22'),
    },
];

// ============================
// Blog Data
// ============================
const blogs = [
    {
        title: 'The Future of React: Server Components Explained',
        excerpt:
            'Dive deep into how Server Components are reshaping the way we build performant web applications in 2024 and beyond.',
        content:
            '<div class="article"><p class="article-p">React Server Components (RSC) represent one of the most significant architectural shifts in the React ecosystem since hooks were introduced. By allowing components to render exclusively on the server, we can significantly reduce the amount of JavaScript sent to the client.</p><h3 class="article-h3">Why the Shift?</h3><p class="article-p">Traditional React applications (CSR) force the browser to download, parse, and execute large bundles of JavaScript before the user can interact with the page. With RSC, the server handles the heavy lifting.</p><h3 class="article-h3">Key Benefits</h3><ul class="article-ul"><li><strong>Zero Bundle Size:</strong> Server components aren\'t included in the client bundle.</li><li><strong>Direct Backend Access:</strong> Access databases and filesystems directly from your components.</li><li><strong>Automatic Code Splitting:</strong> The framework handles splitting automatically.</li></ul><p class="article-p">This doesn\'t mean Client Components are going away. Instead, we are moving towards a hybrid model where we use the right tool for the specific job.</p></div>',
        author: 'Nevinas',
        role: 'Developer',
        date: 'Oct 24, 2025',
        readTime: '5 min read',
        category: 'Engineering',
        imageUrl:
            'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        authorAvatar: '',
    },
    {
        title: 'Mastering Tailwind CSS: From Zero to Hero',
        excerpt:
            'Stop fighting with CSS files. Learn how utility-first CSS can speed up your development workflow by 200%.',
        content:
            '<p>Tailwind CSS has completely transformed how developers think about styling. Gone are the days of thinking up arbitrary class names like <code>.sidebar-inner-wrapper-left</code>. Instead, we compose styles directly in our markup.</p><h3>The Utility-First Workflow</h3><p>At first glance, Tailwind looks messy. However, the constraints Tailwind provides (colors, spacing, typography scales) ensure your design remains consistent while allowing for infinite flexibility.</p><blockquote>"I didn\'t think I would like it, but after building one project with Tailwind, I never want to go back to vanilla CSS."</blockquote><p>When combined with modern component frameworks like React, the "messy HTML" argument falls apart because you are encapsulating these long class strings into reusable components.</p>',
        author: 'Nevinas',
        role: 'Developer',
        date: 'Nov 02, 2025',
        readTime: '8 min read',
        category: 'Design',
        imageUrl:
            'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
        authorAvatar: '',
    },
    {
        title: 'The Psychology of Minimalist Web Design',
        excerpt:
            'Why less is often more. Understanding cognitive load and how whitespace improves user retention.',
        content:
            '<p>Minimalism is not just an aesthetic choice; it is a functional one. In an age of information overload, clarity is the most valuable asset a website can offer.</p><p>By removing non-essential elements, we allow the user to focus on the content that matters. This reduces cognitive load and improves decision-making speed.</p><h3>Key Principles</h3><ul><li><strong>Whitespace is content:</strong> Empty space gives your design room to breathe.</li><li><strong>Typography hierarchy:</strong> Guide the eye with size, weight, and color.</li><li><strong>Reduce choices:</strong> Fewer options lead to faster decisions.</li></ul>',
        author: 'Nevinas',
        role: 'Developer',
        date: 'Nov 15, 2025',
        readTime: '4 min read',
        category: 'Product',
        imageUrl:
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1471&q=80',
        authorAvatar: '',
    },
    {
        title: 'Building a MERN Stack Portfolio from Scratch',
        excerpt:
            'A complete walkthrough of creating a developer portfolio with MongoDB, Express, React, and Node.js.',
        content:
            "<p>The MERN stack (MongoDB, Express, React, Node.js) is one of the most popular full-stack combinations for JavaScript developers. In this guide, I'll walk through how I built my own portfolio using these technologies.</p><h3>Architecture</h3><p>The frontend is built with React 19 and TypeScript, using Vite as the build tool for lightning-fast HMR. Tailwind CSS 4 handles all styling with a custom theme system supporting dark mode.</p><h3>Backend</h3><p>Express 5 serves the REST API with Mongoose as the ODM for MongoDB. The API handles projects, blog posts, and gallery images with proper error handling and CORS configuration.</p><h3>Key Takeaways</h3><ul><li>Always start with a clear data model design</li><li>Use TypeScript from day one — it pays off</li><li>Theme systems save time in the long run</li></ul>",
        author: 'Nevinas',
        role: 'Developer',
        date: 'Dec 10, 2025',
        readTime: '10 min read',
        category: 'Tutorial',
        imageUrl:
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        authorAvatar: '',
    },
    {
        title: 'Why TypeScript is Worth the Learning Curve',
        excerpt:
            'From skeptic to advocate: how static typing transformed my development workflow and reduced bugs by 60%.',
        content:
            "<p>When I first encountered TypeScript, I thought it was unnecessary overhead. JavaScript worked fine — why add types? After six months of using TypeScript in production projects, I can confidently say: the investment is absolutely worth it.</p><h3>Type Safety Catches Bugs Early</h3><p>The compiler catches errors at build time that would otherwise only appear at runtime. This is especially valuable in large codebases where a single typo can cause hard-to-trace bugs.</p><h3>Better Developer Experience</h3><p>TypeScript's IntelliSense provides autocomplete, inline documentation, and refactoring tools that make development significantly faster. It's not just about catching errors — it's about writing code more efficiently.</p>",
        author: 'Nevinas',
        role: 'Developer',
        date: 'Jan 05, 2026',
        readTime: '6 min read',
        category: 'Engineering',
        imageUrl:
            'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        authorAvatar: '',
    },
    {
        title: 'Running Python in the Browser with Pyodide',
        excerpt:
            'How WebAssembly enables full Python runtime in the browser — and how I used it in ComTech-Prep.',
        content:
            '<p>One of the most exciting features of ComTech-Prep is the ability to write and execute Python code directly in the browser, without any server-side execution. This is made possible by Pyodide, a Python runtime compiled to WebAssembly.</p><h3>How It Works</h3><p>Pyodide loads the CPython interpreter (compiled to WASM) into the browser. Once loaded, you can execute arbitrary Python code, import packages from PyPI, and even interact with JavaScript objects.</p><h3>Integration with Monaco Editor</h3><p>We paired Pyodide with Monaco Editor (the engine behind VS Code) to create a full-featured code editing experience. Students can write Python, see syntax highlighting, get autocomplete, and run their code — all without leaving the browser.</p>',
        author: 'Nevinas',
        role: 'Developer',
        date: 'Feb 01, 2026',
        readTime: '7 min read',
        category: 'Tutorial',
        imageUrl:
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        authorAvatar: '',
    },
];

// ============================
// Seed Database
// ============================
async function seed(): Promise<void> {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected');

        // Seed Projects
        await Project.deleteMany({});
        console.log('Cleared existing projects');
        const projectResult = await Project.insertMany(projects);
        console.log(`Added ${projectResult.length} projects`);

        // Seed Blogs
        await Blog.deleteMany({});
        console.log('Cleared existing blogs');
        const blogResult = await Blog.insertMany(blogs);
        console.log(`Added ${blogResult.length} blogs`);

        console.log('\nSeed Summary:');
        console.log(`  Projects: ${projectResult.length}`);
        console.log(`  Blogs: ${blogResult.length}`);
        console.log('  Gallery: (use npm run sync:gallery separately)');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seed();
