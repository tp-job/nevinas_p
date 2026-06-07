import { createContext, useContext, useEffect, useRef, type FC, type ReactNode } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

export const SlideScrollContext = createContext<MotionValue<number> | null>(null);
export const useSlideScroll = () => useContext(SlideScrollContext);

export type SlideVariant = 'fill' | 'center' | 'content';

export interface SlideWrapperProps {
  children: ReactNode;
  slideIndex: number;
  className?: string;
  variant?: SlideVariant;
  scrollable?: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

const innerVariantClass: Record<SlideVariant, string> = {
  fill: 'w-full h-full [&>*]:w-full',
  center: 'flex w-full h-full flex-col items-center justify-center px-0 pb-0',
  content: 'flex w-full h-full flex-col items-stretch justify-center px-0 pb-0',
};

const SlideWrapper: FC<SlideWrapperProps> = ({
  children,
  slideIndex,
  className = '',
  variant = 'fill',
  scrollable = false,
  sentinelRef,
  scrollContainerRef,
}) => {
  const { scrollYProgress } = useScroll({
    target: sentinelRef,
    offset: ['start end', 'end start'],
    ...(scrollContainerRef ? { container: scrollContainerRef } : {}),
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !scrollable) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop === 0;
      const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) <= 1;

      // Intercept the scroll if we can still scroll in that direction
      if (e.deltaY > 0 && !atBottom) {
        el.scrollTop += e.deltaY;
        e.preventDefault();
        e.stopPropagation();
      } else if (e.deltaY < 0 && !atTop) {
        el.scrollTop += e.deltaY;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY; // Positive = swipe up / scroll down
      touchStartY = touchY;

      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop === 0;
      const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) <= 1;

      // Intercept the scroll if we can still scroll in that direction
      if (deltaY > 0 && !atBottom) {
        el.scrollTop += deltaY;
        e.preventDefault();
        e.stopPropagation();
      } else if (deltaY < 0 && !atTop) {
        el.scrollTop += deltaY;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, [scrollable]);

  // Enhanced fade animation with better performance
  // Using custom values for smoother transitions
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  );

  // Pointer events optimization - only interactive when mostly visible
  const pointerEvents = useTransform(
    scrollYProgress,
    (val) => {
      if (val < 0.2 || val > 0.8) return 'none';
      if (val > 0.3 && val < 0.7) return 'auto';
      return 'none';
    }
  );

  // Transform for subtle parallax effect when not active
  const yTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [20, -20]
  );

  // Removed scale effect - it was causing visible border artifacts
  // Keeping slides at scale 1 eliminates edge rendering issues

  return (
    <SlideScrollContext.Provider value={scrollYProgress}>
      <motion.section
        data-slide-index={slideIndex}
        style={{ 
          opacity,
          pointerEvents,
          y: yTransform,
        }}
        className={`relative z-[var(--z-overlay)] w-full h-full ${className}`}
        transition={{
          opacity: { duration: 0.6, ease: "easeOut" },
          y: { duration: 0.8, ease: "easeOut" }
        }}
      >
        <div className={`${innerVariantClass[variant]} w-full h-full`}>
          {/* If the slide has internal scrolling, allow it locally */}
          <div
            ref={scrollRef}
            className={`w-full h-full ${scrollable ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'}`}
          >
            {children}
          </div>
        </div>
      </motion.section>
    </SlideScrollContext.Provider>
  );
};

export default SlideWrapper;
