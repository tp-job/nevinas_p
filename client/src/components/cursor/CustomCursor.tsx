import { useEffect, useState } from "react";
const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      if (
        target.closest(
          'a, button, .fi, .lab-card, .btn-primary, .btn-nav, .btn-bio, [role="button"]',
        )
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  useEffect(() => {
    let frameId: number;
    const animateRing = () => {
      setRingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.15,
        y: prev.y + (pos.y - prev.y) * 0.15,
      }));
      frameId = requestAnimationFrame(animateRing);
    };
    frameId = requestAnimationFrame(animateRing);
    return () => cancelAnimationFrame(frameId);
  }, [pos]);
  return (
    <div className={hovering ? "hovering" : ""}>
      {" "}
      <div id="cur" style={{ left: pos.x, top: pos.y }}></div>{" "}
      <div id="cur-ring" style={{ left: ringPos.x, top: ringPos.y }}></div>{" "}
    </div>
  );
};
export default CustomCursor;
