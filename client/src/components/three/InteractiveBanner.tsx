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
      id="timeline"
      className="relative px-14 py-32 overflow-hidden bg-bg text-text-b"
    >
      {" "}
      {/* ───────── Background Grid (3D feel) ───────── */}{" "}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: ` linear-gradient(var(--color-dark-text-secondary) 1px, transparent 1px), linear-gradient(90deg, var(--color-dark-text-secondary) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          transform: "perspective(900px) rotateX(60deg)",
          transformOrigin: "top",
          opacity: 0.06,
        }}
      />{" "}
      {/* subtle radial glow */}{" "}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_60%)] opacity-10 pointer-events-none" />{" "}
      <div className="max-w-[1400px] mx-auto">
        {" "}
        {/* Header */}{" "}
        <div className="mb-10">
          {" "}
          <div className="eyebrow text-primary tracking-[0.3em] text-xs uppercase">
            {" "}
            Interactive Specimen{" "}
          </div>{" "}
        </div>{" "}
        {/* ───────── Main Interactive Area ───────── */}{" "}
        <div className="relative select-none min-h-[520px] flex items-center">
          {" "}
          {/* BIG background text */}{" "}
          <div className="absolute inset-0 flex flex-col justify-center pointer-events-none">
            {" "}
            <p
              className="font-inter leading-[0.85]"
              style={{
                fontSize: "clamp(6rem, 14vw, 13rem)",
                opacity: 0.06,
                letterSpacing: "-0.04em",
              }}
            >
              {" "}
              DRAG
              <br />
              TO
              <br />
              SPIN{" "}
            </p>{" "}
          </div>{" "}
          {/* Stroke layer */}{" "}
          <div className="absolute inset-0 flex flex-col justify-center pointer-events-none">
            {" "}
            <p
              className="font-inter leading-[0.85]"
              style={{
                fontSize: "clamp(6rem, 14vw, 13rem)",
                letterSpacing: "-0.04em",
                WebkitTextStroke: "1px var(--color-primary)",
                color: "transparent",
                opacity: 0.25,
              }}
            >
              {" "}
              DRAG
              <br />
              TO
              <br />
              SPIN{" "}
            </p>{" "}
          </div>{" "}
          {/* ───────── 3D Canvas ───────── */}{" "}
          <div className="absolute inset-0 z-10">
            {" "}
            <Section3D
              url={MODEL_3D_ITEMS[active].url}
              className="w-full h-full"
              rotationY={0.003}
              intensity={1.2}
              float={false}
              interactive
              shadow={false}
            />{" "}
          </div>{" "}
          {/* Ground / Anchor line */}{" "}
          <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/40 to-transparent z-20" />{" "}
          {/* Drag Hint (improved) */}{" "}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 pointer-events-none">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <span className="w-2 h-2 rounded-full bg-primary" />{" "}
              <span className="w-6 h-px bg-primary animate-pulse" />{" "}
              <span className="w-2 h-2 rounded-full bg-primary" />{" "}
            </div>{" "}
            <span className="text-[0.7rem] tracking-[0.25em] uppercase text-primary opacity-70 font-medium">
              {" "}
              Drag{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
        {/* ───────── Model Switcher ───────── */}{" "}
        <div className="flex flex-wrap items-center gap-4 mt-16 justify-center">
          {" "}
          {MODEL_3D_ITEMS.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className={`group flex items-center gap-2 px-6 py-3 rounded-full text-[0.78rem] font-semibold tracking-wide transition-all duration-300 border backdrop-blur-md ${active === i ? "bg-primary text-white border-primary shadow-lg scale-105" : "bg-bg/60 text-text-m border-white/20 hover:border-primary/60 hover:text-primary hover:scale-105"}`}
            >
              {" "}
              <i
                className={`${m.icon} transition-transform duration-300 group-hover:rotate-12`}
              ></i>
              {m.label}{" "}
            </button>
          ))}{" "}
        </div>{" "}
        {/* ───────── Label ───────── */}{" "}
        <div className="mt-6 text-center">
          {" "}
          <p className="text-[0.72rem] tracking-widest uppercase text-text-s opacity-60">
            {" "}
            WebGL · Real-time render · {MODEL_3D_ITEMS[active].label}{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};
export default InteractiveBanner;
