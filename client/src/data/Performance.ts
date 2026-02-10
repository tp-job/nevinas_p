// ============================
// Lighthouse Scores
// ============================
export const lighthouseScores = [
    { label: 'Performance', score: 92, color: '#0f9d58' },
    { label: 'Accessibility', score: 88, color: '#5983FC' },
    { label: 'Best Practices', score: 95, color: '#964EC2' },
    { label: 'SEO', score: 90, color: '#f4b400' },
];

// ============================
// Core Web Vitals
// ============================
export const coreWebVitals = [
    {
        metric: 'LCP',
        fullName: 'Largest Contentful Paint',
        value: '1.8s',
        target: '< 2.5s',
        status: 'good' as const,
        description: 'Measures loading performance. The time it takes for the largest content element to become visible.',
        icon: 'ri-speed-line',
    },
    {
        metric: 'INP',
        fullName: 'Interaction to Next Paint',
        value: '120ms',
        target: '< 200ms',
        status: 'good' as const,
        description: 'Measures responsiveness. The latency of user interactions throughout the page lifecycle.',
        icon: 'ri-cursor-line',
    },
    {
        metric: 'CLS',
        fullName: 'Cumulative Layout Shift',
        value: '0.05',
        target: '< 0.1',
        status: 'good' as const,
        description: 'Measures visual stability. How much the page layout shifts during loading.',
        icon: 'ri-layout-line',
    },
    {
        metric: 'FCP',
        fullName: 'First Contentful Paint',
        value: '0.9s',
        target: '< 1.8s',
        status: 'good' as const,
        description: 'Time from navigation to the first piece of content rendered on screen.',
        icon: 'ri-paint-brush-line',
    },
    {
        metric: 'TTFB',
        fullName: 'Time to First Byte',
        value: '210ms',
        target: '< 800ms',
        status: 'good' as const,
        description: 'Time from the request to the first byte of the response from the server.',
        icon: 'ri-server-line',
    },
    {
        metric: 'SI',
        fullName: 'Speed Index',
        value: '1.4s',
        target: '< 3.4s',
        status: 'good' as const,
        description: 'How quickly the contents of the page are visibly populated.',
        icon: 'ri-flashlight-line',
    },
];

// ============================
// Bundle Analysis per Project
// ============================
export const bundleAnalysis = [
    {
        project: 'nevinas_ka_i',
        buildTime: '3.2s',
        jsSize: '245 KB',
        cssSize: '38 KB',
        totalSize: '283 KB',
        chunks: 12,
        treeShaking: '67%',
    },
    {
        project: 'ApexOps',
        buildTime: '4.8s',
        jsSize: '380 KB',
        cssSize: '52 KB',
        totalSize: '432 KB',
        chunks: 18,
        treeShaking: '72%',
    },
    {
        project: 'ComTech-Prep',
        buildTime: '5.1s',
        jsSize: '520 KB',
        cssSize: '45 KB',
        totalSize: '565 KB',
        chunks: 15,
        treeShaking: '58%',
    },
];

// ============================
// API Response Times
// ============================
export const apiResponseTimes = [
    { endpoint: 'GET /api/projects', method: 'GET', avgMs: 42, p95Ms: 85, p99Ms: 120, status: 'healthy' as const },
    { endpoint: 'GET /api/blogs', method: 'GET', avgMs: 38, p95Ms: 72, p99Ms: 105, status: 'healthy' as const },
    { endpoint: 'GET /api/blogs/:id', method: 'GET', avgMs: 25, p95Ms: 48, p99Ms: 78, status: 'healthy' as const },
    { endpoint: 'GET /api/gallery', method: 'GET', avgMs: 56, p95Ms: 110, p99Ms: 180, status: 'healthy' as const },
    { endpoint: 'POST /api/gallery/upload', method: 'POST', avgMs: 320, p95Ms: 580, p99Ms: 850, status: 'warning' as const },
    { endpoint: 'GET /health', method: 'GET', avgMs: 5, p95Ms: 12, p99Ms: 20, status: 'healthy' as const },
];

// ============================
// Code Quality Metrics
// ============================
export const codeQuality = {
    typescript: {
        coverage: 92,
        strictMode: true,
        totalFiles: 48,
        typedFiles: 44,
    },
    eslint: {
        errors: 0,
        warnings: 3,
        rules: 42,
        autoFixable: 2,
    },
    dependencies: {
        total: 23,
        devDeps: 11,
        outdated: 1,
        vulnerabilities: 0,
    },
    codeLines: {
        total: 8420,
        typescript: 6050,
        css: 1280,
        javascript: 850,
        other: 240,
    },
};

// ============================
// Performance History (monthly trend)
// ============================
export const performanceHistory = [
    { month: 'Sep', performance: 78, accessibility: 82, bestPractices: 88, seo: 85 },
    { month: 'Oct', performance: 82, accessibility: 84, bestPractices: 90, seo: 87 },
    { month: 'Nov', performance: 85, accessibility: 85, bestPractices: 92, seo: 88 },
    { month: 'Dec', performance: 88, accessibility: 86, bestPractices: 93, seo: 89 },
    { month: 'Jan', performance: 90, accessibility: 87, bestPractices: 94, seo: 90 },
    { month: 'Feb', performance: 92, accessibility: 88, bestPractices: 95, seo: 90 },
];
