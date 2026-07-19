import type { FC } from "react";
import { Assets } from "@/data/homeData";
import { useProfile } from "@/context/ProfileContext";

const Header: FC = () => {
  const { avatar, setAvatar, avatarUrl } = useProfile();

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}
    >
      {/* LiquidEther mesh is now a single shared backdrop mounted in HomePage. */}

      {/* ─── Glass overlay — eases the ether into the page bg, dual theme ──── */}
      {/*
       *  Soft page-bg tint at top (under the navbar) and bottom (toward the
       *  next slide) with a transparent middle where the content sits — so the
       *  mesh frames the hero and blends seamlessly at the slide seams instead
       *  of ending on a hard periwinkle edge.
       */}
      <div
        className="absolute inset-0 z-1 pointer-events-none backdrop-blur-[1px] bg-gradient-to-b from-light-bg/25 via-transparent to-light-bg/45 dark:from-dark-bg/30 dark:via-transparent dark:to-dark-bg/55"
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