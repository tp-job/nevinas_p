import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ServiceUnavailable: FC = () => {
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    window.location.reload();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg overflow-hidden">
            {/* Ambient glow blobs */}
            <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-global-blue/15 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-global-purple/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />

            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                {/* Error code */}
                <div className="relative mb-6">
                    <h1 className="text-[160px] sm:text-[200px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-global-blue via-global-purple to-global-pink select-none">
                        503
                    </h1>
                    {/* Spinning dashed ring */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-36 h-36 border-2 border-dashed border-global-blue/30 dark:border-global-blue/20 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
                    </div>
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-global-blue/10 dark:bg-global-blue/20 border border-global-blue/20">
                    <i className="ri-tools-line text-3xl text-global-blue"></i>
                </div>

                {/* Text */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-light-text dark:text-dark-text mb-3">
                    Service Unavailable
                </h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-2 max-w-md mx-auto">
                    Our service is temporarily unavailable due to maintenance or high traffic. We'll be back soon!
                </p>
                <p className="font-zen text-sm text-light-text-secondary/60 dark:text-dark-text-secondary/60 mb-8">
                    現在メンテナンス中です
                </p>

                {/* Status badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-global-yellow/10 dark:bg-global-yellow/15 border border-global-yellow/20">
                    <div className="w-2 h-2 rounded-full bg-global-yellow animate-pulse" />
                    <span className="text-sm font-mono text-global-yellow">Status: Maintenance Mode</span>
                </div>

                {/* Countdown */}
                <div className="mb-8">
                    <div className="inline-flex flex-col items-center px-8 py-4 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                        <p className="text-xs uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-1">Auto-retry in</p>
                        <p className="text-4xl font-bold font-mono text-global-blue">
                            {countdown}<span className="text-lg text-light-text-secondary dark:text-dark-text-secondary">s</span>
                        </p>
                        {/* Progress bar */}
                        <div className="w-full h-1 mt-3 rounded-full bg-light-border dark:bg-dark-border overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-global-blue to-global-purple transition-all duration-1000 ease-linear"
                                style={{ width: `${((30 - countdown) / 30) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* SVG illustration */}
                <div className="my-6">
                    <svg className="w-28 h-28 mx-auto opacity-50 dark:opacity-30" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="55" className="stroke-global-blue" strokeWidth="3" fill="none" />
                        <circle cx="100" cy="100" r="65" className="stroke-global-blue/30" strokeWidth="1.5" strokeDasharray="6 4" />
                        <circle cx="120" cy="115" r="14" className="stroke-global-purple" strokeWidth="2.5" fill="none" />
                        <circle cx="120" cy="115" r="6" className="fill-global-purple/40" />
                        <rect x="117" y="98" width="6" height="8" rx="1" className="fill-global-purple/60" />
                        <rect x="117" y="128" width="6" height="8" rx="1" className="fill-global-purple/60" />
                        <rect x="103" y="112" width="8" height="6" rx="1" className="fill-global-purple/60" />
                        <rect x="129" y="112" width="8" height="6" rx="1" className="fill-global-purple/60" />
                    </svg>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-full bg-gradient-to-r from-global-blue to-global-purple text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-global-blue/20">
                        <i className="ri-refresh-line"></i>
                        Try Again Now
                    </button>
                    <Link to="/" className="px-8 py-3 rounded-full border border-light-border dark:border-dark-border text-light-text dark:text-dark-text font-medium flex items-center gap-2 hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                        <i className="ri-home-4-line"></i>
                        Go Home
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-12 mb-4 h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-light-border dark:via-dark-border to-transparent" />
                <p className="text-xs text-light-text-secondary/50 dark:text-dark-text-secondary/50">
                    Error 503 &middot; Service Unavailable
                </p>
            </div>
        </div>
    );
};

export default ServiceUnavailable;
