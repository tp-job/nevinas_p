import type { FC } from 'react';
import { Link } from 'react-router-dom';

const ServerError: FC = () => {
    return (
        <>
            <style>
                {`
        .dot-intersection {
            width: 12px;
            height: 12px;
            background-color: white;
            border-radius: 50%;
            position: absolute;
            box-shadow: 0 0 15px 2px rgba(255, 255, 255, 0.6);
        }
        .grid-line-h {
            position: absolute;
            left: 0;
            right: 0;
            height: 1px;
            background: rgba(255, 255, 255, 0.4);
            border-top: 1px dotted rgba(255, 255, 255, 0.8);
        }
        .grid-line-v {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 1px;
            background: rgba(255, 255, 255, 0.4);
            border-left: 1px dotted rgba(255, 255, 255, 0.8);
        }
                `}
            </style>
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col lg:flex-row overflow-hidden font-display">
                {/* Left column */}
                <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative bg-gradient-to-b from-red-400 via-red-300 to-orange-500 flex items-center justify-center p-8 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="grid-line-v left-1/6 lg:left-[15%]" />
                        <div className="grid-line-v right-1/6 lg:right-[15%]" />
                        <div className="grid-line-h top-1/4" />
                        <div className="grid-line-h bottom-1/4" />
                        <div className="dot-intersection top-[calc(25%-6px)] left-[calc(16.6%-6px)] lg:left-[calc(15%-6px)] ring-4 ring-white/20" />
                        <div className="dot-intersection top-[calc(25%-6px)] right-[calc(16.6%-6px)] lg:right-[calc(15%-6px)] ring-4 ring-white/20" />
                        <div className="dot-intersection bottom-[calc(25%-6px)] left-[calc(16.6%-6px)] lg:left-[calc(15%-6px)] ring-4 ring-white/20" />
                        <div className="dot-intersection bottom-[calc(25%-6px)] right-[calc(16.6%-6px)] lg:right-[calc(15%-6px)] ring-4 ring-white/20" />
                    </div>
                    <div className="relative z-10 text-center text-white space-y-2 lg:space-y-6">
                        <p className="text-sm lg:text-lg font-light tracking-wide opacity-90">
                            Server Connection Failed
                        </p>
                        <h1 className="text-7xl lg:text-[10rem] font-bold leading-none tracking-tight">500</h1>
                        <p className="text-sm lg:text-lg font-light tracking-wide opacity-90">
                            Internal Server Error
                        </p>
                    </div>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                </div>
                {/* Right column */}
                <div className="w-full lg:w-1/2 h-auto lg:h-screen bg-background-light dark:bg-background-dark text-light-text-primary dark:text-dark-text-primary p-8 lg:p-20 flex flex-col justify-center relative">
                    <div className="absolute top-8 left-8 lg:left-20 flex w-full pr-16 justify-between text-xs lg:text-sm text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-widest font-medium">
                        <span>SYSTEM ALERT</span>
                        <span className="mr-8 lg:mr-24">CODE 500</span>
                    </div>
                    <div className="mb-16 mt-12 lg:mt-0">
                        <h2 className="text-4xl lg:text-6xl font-light leading-tight tracking-tight">
                            Error: Server Failure. <br />
                            <span className="text-red-600 font-normal">Critical</span>{' '}
                            <span className="text-orange-500 font-normal">System</span> Error.
                        </h2>
                    </div>
                    <div className="space-y-10 lg:space-y-12">
                        <div className="flex gap-6 group">
                            <div className="flex-shrink-0 mt-1">
                                <i className="ri-server-line text-3xl lg:text-4xl text-light-text-secondary dark:text-dark-text-secondary group-hover:text-red-500 transition-colors"></i>
                            </div>
                            <div>
                                <h3 className="text-xl lg:text-2xl font-normal mb-2">Server Error</h3>
                                <p className="text-light-text dark:text-dark-text-secondary text-sm lg:text-base leading-relaxed max-w-md">
                                    Something went wrong on our end. We're working to fix the issue. Please try again later.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-6 group">
                            <div className="flex-shrink-0 mt-1">
                                <i className="ri-refresh-line text-3xl lg:text-4xl text-light-text-secondary dark:text-dark-text-secondary group-hover:text-blue-500 transition-colors"></i>
                            </div>
                            <div>
                                <h3 className="text-xl lg:text-2xl font-normal mb-2">Suggested Fix</h3>
                                <p className="text-light-text dark:text-dark-text-secondary text-sm lg:text-base leading-relaxed max-w-md">
                                    <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline font-medium">
                                        Try refreshing the page
                                    </button>{' '}
                                    or return to the homepage to re-initialize your session.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-6 group">
                            <div className="flex-shrink-0 mt-1">
                                <i className="ri-customer-service-line text-3xl lg:text-4xl text-light-text-secondary dark:text-dark-text-secondary group-hover:text-white transition-colors"></i>
                            </div>
                            <div>
                                <h3 className="text-xl lg:text-2xl font-normal mb-2">Support Contact</h3>
                                <p className="text-light-text dark:text-dark-text-secondary text-sm lg:text-base leading-relaxed max-w-md">
                                    If the problem persists, please{' '}
                                    <Link to="/#contact" className="text-blue-600 hover:underline font-medium">
                                        contact technical support
                                    </Link>{' '}
                                    for immediate diagnostic assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServerError;
