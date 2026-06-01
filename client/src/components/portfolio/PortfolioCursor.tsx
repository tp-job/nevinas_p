import { useEffect, useRef, useState } from "react";

type Props = { isLight: boolean };

const HOVER_SELECTOR =
  '[data-hover], a, button, .sk, .proj, .svc, .step, .ct-submit-btn, .ct-alt-row, .npill, .bc, .feat, .faq-item, .rsc-tab, .rsc-proj-item, .ag-cta';

export default function PortfolioCursor({ isLight }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [ring, setRing] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const posRef = useRef(pos);
  posRef.current = pos;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target as HTMLElement;
      setHovering(!!t.closest(HOVER_SELECTOR));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let id = 0;
    const tick = () => {
      setRing((prev) => ({
        x: prev.x + (posRef.current.x - prev.x) * 0.13,
        y: prev.y + (posRef.current.y - prev.y) * 0.13,
      }));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <div
        className={`cd${isLight ? " light" : ""}`}
        style={{ left: pos.x, top: pos.y }}
      />
      <div
        className={`cr${isLight ? " light" : ""}${hovering ? " h" : ""}`}
        style={{ left: ring.x, top: ring.y }}
      />
    </>
  );
}
