import type { FC } from "react";
import { Assets } from "@/data/HomeData";
import { useProfile } from "@/context/ProfileContext";
import LiquidEther from "@/effect/LiquidEther";

const Header: FC = () => {
  const { avatar, setAvatar, avatarUrl } = useProfile();

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Dynamic & Immersive Liquid Glass background */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <LiquidEther
          className="h-full w-full"
          style={{ width: "100%", height: "100%" }}
          colors={["#5227FF", "#FF9FFC", "#B497CF"]}
          resolution={0.5}
          mouseForce={5.5}
          cursorSize={90}
          autoDemo={true}
          autoSpeed={0.07}
          autoIntensity={0.45}
          isViscous={true}
          viscous={15}
          iterationsViscous={16}
        />
      </div>

      {/* Glass overlay to ensure absolute text readability and premium glassmorphic depth */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-b from-transparent via-light-bg/30 to-light-bg/70 dark:via-dark-bg/40 dark:to-dark-bg/80 backdrop-blur-[1px]" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-11/12 h-full min-h-0 max-w-3xl gap-4 mx-auto text-center py-6 select-none">
        {/* photo portfolio */}
        <div className="relative w-60 h-60 sm:w-72 sm:h-72">
          {/* main avatar */}
          <div className="flex items-center justify-center mt-10">
            <img
              src={avatarUrl}
              alt="profile"
              className="object-cover w-40 h-40 sm:w-60 sm:h-60 rounded-full shadow-[0_8px_32px_rgba(82,39,255,0.2)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)] border border-light-border dark:border-dark-border"
            />
          </div>

          {/* nevinas - top */}
          <button
            onClick={() => setAvatar("nevinas")}
            aria-pressed={avatar === "nevinas"}
            className={`absolute top-[50px] left-[-55px] sm:top-[50px] sm:left-[-75px] overflow-hidden rounded-full w-18 h-18 sm:w-20 sm:h-20 ring-2 ${avatar === "nevinas" ? "ring-global-blue" : "ring-light-border"} shadow hover:-translate-y-1 duration-500`}
          >
            <img
              src={Assets.nevinas}
              alt="nevinas"
              className="object-cover w-full h-full"
            />
          </button>

          {/* changli - left */}
          <button
            onClick={() => setAvatar("changli")}
            aria-pressed={avatar === "changli"}
            className={`absolute top-[150px] left-[-55px] sm:top-[180px] sm:left-[-75px] overflow-hidden rounded-full w-18 h-18 sm:w-24 sm:h-24 ring-2 ${avatar === "changli" ? "ring-global-blue" : "ring-light-border"} shadow hover:-translate-y-1 duration-500`}
          >
            <img
              src={Assets.changli}
              alt="changli"
              className="object-cover w-full h-full"
            />
          </button>

          {/* feixiao - right */}
          <button
            onClick={() => setAvatar("feixiao")}
            aria-pressed={avatar === "feixiao"}
            className={`absolute top-[90px] right-[-65px] sm:top-[120px] sm:right-[-85px] overflow-hidden rounded-full w-18 h-18 sm:w-24 sm:h-24 ring-2 ${avatar === "feixiao" ? "ring-global-blue" : "ring-light-border"} shadow hover:-translate-y-1 duration-500`}
          >
            <img
              src={Assets.feixiao}
              alt="feixiao"
              className="object-cover w-full h-full"
            />
          </button>
        </div>
        <h3 className="flex items-end gap-4 mb-1 text-xl md:text-2xl text-light-text dark:text-white font-medium select-text">
          Hi I'm Nevinas
          <i className="ri-check-line text-base text-center text-white bg-matte-azure rounded-full px-1"></i>
        </h3>
        <h1 className="text-3xl sm:text-5xl lg:text-[56px] text-light-text dark:text-dark-text font-normal leading-tight tracking-tight select-text">
          Frontend web developer based in Isekai
        </h1>
        <h4 className="max-w-2xl mx-auto font-zen text-light-text-secondary dark:text-dark-text-secondary font-light select-text">
          私の名前はネヴィナスです。異世界出身のフロントエンド開発者です。
        </h4>
        <div className="flex flex-col items-center gap-4 mt-4 sm:flex-row">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="px-10 py-3 border rounded-full bg-gradient-to-r from-[#c060f5] to-[#7b5aff] text-white font-medium flex items-center gap-2 border-transparent shadow-[0_8px_24px_rgba(192,96,245,0.30)] hover:shadow-[0_12px_32px_rgba(192,96,245,0.40)] hover:-translate-y-0.5 transition-all duration-200"
          >
            Contact Me
          </a>
          <a
            href={Assets.resume}
            download
            className="flex items-center gap-2 px-10 py-3 bg-light-surface dark:bg-dark-surface backdrop-blur-xl border border-black/12 dark:border-white/12 rounded-full text-light-text dark:text-dark-text font-medium hover:border-matte-azure/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            My resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
