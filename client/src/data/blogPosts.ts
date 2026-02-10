import type { BlogPost } from '../types/blog';

export const BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        title: 'The Future of React: Server Components Explained',
        excerpt: 'Dive deep into how Server Components are reshaping the way we build performant web applications in 2024 and beyond.',
        content: `<div class=\"article\"><p class=\"article-p\">React Server Components (RSC) represent one of the most significant architectural shifts in the React ecosystem since hooks were introduced. By allowing components to render exclusively on the server, we can significantly reduce the amount of JavaScript sent to the client.</p><h3 class=\"article-h3\">Why the Shift?</h3><p class=\"article-p\">Traditional React applications (CSR) force the browser to download, parse, and execute large bundles of JavaScript before the user can interact with the page. With RSC, the server handles the heavy lifting.</p><h3 class=\"article-h3\">Key Benefits</h3><ul class=\"article-ul\"><li><strong>Zero Bundle Size:</strong> Server components aren't included in the client bundle.</li><li><strong>Direct Backend Access:</strong> Access databases and filesystems directly from your components.</li><li><strong>Automatic Code Splitting:</strong> The framework handles splitting automatically.</li></ul><p class=\"article-p\">This doesn't mean Client Components are going away. Instead, we are moving towards a hybrid model where we use the right tool for the specific job. Interactivity still lives on the client, while data fetching moves to the server.</p></div>`,
        author: 'Sarah Jenkins',
        role: 'Senior Frontend Engineer',
        date: 'Oct 24, 2023',
        readTime: '5 min read',
        category: 'Engineering',
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: '2',
        title: 'Mastering Tailwind CSS: From Zero to Hero',
        excerpt: 'Stop fighting with CSS files. Learn how utility-first CSS can speed up your development workflow by 200%.',
        content: ``,
        author: 'Alex Rivera',
        role: 'UI/UX Designer',
        date: 'Nov 02, 2023',
        readTime: '8 min read',
        category: 'Design',
        imageUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: '3',
        title: 'The Psychology of Minimalist Web Design',
        excerpt: 'Why less is often more. Understanding cognitive load and how whitespace improves user retention.',
        content: `<p class=\"mb-6\">Minimalism is not just an aesthetic choice; it is a functional one. In an age of information overload, clarity is the most valuable asset a website can offer.</p><p class=\"mb-6\">By removing non-essential elements, we allow the user to focus on the content that matters. This reduces cognitive load and improves decision-making speed.</p>`,
        author: 'Jessica Chen',
        role: 'Product Manager',
        date: 'Nov 15, 2023',
        readTime: '4 min read',
        category: 'Product',
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1471&q=80',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
];
