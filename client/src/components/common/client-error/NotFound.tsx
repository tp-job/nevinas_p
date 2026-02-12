import type { FC } from 'react';
import { Link } from 'react-router-dom';

const NotFound: FC = () => {
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg overflow-hidden">
            {/* Ambient glow blobs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-global-purple/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-global-pink/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                {/* Error code */}
                <div className="relative mb-6">
                    <h1 className="text-[160px] sm:text-[200px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-global-purple via-global-blue to-global-pink select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-40 h-40 border-2 border-dashed border-global-purple/30 dark:border-global-purple/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                    </div>
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-global-purple/10 dark:bg-global-purple/20 border border-global-purple/20">
                    <i className="ri-compass-discover-line text-3xl text-global-purple"></i>
                </div>

                {/* Text */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-light-text dark:text-dark-text mb-3">
                    Page Not Found
                </h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-2 max-w-md mx-auto">
                    You've drifted into the unknown. The page you're looking for has been moved, deleted, or never existed.
                </p>
                <p className="font-zen text-sm text-light-text-secondary/60 dark:text-dark-text-secondary/60 mb-10">
                    お探しのページは見つかりませんでした
                </p>

                {/* Actions */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Link to="/" className="px-8 py-3 rounded-full bg-gradient-to-r from-global-pink to-global-purple text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-global-purple/20">
                        <i className="ri-home-4-line"></i>
                        Go Home
                    </Link>
                    <button onClick={() => window.history.back()} className="px-8 py-3 rounded-full border border-light-border dark:border-dark-border text-light-text dark:text-dark-text font-medium flex items-center gap-2 hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                        <i className="ri-arrow-left-line"></i>
                        Go Back
                    </button>
                </div>

                {/* Divider */}
                <div className="mt-12 mb-4 h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-light-border dark:via-dark-border to-transparent" />

                <p className="text-xs text-light-text-secondary/50 dark:text-dark-text-secondary/50">
                    Error 404 &middot; Client Error
                </p>
            </div>
        </div>
    );
};

export default NotFound;
