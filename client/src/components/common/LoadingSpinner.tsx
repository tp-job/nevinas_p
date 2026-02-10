import type { FC } from 'react';
import '@/styles/components/loading.css';

const LoadingSpinner: FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                {/* Spinner */}
                <div className="relative inline-block">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-8 h-8 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin"></div>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Loading...
                    </h2>
                    <p className="text-gray-600">
                        Please wait while we prepare your content
                    </p>
                </div>

                {/* Animated Dots */}
                <div className="flex justify-center items-center gap-2 mt-4">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>

                {/* loading */}
                <div className="loader">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>
        </div>
    );
}

export default LoadingSpinner