import React from "react";
import Section3D from "./Section3D";
import { MODEL_3D_ITEMS } from "@/data/models3d";
import { useGLTF } from "@react-three/drei";

const InteractiveBanner = () => {
  React.useEffect(() => {
    MODEL_3D_ITEMS.forEach((model) => useGLTF.preload(model.url));
  }, []);

  const [active, setActive] = React.useState(0);
  return (
    <section
      id="3d-viewer"
      className="relative px-6 sm:px-14 py-24 overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 50%, rgba(192,96,245,0.03), transparent 70%), var(--color-light-bg)",
      }}
    >
      {/* Dark mode override */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dark #\\33d-viewer {
          background: radial-gradient(circle at 50% 50%, rgba(192,96,245,0.08), transparent 70%), var(--color-dark-bg) !important;
        }
      `}} />

      {/* ───────── Background Grid (3D perspective feel) ───────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(192,96,245,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(123,90,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          transform: "perspective(900px) rotateX(60deg)",
          transformOrigin: "top",
          opacity: 0.15,
        }}
      />

      {/* Velvet radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 800px 600px at 50% 60%, rgba(192,96,245,0.08), transparent 70%)"
      }} />

      {/* Azure accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 600px 400px at 30% 40%, rgba(89,131,252,0.06), transparent 60%)"
      }} />

      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-16">
          <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#c060f5] mb-2">
            3D Experience
          </h4>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-light-text dark:text-dark-text">
            Interactive Specimen
          </h2>
          <div className="w-10 h-1 bg-gradient-to-r from-[#c060f5] to-[#7b5aff] rounded-full mt-5 opacity-40" />
        </div>

        {/* ───────── Main Interactive Area ───────── */}
        <div className="relative select-none min-h-[520px] flex items-center">
          {/* BIG background text */}
          <div className="absolute inset-0 flex flex-col justify-center pointer-events-none">
            <p
              className="font-inter leading-[0.85]"
              style={{
                fontSize: "clamp(6rem, 14vw, 13rem)",
                opacity: 0.04,
                letterSpacing: "-0.04em",
              }}
            >
              DRAG
              <br />
              TO
              <br />
              SPIN
            </p>
          </div>

          {/* Stroke layer */}
          <div className="absolute inset-0 flex flex-col justify-center pointer-events-none">
            <p
              className="font-inter leading-[0.85]"
              style={{
                fontSize: "clamp(6rem, 14vw, 13rem)",
                letterSpacing: "-0.04em",
                WebkitTextStroke: "1px rgba(192,96,245,0.35)",
                color: "transparent",
                opacity: 0.30,
              }}
            >
              DRAG
              <br />
              TO
              <br />
              SPIN
            </p>
          </div>

          {/* ───────── 3D Canvas ───────── */}
          <div className="absolute inset-0 z-10">
            <Section3D
              url={MODEL_3D_ITEMS[active].url}
              className="w-full h-full"
              rotationY={0.003}
              intensity={1.2}
              float={false}
              interactive
              shadow={false}
            />
          </div>

          {/* Ground / Anchor line */}
          <div className="absolute bottom-0 left-0 w-full h-px z-20" style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(192,96,245,0.30) 30%, rgba(123,90,255,0.40) 50%, rgba(192,96,245,0.30) 70%, transparent 100%)"
          }} />

          {/* Drag Hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c060f5]" />
              <span className="w-6 h-px bg-gradient-to-r from-[#c060f5] to-[#7b5aff] animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-[#7b5aff]" />
            </div>
            <span className="text-[0.65rem] tracking-[0.25em] uppercase text-[#c060f5] opacity-70 font-medium">
              Drag
            </span>
          </div>
        </div>

        {/* ───────── Model Switcher ───────── */}
        <div className="flex flex-wrap items-center gap-3 mt-16 justify-center">
          {MODEL_3D_ITEMS.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-[0.75rem] font-medium tracking-wide transition-all duration-300 border backdrop-blur-md ${
                active === i
                  ? "bg-gradient-to-r from-[#c060f5] to-[#7b5aff] text-white border-transparent shadow-[0_8px_24px_rgba(192,96,245,0.30)] scale-105"
                  : "bg-light-surface/60 dark:bg-dark-surface/60 text-light-text-secondary dark:text-dark-text-secondary border-light-border dark:border-dark-border hover:border-[rgba(192,96,245,0.40)] hover:text-[#c060f5] hover:scale-105"
              }`}
            >
              <i
                className={`${m.icon} transition-transform duration-300 group-hover:rotate-12`}
              ></i>
              {m.label}
            </button>
          ))}
        </div>

        {/* ───────── Label ───────── */}
        <div className="mt-6 text-center">
          <p className="text-[0.65rem] tracking-widest uppercase text-light-text-secondary dark:text-dark-text-secondary opacity-50 font-medium">
            WebGL · Real-time render · {MODEL_3D_ITEMS[active].label}
          </p>
        </div>
      </div>
    </section>
  );
};
export default InteractiveBanner;
