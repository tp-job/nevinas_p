import type { FC } from "react";
import { Assets } from "@/data/HomeData";
import { useProfile } from "@/context/ProfileContext";
import LiquidEther from "@/components/effect/LiquidEther";

/** DS periwinkle mesh — index.css @theme palette, minimal wave motion */
const DS_ETHER_PALETTE = [
  "#E8EAF5", // periwinkle-pale
  "#C8CDEB", // periwinkle
  "#A8B0D9", // periwinkle-mid
  "#878CB4", // cool
] as const;

const Header: FC = () => {
  const { avatar, setAvatar, avatarUrl } = useProfile();

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}
    >
      {/* ─── LiquidEther — DS periwinkle mesh, minimal waves ─────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <LiquidEther
          className="h-full w-full"
          style={{ width: "100%", height: "100%", WebkitFontSmoothing: "antialiased" }}

          colors={[...DS_ETHER_PALETTE]}

          resolution={0.5}

          // mouseForce ลดลง — interactive แต่ไม่ก่อคลื่นใหญ่
          mouseForce={10}

          // cursorSize เล็กลง — blob precision สูง ไม่ฟุ้ง
          cursorSize={90}

          autoDemo={true}

          // autoSpeed 0.85: ช้าลง → smooth gradient feel ไม่ใช่ active wave
          autoSpeed={0.85}

          // autoIntensity 0.42: blob เล็กพอดี โชว์สีสวย ไม่ฟุ้งทั่วจอ
          autoIntensity={0.42}

          isViscous={true}

          // viscous 32: KEY สำหรับ "ไม่ต้องมีคลื่นมาก"
          // viscosity สูง = wave propagate ช้า + ดับเร็ว → พื้นผิวราบเรียบ
          // เหมือนน้ำมันหนืดแทนน้ำ = smooth gradient ไม่ใช่ ripple
          viscous={32}

          // iterationsViscous 26: solve ละเอียด → ยิ่ง damp wave ได้ดี
          iterationsViscous={26}
        />
      </div>

      {/* ─── Glass overlay — blue tint, dual theme ────────────────────────── */}
      {/*
       *  Light: via/10 → to/40
       *    พื้นขาวยังโชว์เป็น base + ฟ้าปรากฏ soft clean
       *
       *  Dark: via/18 → to/52
       *    ฟ้าสวย glow บนพื้นดำ luminous blue aurora
       */}
      <div
        className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-b from-transparent via-light-bg/10 to-light-bg/40 dark:via-dark-bg/18 dark:to-dark-bg/52 backdrop-blur-[1px]"
        style={{ WebkitFontSmoothing: "antialiased" }}
      />

      {/* ─── Main content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center w-11/12 h-full min-h-0 max-w-3xl gap-4 mx-auto text-center py-6 select-none">

        {/* Photo / avatar selector */}
        <div className="relative w-60 h-60 sm:w-72 sm:h-72">

          {/* Main avatar — blue-tinted shadow */}
          <div className="flex items-center justify-center mt-10">
            <img
              src={avatarUrl}
              alt="profile"
              fetchPriority="high"
              decoding="async"
              className="object-cover w-40 h-40 sm:w-60 sm:h-60 rounded-full shadow-glow border border-light-border dark:border-dark-border"
            />
          </div>

          {/* Nevinas — top-left */}
          <button
            onClick={() => setAvatar("nevinas")}
            aria-pressed={avatar === "nevinas"}
            className={`absolute top-[50px] left-[-55px] sm:top-[50px] sm:left-[-75px] overflow-hidden rounded-full w-18 h-18 sm:w-20 sm:h-20 ring-2 ${
              avatar === "nevinas" ? "ring-periwinkle" : "ring-light-border"
            } shadow hover:-translate-y-1 duration-500`}
          >
            <img src={Assets.nevinas} alt="nevinas" className="object-cover w-full h-full" />
          </button>

          {/* Changli — bottom-left */}
          <button
            onClick={() => setAvatar("changli")}
            aria-pressed={avatar === "changli"}
            className={`absolute top-[150px] left-[-55px] sm:top-[180px] sm:left-[-75px] overflow-hidden rounded-full w-18 h-18 sm:w-24 sm:h-24 ring-2 ${
              avatar === "changli" ? "ring-periwinkle" : "ring-light-border"
            } shadow hover:-translate-y-1 duration-500`}
          >
            <img src={Assets.changli} alt="changli" className="object-cover w-full h-full" />
          </button>

          {/* Feixiao — right */}
          <button
            onClick={() => setAvatar("feixiao")}
            aria-pressed={avatar === "feixiao"}
            className={`absolute top-[90px] right-[-65px] sm:top-[120px] sm:right-[-85px] overflow-hidden rounded-full w-18 h-18 sm:w-24 sm:h-24 ring-2 ${
              avatar === "feixiao" ? "ring-periwinkle" : "ring-light-border"
            } shadow hover:-translate-y-1 duration-500`}
          >
            <img src={Assets.feixiao} alt="feixiao" className="object-cover w-full h-full" />
          </button>
        </div>

        {/* Name badge */}
        <h3 className="flex items-end gap-4 mb-1 text-xl md:text-2xl text-light-text dark:text-white font-medium select-text">
          Hi I'm Nevinas
          <i className="ri-check-line text-base text-center text-dark-text-primary bg-periwinkle rounded-full px-1" />
        </h3>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-[56px] text-light-text dark:text-dark-text font-normal leading-tight tracking-tight select-text">
          Frontend web developer based in Isekai
        </h1>

        {/* Sub-heading */}
        <h4 className="max-w-2xl mx-auto font-zen text-light-text-secondary dark:text-dark-text-secondary font-light select-text">
          私の名前はネヴィナスです。異世界出身のフロントエンド開発者です。
        </h4>

        {/* CTA buttons */}
        <div className="flex flex-col items-center gap-4 mt-4 sm:flex-row">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="px-10 py-3 border rounded-full bg-gradient-to-r from-midnight to-haze text-dark-text-primary font-medium flex items-center gap-2 border-transparent shadow-md hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200"
          >
            Contact Me
          </a>
          <a
            href={Assets.resume}
            download
            className="flex items-center gap-2 px-10 py-3 bg-light-surface dark:bg-dark-surface backdrop-blur-xl border border-light-border dark:border-dark-border rounded-full text-light-text dark:text-dark-text font-medium hover:border-periwinkle/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            My resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;