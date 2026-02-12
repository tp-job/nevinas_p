import type { FC } from 'react';
import { Link } from 'react-router-dom';

const ServerError: FC = () => {
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg overflow-hidden">
            {/* Ambient glow blobs */}
            <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-global-redpink/15 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-global-red/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />

            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                {/* Error code */}
                <div className="relative mb-6">
                    <h1 className="text-[160px] sm:text-[200px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-global-redpink via-global-red to-global-yellow select-none">
                        500
                    </h1>
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-global-redpink/10 dark:bg-global-redpink/20 border border-global-redpink/20">
                    <i className="ri-server-line text-3xl text-global-redpink"></i>
                </div>

                {/* Text */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-light-text dark:text-dark-text mb-3">
                    Internal Server Error
                </h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-2 max-w-md mx-auto">
                    Something went wrong on our end. We're working to fix the issue. Please try again later.
                </p>
                <p className="font-zen text-sm text-light-text-secondary/60 dark:text-dark-text-secondary/60 mb-8">
                    サーバーエラーが発生しました
                </p>

                {/* Error badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-global-redpink/10 dark:bg-global-redpink/15 border border-global-redpink/20">
                    <div className="w-2 h-2 rounded-full bg-global-redpink animate-pulse" />
                    <span className="text-sm font-mono text-global-redpink">Error 500 &middot; Internal Server Error</span>
                </div>

                {/* SVG illustration */}
                <div className="my-8">
                    <svg className="w-32 h-32 mx-auto opacity-60 dark:opacity-40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="50" y="60" width="100" height="80" rx="12" className="stroke-global-redpink" strokeWidth="3" fill="none" />
                        <line x1="60" y1="80" x2="140" y2="80" className="stroke-light-border dark:stroke-dark-border" strokeWidth="1.5" />
                        <line x1="60" y1="100" x2="140" y2="100" className="stroke-light-border dark:stroke-dark-border" strokeWidth="1.5" />
                        <line x1="60" y1="120" x2="140" y2="120" className="stroke-light-border dark:stroke-dark-border" strokeWidth="1.5" />
                        <circle cx="100" cy="100" r="20" className="fill-global-redpink/20 stroke-global-redpink" strokeWidth="2" />
                        <line x1="100" y1="92" x2="100" y2="104" stroke="currentColor" className="stroke-global-redpink" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="100" cy="110" r="2" className="fill-global-redpink" />
                    </svg>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-full bg-gradient-to-r from-global-redpink to-global-red text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-global-redpink/20">
                        <i className="ri-refresh-line"></i>
                        Try Again
                    </button>
                    <Link to="/" className="px-8 py-3 rounded-full border border-light-border dark:border-dark-border text-light-text dark:text-dark-text font-medium flex items-center gap-2 hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                        <i className="ri-home-4-line"></i>
                        Go Home
                    </Link>
                </div>

                {/* Help */}
                <div className="mt-12 mb-4 h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-light-border dark:via-dark-border to-transparent" />
                <p className="text-xs text-light-text-secondary/50 dark:text-dark-text-secondary/50">
                    If the problem persists, please <Link to="/#contact" className="text-global-redpink hover:underline">contact support</Link>
                </p>
            </div>
        </div>
    );
};

export default ServerError;
