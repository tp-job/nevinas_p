import { useEffect, useState, useCallback, useMemo } from "react";
import type { FC, MouseEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import Loading from "@/components/common/loading/Loading";
import ErrorView from "@/components/common/server-error/Error";

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
      const result = await response.json();
      setGallery(result.data || []);
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

      {/* ── Category Menu — Modern Japanese editorial ─────────────────────────
           Design language: ma (間) breathing room · ink-stroke tab underline
           · mixed script EN + JP · thin rule separators · no heavy boxes
      ─────────────────────────────────────────────────────────────────────── */}
      <div className="mb-8">

        {/* Eyebrow row — label + item count */}
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="flex items-center gap-2.5">
            {/* EN label — DS §2.3 label token */}
            <span className="text-[10px] font-semibold tracking-[.28em] uppercase text-[#878CB4]">
              CATEGORY
            </span>
            {/* thin vertical rule */}
            <span
              className="inline-block w-px h-[10px] rounded-full
                         bg-[rgba(30,35,60,0.20)] dark:bg-[rgba(200,205,235,0.20)]"
            />
            {/* JP label — Zen Kaku Gothic New, DS §2.1 JP font */}
            <span className="font-zen text-[11px] font-light tracking-wide
                             text-[#878CB4]/50 dark:text-[#878CB4]/40">
              カテゴリ
            </span>
          </div>

          {/* Filtered count — right-aligned, tabular nums */}
          <span className="text-[10px] font-medium tabular-nums text-[#878CB4]/60 select-none">
            {filteredGallery.length}
            <span className="font-light ml-1 opacity-70">items</span>
          </span>
        </div>

        {/* Aurora top rule — §1.8 AURORA_BAND gradient */}
        <div
          className="w-full h-px mb-0"
          style={{
            background:
              "linear-gradient(90deg, #C8CDEB 0%, #85758F 50%, #1E233C 100%)",
          }}
        />

        {/* Tab strip — horizontally scrollable, ink-stroke active indicator */}
        <div className="relative">
          <div className="flex items-stretch overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSelectedIndex(null);
                  }}
                  className={`
                    relative flex items-center gap-2 px-5 py-4
                    whitespace-nowrap shrink-0
                    text-[13px] font-medium
                    transition-colors duration-200
                    focus:outline-none focus-visible:ring-2
                    focus-visible:ring-[rgba(200,205,235,0.50)]
                    ${
                      isActive
                        ? "text-[#1E233C] dark:text-[#E8EAF5]"
                        : "text-[#878CB4] hover:text-[#465078] dark:hover:text-[#C8CDEB]"
                    }
                  `}
                >
                  {/* Icon — slightly muted when inactive */}
                  <i
                    className={`
                      ${category.icon} text-[14px] shrink-0 transition-opacity duration-200
                      ${isActive ? "opacity-100" : "opacity-60"}
                    `}
                    aria-hidden="true"
                  />
                  <span>{category.label}</span>

                  {/* Ink-stroke underline — aurora gradient slides between tabs
                      DS §1.8 AURORA_BAND · Framer Motion layoutId spring §14 */}
                  {isActive && (
                    <motion.div
                      layoutId="gallery-ink-stroke"
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #C8CDEB 0%, #85758F 50%, #465078 100%)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right-edge scroll-hint fade — signals more items to the right */}
          <div
            className="absolute top-0 right-0 bottom-0 w-12 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, var(--tw-gradient-from, #F0F1F8), transparent)",
            }}
          />
        </div>

        {/* Bottom rule — subtle mono border §1.11 */}
        <div className="w-full h-px bg-[rgba(30,35,60,0.08)] dark:bg-[rgba(200,205,235,0.08)]" />

      </div>

      {isLoading && <Loading />}
      {error && <ErrorView error={error} />}

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