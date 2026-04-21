import { useEffect, useState, useCallback, useMemo } from "react";
import type { FC, MouseEvent, KeyboardEvent } from "react";
import Loading from "@/components/ui/common/Loading";
import Error from "@/components/ui/common/Error";

const API_BASE_URL = "http://localhost:3000";

// Define interface for a gallery item
interface GalleryItem {
  _id: string;
  img: string;
  name?: string;
  category?: string;
}

// Category menu items
const categories = [
  { id: "all", label: "ทั้งหมด", icon: "ri-image-line" },
  { id: "architecture", label: "สถาปัตยกรรม", icon: "ri-building-line" },
  { id: "nature", label: "ธรรมชาติ", icon: "ri-landscape-line" },
  { id: "exhibition", label: "นิทรรศการ", icon: "ri-gallery-line" },
  { id: "bangkok", label: "กรุงเทพฯ", icon: "ri-map-pin-line" },
  { id: "vintage", label: "วินเทจ", icon: "ri-time-line" },
  { id: "history", label: "ประวัติศาสตร์", icon: "ri-book-open-line" },
  { id: "travel", label: "การเดินทาง", icon: "ri-flight-takeoff-line" },
];

const Gallery: FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Fetches gallery data from the backend API.
  const fetchGallery = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/gallery`);
      if (!response.ok) {
        throw new Error("Failed to fetch gallery data");
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

  // Filter gallery items by category
  const filteredGallery = useMemo(() => {
    if (activeCategory === "all") return gallery;

    // Try to match category from image name or path
    return gallery.filter((item) => {
      const name = (item.name || "").toLowerCase();
      const img = (item.img || "").toLowerCase();
      const category = (item.category || "").toLowerCase();

      // Match category keywords
      const categoryKeywords: Record<string, string[]> = {
        architecture: ["สถาปัตยกรรม", "architecture", "building", "structure"],
        nature: ["ธรรมชาติ", "nature", "landscape", "forest", "tree"],
        exhibition: ["นิทรรศการ", "exhibition", "gallery", "art"],
        bangkok: ["กรุงเทพ", "bangkok", "bkk", "thailand"],
        vintage: ["วินเทจ", "vintage", "old", "retro"],
        history: ["ประวัติศาสตร์", "history", "historical", "ancient"],
        travel: ["การเดินทาง", "travel", "trip", "journey"],
      };

      const keywords = categoryKeywords[activeCategory] || [];
      return keywords.some(
        (keyword) =>
          name.includes(keyword) ||
          img.includes(keyword) ||
          category.includes(keyword),
      );
    });
  }, [gallery, activeCategory]);

  const showPrev = useCallback(
    (e?: MouseEvent<HTMLButtonElement>) => {
      if (e) e.stopPropagation();
      setSelectedIndex((prev) => {
        if (prev === null) return null;
        return prev === 0 ? filteredGallery.length - 1 : prev - 1;
      });
    },
    [filteredGallery],
  );

  const showNext = useCallback(
    (e?: MouseEvent<HTMLButtonElement>) => {
      if (e) e.stopPropagation();
      setSelectedIndex((prev) => {
        if (prev === null) return null;
        return prev === filteredGallery.length - 1 ? 0 : prev + 1;
      });
    },
    [filteredGallery],
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", onKeyDown as any);
    return () => window.removeEventListener("keydown", onKeyDown as any);
  }, [isLightboxOpen, showNext, showPrev]);

  // Update selected index when category changes
  useEffect(() => {
    // Only update if lightbox is open and we have a valid index
    if (
      selectedIndex !== null &&
      filteredGallery.length > 0 &&
      selectedIndex < filteredGallery.length
    ) {
      // Index is already valid for filtered gallery, no need to update
      return;
    }
    // If lightbox is open but index is invalid, close it
    if (selectedIndex !== null && filteredGallery.length === 0) {
      setSelectedIndex(null);
    }
  }, [activeCategory, filteredGallery, selectedIndex]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">
          Image Collection
        </h4>
        <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">
          Gallery
        </h2>
        <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">
          写真ライブラリ
        </h3>
      </div>

      {/* Category Menu */}
      <div className="mb-8">
        <div className="relative h-20 flex items-center overflow-hidden border-t border-b border-light-border dark:border-dark-border">
          {/* ALBUM Label Section */}
          <div className="absolute left-0 top-0 bottom-0 px-8 bg-background-light dark:bg-background-dark z-50 flex items-center gap-4 border-r border-light-border dark:border-dark-border">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <i className="ri-image-line text-xl"></i>
            </div>
            <span className="text-sm font-black text-light-text-primary dark:text-dark-text-primary tracking-wider uppercase">
              CATEGORY
            </span>
          </div>

          {/* Category Menu Items */}
          <div className="flex-1 ml-[200px] flex items-center gap-4 overflow-x-auto scrollbar-hide px-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setSelectedIndex(null);
                }}
                className={`
                                    flex items-center gap-2 px-6 py-3 whitespace-nowrap
                                    transition-all duration-300 ease-out shrink-0
                                    ${
                                      activeCategory === category.id
                                        ? "text-light-text-primary dark:text-dark-text-primary font-semibold"
                                        : "text-light-text-secondary dark:text-dark-text-secondary font-medium hover:text-light-text-primary dark:hover:text-dark-text-primary"
                                    }
                                `}
              >
                <i className={`${category.icon} text-lg`}></i>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <Loading />}
      {error && <Error error={error} />}

      {!isLoading && !error && (
        <>
          {filteredGallery.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-image-line text-6xl text-light-text-secondary dark:text-dark-text-secondary mb-4"></i>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                No images found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGallery.map((item, index) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="aspect-square relative group overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-global-blue"
                >
                  <img
                    src={`${API_BASE_URL}${item.img}?t=${new Date().getTime()}`}
                    alt={item.name || "Gallery Item"}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://placehold.co/400x400?text=Image+Not+Found";
                      target.onerror = null;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {isLightboxOpen &&
        filteredGallery.length > 0 &&
        selectedIndex !== null && (
          <div
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={closeLightbox}
              aria-label="Close / 閉じる"
              className="absolute top-4 right-4 text-white/90 hover:text-white transition-colors"
            >
              <i className="ri-close-line text-3xl"></i>
            </button>
            <div
              className="relative max-w-5xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${API_BASE_URL}${filteredGallery[selectedIndex].img}?t=${new Date().getTime()}`}
                alt={filteredGallery[selectedIndex].name || "Gallery Item"}
                className="max-h-[80vh] w-auto rounded-lg shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://placehold.co/800x600?text=Image+Not+Found";
                }}
              />
              <button
                onClick={showPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Previous image / 前の画像"
              >
                <i className="ri-arrow-left-s-line text-3xl"></i>
              </button>
              <button
                onClick={showNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Next image / 次の画像"
              >
                <i className="ri-arrow-right-s-line text-3xl"></i>
              </button>
              <div className="mt-2 text-white/90 text-sm">
                {selectedIndex + 1} / {filteredGallery.length}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Gallery;
