import { useEffect, useState, useCallback } from 'react';
import type { FC, MouseEvent, KeyboardEvent } from 'react';

const API_BASE_URL = 'http://localhost:3000';

// Define interface for a gallery item
interface GalleryItem {
    _id: string;
    img: string;
    name?: string;
}

const Gallery: FC = () => {
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Fetches gallery data from the backend API.
    const fetchGallery = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/gallery`);
            if (!response.ok) {
                throw new Error('Failed to fetch gallery data');
            }
            const data: GalleryItem[] = await response.json();
            setGallery(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGallery();
    }, [fetchGallery]);

    const isLightboxOpen = selectedIndex !== null;

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    const showPrev = (e?: MouseEvent<HTMLButtonElement>) => {
        if (e) e.stopPropagation();
        setSelectedIndex((prev) => {
            if (prev === null) return null;
            return prev === 0 ? gallery.length - 1 : prev - 1;
        });
    };

    const showNext = (e?: MouseEvent<HTMLButtonElement>) => {
        if (e) e.stopPropagation();
        setSelectedIndex((prev) => {
            if (prev === null) return null;
            return prev === gallery.length - 1 ? 0 : prev + 1;
        });
    };

    useEffect(() => {
        if (!isLightboxOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };
        window.addEventListener('keydown', onKeyDown as any);
        return () => window.removeEventListener('keydown', onKeyDown as any);
    }, [isLightboxOpen, showNext, showPrev]);

    return (
        <div className="w-full">
            <div className="mb-6">
                <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Image Collection</h4>
                <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">Gallery</h2>
                <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">写真ライブラリ</h3>
            </div>

            {isLoading && <p>Loading gallery...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {gallery.map((item, index) => (
                        <button
                            key={item._id}
                            type="button"
                            onClick={() => openLightbox(index)}
                            className="aspect-square relative group overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-global-blue"
                        >
                            <img
                                src={`${API_BASE_URL}${item.img}?t=${new Date().getTime()}`}
                                alt={item.name || 'Gallery Item'}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://placehold.co/400x400?text=Image+Not+Found'; // Fallback
                                    target.onerror = null; // Prevent infinite loop
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}

            {isLightboxOpen && gallery.length > 0 && selectedIndex !== null && (
                <div onClick={closeLightbox} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <button onClick={closeLightbox} aria-label="Close / 閉じる" className="absolute top-4 right-4 text-white/90 hover:text-white transition-colors">
                        <i className="ri-close-line text-3xl"></i>
                    </button>
                    <div className="relative max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={`${API_BASE_URL}${gallery[selectedIndex].img}?t=${new Date().getTime()}`}
                            alt={gallery[selectedIndex].name || 'Gallery Item'}
                            className="max-h-[80vh] w-auto rounded-lg shadow-2xl"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://placehold.co/800x600?text=Image+Not+Found';
                            }}
                        />
                        <button onClick={showPrev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors" aria-label="Previous image / 前の画像">
                            <i className="ri-arrow-left-s-line text-3xl"></i>
                        </button>
                        <button onClick={showNext} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors" aria-label="Next image / 次の画像">
                            <i className="ri-arrow-right-s-line text-3xl"></i>
                        </button>
                        <div className="mt-2 text-white/90 text-sm">
                            {selectedIndex + 1} / {gallery.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;