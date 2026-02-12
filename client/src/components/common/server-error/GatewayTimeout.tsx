import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GatewayTimeout: FC = () => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg overflow-hidden">
            {/* Ambient glow blobs */}
            <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-global-yellow/15 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-global-red/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />

            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                {/* Error code */}
                <div className="relative mb-6">
                    <h1 className="text-[160px] sm:text-[200px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-global-yellow via-global-red to-global-redpink select-none">
                        504
                    </h1>
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-global-yellow/10 dark:bg-global-yellow/20 border border-global-yellow/20">
                    <i className="ri-time-line text-3xl text-global-yellow"></i>
                </div>

                {/* Text */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-light-text dark:text-dark-text mb-3">
                    Gateway Timeout
                </h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-2 max-w-md mx-auto">
                    The server took too long to respond. This might be due to network issues or server overload.
                </p>
                <p className="font-zen text-sm text-light-text-secondary/60 dark:text-dark-text-secondary/60 mb-8">
                    サーバーの応答がタイムアウトしました
                </p>

                {/* Elapsed timer */}
                <div className="mb-6">
                    <div className="inline-flex flex-col items-center px-8 py-4 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                        <p className="text-xs uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-1">Time waited</p>
                        <p className="text-4xl font-bold font-mono text-global-yellow">
                            {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
                        </p>
                    </div>
                </div>

                {/* SVG clock illustration */}
                <div className="my-6">
                    <svg className="w-28 h-28 mx-auto opacity-50 dark:opacity-30" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="55" className="stroke-global-yellow" strokeWidth="3" fill="none" />
                        <circle cx="100" cy="100" r="48" className="stroke-global-yellow/30" strokeWidth="1.5" strokeDasharray="6 4" />
                        <line x1="100" y1="100" x2="100" y2="68" className="stroke-global-yellow" strokeWidth="3" strokeLinecap="round" style={{ transformOrigin: '100px 100px', animation: 'spin 3s linear infinite' }} />
                        <line x1="100" y1="100" x2="125" y2="100" className="stroke-global-yellow/60" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="100" cy="100" r="4" className="fill-global-yellow" />
                        <circle cx="100" cy="50" r="3" className="fill-global-yellow/50" />
                        <circle cx="100" cy="150" r="3" className="fill-global-yellow/50" />
                        <circle cx="50" cy="100" r="3" className="fill-global-yellow/50" />
                        <circle cx="150" cy="100" r="3" className="fill-global-yellow/50" />
                    </svg>
                </div>

                {/* Possible causes */}
                <div className="mb-8 max-w-sm mx-auto">
                    <div className="rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border p-5 text-left">
                        <h3 className="text-sm font-semibold text-light-text dark:text-dark-text mb-3 flex items-center gap-2">
                            <i className="ri-information-line text-global-yellow"></i>
                            Possible causes
                        </h3>
                        <ul className="space-y-2">
                            {[
                                'Server is experiencing high load',
                                'Network connection is slow or unstable',
                                'Upstream server is not responding',
                            ].map((cause) => (
                                <li key={cause} className="flex items-start gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-global-yellow/60 shrink-0" />
                                    {cause}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Error badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-global-yellow/10 dark:bg-global-yellow/15 border border-global-yellow/20">
                    <div className="w-2 h-2 rounded-full bg-global-yellow animate-pulse" />
                    <span className="text-sm font-mono text-global-yellow">Error 504 &middot; Gateway Timeout</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-full bg-gradient-to-r from-global-yellow to-global-red text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-global-yellow/20">
                        <i className="ri-refresh-line"></i>
                        Retry Request
                    </button>
                    <Link to="/" className="px-8 py-3 rounded-full border border-light-border dark:border-dark-border text-light-text dark:text-dark-text font-medium flex items-center gap-2 hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                        <i className="ri-home-4-line"></i>
                        Go Home
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-12 mb-4 h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-light-border dark:via-dark-border to-transparent" />
                <p className="text-xs text-light-text-secondary/50 dark:text-dark-text-secondary/50">
                    Still having issues? <Link to="/#contact" className="text-global-yellow hover:underline">Contact support</Link>
                </p>
            </div>
        </div>
    );
};

export default GatewayTimeout;
