import type { FC } from 'react';
import '@/styles/components/loading.css';

const Loading: FC = () => {
    return (
        <div className="flex justify-center items-center min-h-[350px]">
            <div className="inline-block w-[100px] h-[100px] relative">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_2s_linear_infinite] origin-center">
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#4285f4" />
                            <stop offset="25%" stop-color="#db4437" />
                            <stop offset="75%" stop-color="#f4b400" />
                            <stop offset="100%" stop-color="#0f9d58" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#0f9d58" />
                            <stop offset="25%" stop-color="#f4b400" />
                            <stop offset="75%" stop-color="#db4437" />
                            <stop offset="100%" stop-color="#4285f4" />
                        </linearGradient>
                    </defs>

                    <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient1)"
                    fill="none"
                    stroke-width="8"
                    stroke-linecap="round"
                    className="[stroke-dasharray:251.3274] [stroke-dashoffset:251.3274]
                    animate-[dash1_1.5s_cubic-bezier(0.66,0,0.34,1)_infinite_alternate]"
                    />

                    <circle
                    cx="50"
                    cy="50"
                    r="30"
                    stroke="url(#gradient2)"
                    fill="none"
                    stroke-width="8"
                    stroke-linecap="round"
                    className="[stroke-dasharray:188.4956] [stroke-dashoffset:0]
                    animate-[dash2_1.5s_cubic-bezier(0.66,0,0.34,1)_infinite_alternate]"
                    />
                </svg>
            </div>
        </div>
    );
}

export default Loading;
