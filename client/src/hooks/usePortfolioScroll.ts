import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, PORTFOLIO_SCROLL } from "@/lib/portfolioScroll";

export function usePortfolioScroll(slideCount: number) {
  const [target, setTarget] = useState(0);
  const [current, setCurrent] = useState(0);
  const targetRef = useRef(0);
  const touchYRef = useRef(0);
  const rafRef = useRef<number>(0);

  const setScrollTarget = useCallback((value: number) => {
    const v = clamp(value, 0, 1);
    targetRef.current = v;
    setTarget(v);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      setScrollTarget(index / slideCount + 0.001);
    },
    [slideCount, setScrollTarget],
  );

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("#s-faq, #s-rsc, .rsc-left, .rsc-center")) return;

      e.preventDefault();
      const delta =
        Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120) * PORTFOLIO_SCROLL.SENS_W;
      setScrollTarget(targetRef.current + delta);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("#s-faq, #s-rsc, .rsc-left, .rsc-center")) return;

      e.preventDefault();
      const dy = touchYRef.current - e.touches[0].clientY;
      touchYRef.current = e.touches[0].clientY;
      setScrollTarget(targetRef.current + dy * PORTFOLIO_SCROLL.SENS_T);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const step = 1 / slideCount;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        setScrollTarget(targetRef.current + step);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        setScrollTarget(targetRef.current - step);
      } else if (e.key === "Home") {
        setScrollTarget(0);
      } else if (e.key === "End") {
        setScrollTarget(1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [slideCount, setScrollTarget]);

  useEffect(() => {
    const tick = () => {
      setCurrent((prev) => {
        const next = prev + (targetRef.current - prev) * PORTFOLIO_SCROLL.LERP_SPD;
        return Math.abs(next - targetRef.current) < 0.0001 ? targetRef.current : next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const activeIndex = Math.min(slideCount - 1, Math.floor(current * slideCount));

  return {
    current,
    target,
    activeIndex,
    progressPercent: Math.round(current * 100),
    goToSlide,
    setScrollTarget,
  };
}
