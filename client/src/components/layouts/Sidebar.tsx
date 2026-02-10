import { useEffect, useState } from 'react';
import type { FC } from 'react';
import type { NavItem, ItemContentProps } from '@/types/sidebar';
import { useProfile } from '@/context/ProfileContext';
import { useTheme } from '@/context/ThemeContext';
import { Link, NavLink, useLocation } from 'react-router-dom';

const ItemContent: FC<ItemContentProps> = ({ item, isCollapsed }) => (
    <div className={`flex items-center ${isCollapsed ? 'gap-0' : 'gap-3'}`}>
        <i className={`${item.icon} text-lg transition-colors duration-200`}></i>
        <span className={`${isCollapsed ? 'hidden' : 'flex-1'} duration-200 transition-colors`}>
            {item.label}
        </span>
        {item.badge ? (
            <span className={`text-xs bg-global-redpink text-light-bg px-2 py-0.5 rounded-full shadow ${isCollapsed ? 'hidden' : ''}`}>{item.badge}</span>
        ) : null}
    </div>
);

const Sidebar: FC = () => {
    const { avatarUrl } = useProfile();
    const { toggleTheme } = useTheme();
    const location = useLocation();

    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        return saved ? saved === 'true' : false;
    });
    const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', String(isCollapsed));
    }, [isCollapsed]);

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsOpenMobile(false);
    }, [location.pathname]);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (isOpenMobile) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [isOpenMobile]);

    const navItems: NavItem[] = [
        { icon: 'ri-dashboard-horizontal-fill', label: 'Dashboard', to: '/work/dashboard' },
        { icon: 'ri-git-repository-line', label: 'Repository', to: '/work/repository' },
        { icon: 'ri-global-line', label: 'HTML/CSS/JS', to: '/work/website' },
        { icon: 'ri-reactjs-line', label: 'React', to: '/work/react' },
        { icon: 'ri-tailwind-css-fill', label: 'TailwindCSS', to: '/work/tailwindcss' },
        { icon: 'ri-stack-fill', label: 'Tech Stack', to: '/work/tech-stack' },
        { icon: 'ri-tools-line', label: 'Tooling', to: '/work/tooling' },
        { icon: 'ri-line-chart-line', label: 'Performance', to: '/work/performance' },
        { icon: 'ri-book-line', label: 'Docs', to: '/work/docs' },
        { icon: 'ri-gallery-line', label: 'Gallery', to: '/work/gallery' },
        { icon: 'ri-inbox-2-fill', label: 'Blog', to: '/work/blog' },
    ];

    const baseAsideClass = `bg-light-surface-2 dark:bg-dark-bg px-4 py-6 gap-2 overflow-hidden border-r border-light-border dark:border-dark-border shadow-sm transition-[width] duration-300 ease-out`;
    const widthClass = isCollapsed ? 'w-20' : 'w-64';

    // Shared nav list renderer
    const renderNavItems = (collapsed: boolean) => (
        <ul className="space-y-1">
            {navItems.map((item) => (
                <li key={item.label}>
                    {item.to && item.to !== '#'
                        ? (
                            <NavLink to={item.to} end={item.to === '/dashboard'} className={({ isActive }) => `group flex items-center ${collapsed ? 'justify-center' : 'px-3'} py-2.5 rounded-md transition-all duration-200 cursor-pointer focus:outline-none ${isActive ? `${collapsed ? ' bg-light-bg/10' : ''} text-global-blue` : 'hover:translate-x-0.5'}`} title={collapsed ? item.label : undefined}>
                                <ItemContent item={item} isCollapsed={collapsed} />
                            </NavLink>
                        ) : item.href ? (
                            <a href={item.href} target="_blank" rel="noopener noreferrer" className={`group flex items-center ${collapsed ? 'justify-center' : 'px-3'} py-2.5 rounded-md hover:bg-light-bg/10 hover:translate-x-0.5 transition-all duration-200 focus:outline-none`} title={collapsed ? item.label : undefined}>
                                <ItemContent item={item} isCollapsed={collapsed} />
                            </a>
                        ) : (
                            <button className={`group w-full ${collapsed ? 'justify-center' : 'text-left px-3'} flex items-center py-2.5 rounded-md hover:bg-light-bg/10 hover:translate-x-0.5 transition-all duration-200 focus:outline-none`} title={collapsed ? item.label : undefined} type="button">
                                <ItemContent item={item} isCollapsed={collapsed} />
                            </button>
                        )}
                </li>
            ))}
        </ul>
    );

    // Shared settings section renderer
    const renderSettings = (collapsed: boolean) => (
        <div>
            {!collapsed && <p className="px-3 text-xs uppercase tracking-wider opacity-60 mb-2">settings</p>}
            <div className="mt-auto">
                <div className={`mx-3 mb-3 ${collapsed ? 'border-t border-light-bg/10' : ''}`}></div>
                <ul className="space-y-1 mb-4">
                    <li>
                        <Link to="/" className={`w-full flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-3'} py-2.5 rounded-md hover:translate-x-0.5 transition-all duration-200 focus:outline-none`}>
                            <i className="ri-home-4-line text-lg"></i>
                            <span className={`${collapsed ? 'hidden' : 'flex-1 text-left'}`}>Home</span>
                        </Link>
                    </li>
                    <li>
                        <button onClick={toggleTheme} className={`w-full flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-3'} py-2.5 rounded-md hover:translate-x-0.5 transition-all duration-200 focus:outline-none`} title={collapsed ? 'Dark mode' : undefined}>
                            <i className="ri-moon-line text-lg dark:hidden"></i>
                            <i className="hidden ri-sun-line text-lg dark:block"></i>
                            {!collapsed && <span className="flex-1 text-left">Themes</span>}
                        </button>
                    </li>
                </ul>
                <div className={`mx-3 p-2 rounded-2xl ${collapsed ? 'bg-light-bg/5 border border-light-bg/10' : 'backdrop-blur bg-light-bg/5 dark:bg-light-bg/5 border border-light-border dark:border-dark-border p-3'}`}>
                    <a href="https://github.com/tp-job">
                        <div className={`${collapsed ? 'flex justify-center' : 'flex items-center gap-3'}`}>
                            <div className="relative shrink-0">
                                <img src={avatarUrl} alt="profile" loading="lazy" decoding="async" className={`${collapsed ? 'w-12 h-12' : 'w-10 h-10'} object-cover rounded-full`} />
                            </div>
                            {!collapsed && (
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-semibold card-title truncate">Nevinas_ka</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">tp-job</div>
                                </div>
                            )}
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* ======================== */}
            {/* Desktop Sidebar */}
            {/* ======================== */}
            <div className={`hidden lg:flex lg:flex-col h-screen sticky top-0 ${baseAsideClass} ${widthClass}`}>
                {/* top */}
                <div className="flex items-center justify-between px-1 py-1 mb-2">
                    <div className="flex items-center gap-2 px-2 py-2">
                        <i className="ri-code-s-slash-line text-xl"></i>
                        {!isCollapsed && (
                            <div>
                                <h1 className="text-lg font-semibold">Frontend Developer</h1>
                                <p className="text-sm opacity-70 font-zen">フロントエンド</p>
                            </div>
                        )}
                    </div>
                    <button aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={isCollapsed ? 'Expand' : 'Collapse'} onClick={() => setIsCollapsed(v => !v)} className="text-sm opacity-70 p-2 rounded-md hover:bg-light-bg/10 transition-colors focus:outline-none">
                        <i className={`ri-arrow-right-wide-fill transition-transform ${isCollapsed ? 'rotate-90' : ''}`}></i>
                    </button>
                </div>

                {!isCollapsed && <p className="px-3 text-xs uppercase tracking-wider opacity-60 mb-2">Main Menu</p>}
                <div className="mt-3 flex-1 overflow-y-auto pr-2">
                    {renderNavItems(isCollapsed)}
                </div>
                {renderSettings(isCollapsed)}
            </div>

            {/* ======================== */}
            {/* Mobile Top Bar */}
            {/* ======================== */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-light-surface-2/90 dark:bg-dark-bg/90 backdrop-blur-lg border-b border-light-border dark:border-dark-border shadow-sm">
                <div className="flex items-center gap-2">
                    <i className="ri-code-s-slash-line text-xl"></i>
                    <h1 className="text-base font-semibold">Frontend Developer</h1>
                </div>
                <button
                    type="button"
                    onClick={() => setIsOpenMobile(true)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-light-bg/20 dark:hover:bg-light-bg/10 transition-colors focus:outline-none"
                    aria-label="Open menu"
                >
                    <i className="ri-menu-2-line text-xl"></i>
                </button>
            </div>

            {/* ======================== */}
            {/* Mobile Sidebar Overlay */}
            {/* ======================== */}
            <div
                className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isOpenMobile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                {/* backdrop */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpenMobile(false)}></div>

                {/* sidebar panel */}
                <div className={`absolute left-0 top-0 h-full w-72 bg-light-surface-2 dark:bg-dark-bg px-4 py-6 border-r border-light-border dark:border-dark-border shadow-xl flex flex-col min-h-0 transition-transform duration-300 ease-out ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}`}>
                    {/* header */}
                    <div className="flex items-center justify-between px-1 py-1 mb-1">
                        <div className="flex items-center gap-2 px-2 py-2">
                            <i className="ri-code-s-slash-line text-xl"></i>
                            <div>
                                <h1 className="text-lg font-semibold">Frontend Developer</h1>
                                <p className="text-sm opacity-70 font-zen">フロントエンド</p>
                            </div>
                        </div>
                        <button aria-label="Close sidebar" onClick={() => setIsOpenMobile(false)} className="p-2 rounded-md hover:bg-light-bg/10 transition-colors focus:outline-none">
                            <i className="ri-close-line text-xl"></i>
                        </button>
                    </div>

                    {/* menu */}
                    <p className="px-3 text-xs uppercase tracking-wider opacity-60 mb-2">Main Menu</p>
                    <div className="mt-3 flex-1 overflow-y-auto pr-2 min-h-0">
                        {renderNavItems(false)}
                    </div>

                    {/* settings */}
                    {renderSettings(false)}
                </div>
            </div>
        </>
    );
};

export default Sidebar;