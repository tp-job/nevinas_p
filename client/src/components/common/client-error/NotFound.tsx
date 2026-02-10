import type { FC } from 'react';
import { Assets } from '@/data/HomeData';
import { Link } from 'react-router-dom';

const NotFound: FC = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden text-white">
            {/* background image */}
            <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{backgroundImage: `url(${Assets.bgpage})`,}} />
            {/* dark overlay */}
            <div className="absolute inset-0 -z-10 bg-black/60" />
            {/* content */}
            <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
                <h1 className="mb-4 text-6xl font-bold md:text-[170px]">404</h1>
                <p className="mb-8 max-w-xl text-gray-300 text-xl md:text-4xl">Oops! You’ve drifted into the unknown.</p>
                <p className="mb-8 max-w-xl text-gray-300">The page you are looking for has either been moved, deleted, or never existed.</p>
                <div className="flex flex-col items-center gap-4 mt-4 sm:flex-row">
                    <Link to="/" className="px-10 py-3 border rounded-full text-white flex items-center gap-2 ">Go Home</Link>
                    <Link to="/" className="flex items-center gap-2 px-10 py-3 rounded-full text-white">Try Again</Link>
                </div>
            </main>
        </div>
    );
};

export default NotFound;