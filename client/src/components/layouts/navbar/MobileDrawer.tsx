import type { CSSProperties, FC, RefObject } from "react";
import { Assets, DataSong } from "@/data/homeData";
import SectionLabel from "./SectionLabel";
import { HOME_LINKS, iconBtnCls, playBtnStyle } from "./constants";
import type { MusicPlayer } from "./useMusicPlayer";

interface MobileDrawerProps {
  isMenuOpen: boolean;
  closeMenu: () => void;
  sideMenuRef: RefObject<HTMLDivElement | null>;
  isDark: boolean;
  glass: CSSProperties;
  player: MusicPlayer;
  scrollToHash: (href: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile overlay + side drawer
// DS §4.1 bg radial mesh — NO off-palette purple
// ─────────────────────────────────────────────────────────────────────────────
const MobileDrawer: FC<MobileDrawerProps> = ({
  isMenuOpen,
  closeMenu,
  sideMenuRef,
  isDark,
  glass,
  player,
  scrollToHash,
}) => {
  const {
    songIndex, isPlaying, playMusic, pauseMusic,
    changeSong, nextSong, prevSong, currentTitle, currentArtist,
  } = player;

  // ── Drawer background — DS palette radial mesh (no off-palette purple) ───
  // Light: Periwinkle + Haze radial → white base
  // Dark:  Mountbatten sub + Haze radial → Charcoal base (DS §4.1 dark mesh)
  const drawerBg = isDark
    ? [
      "radial-gradient(550px at 80% 100%,rgba(133,117,143,0.13),transparent)",
      "radial-gradient(450px at 0% 0%,rgba(70,80,120,0.10),transparent)",
      "linear-gradient(180deg,rgba(10,15,25,0.90),rgba(19,23,43,0.95))",
    ].join(",")
    : [
      "radial-gradient(550px at 80% 100%,rgba(200,205,235,0.14),transparent)",
      "radial-gradient(450px at 0% 0%,rgba(70,80,120,0.08),transparent)",
      "linear-gradient(180deg,rgba(255,255,255,0.90),rgba(240,241,248,0.95))",
    ].join(",");

  return (
    <>
      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* MOBILE OVERLAY                                                       */}
      {/* DS §4.1 dark bg: rgba(10,15,25,0.70) Charcoal tinted               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 lg:hidden z-40 transition-opacity duration-400
                    backdrop-blur-sm ${isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
        style={{ background: "color-mix(in srgb, var(--color-dark-bg) 72%, transparent)" }}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* MOBILE SIDE DRAWER                                                   */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div
        id="sideMenu"
        ref={sideMenuRef}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-80
                    transition-transform duration-500 ease-in-out
                    border-r border-[rgba(30,35,60,0.10)] dark:border-[rgba(200,205,235,0.08)]
                    shadow-2xl lg:hidden overflow-hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{
          background: drawerBg,
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <button
          onClick={closeMenu}
          className={`absolute top-5 right-5 w-9 h-9 ${iconBtnCls}
                      hover:text-light-text dark:hover:text-dark-text`}
          aria-label="Close menu"
        >
          <i className="ri-close-line text-[22px]" />
        </button>

        <div className="flex flex-col p-6 gap-6 h-full overflow-y-auto custom-scrollbar">

          {/* ── Music Player Card — DS §5.2 Physical Glass ── */}
          <div
            className="rounded-[1.5rem] p-5 relative overflow-hidden"
            style={glass}
          >
            {/* Specular highlight — French Gray (light) / Cool Gray Sub (dark) */}
            <div
              className="absolute top-0 left-0 w-1/2 h-1/2 pointer-events-none"
              style={{
                background: isDark
                  ? "radial-gradient(ellipse at top left,rgba(175,174,204,0.12) 0%,transparent 65%)"
                  : "radial-gradient(ellipse at top left,rgba(184,190,215,0.45) 0%,transparent 65%)",
                borderRadius: "inherit",
              }}
            />

            <div className="relative z-10">
              {/* Label — DS §2.3 `label` token */}
              <SectionLabel>Now Playing</SectionLabel>

              {/* Song info */}
              <h4
                className="text-[0.92rem] font-normal leading-snug
                           text-light-text dark:text-dark-text truncate"
              >
                {currentTitle}
              </h4>
              {currentArtist && (
                <p className="text-[0.72rem] text-cool mt-0.5 mb-4 truncate">
                  {currentArtist}
                </p>
              )}

              {/* Player controls — DS §13.1 Primary + no-scale hover */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={prevSong}
                  className="w-9 h-9 flex items-center justify-center rounded-full
                             text-cool
                             bg-[rgba(30,35,60,0.05)] dark:bg-[rgba(200,205,235,0.06)]
                             hover:text-haze dark:hover:text-periwinkle
                             hover:bg-[rgba(70,80,120,0.10)] dark:hover:bg-[rgba(200,205,235,0.10)]
                             hover:-translate-y-0.5 active:translate-y-0
                             transition-all duration-200"
                  aria-label="Previous song"
                >
                  <i className="ri-skip-back-mini-fill text-[18px]" />
                </button>

                {/* Primary play button — DS §13.1 grad-primary */}
                <button
                  onClick={isPlaying ? pauseMusic : playMusic}
                  className="w-12 h-12 flex items-center justify-center rounded-full
                             text-dark-text
                             hover:-translate-y-0.5 active:translate-y-0
                             transition-all duration-200"
                  style={playBtnStyle}
                  aria-label={isPlaying ? "Pause music" : "Play music"}
                >
                  <i
                    className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"
                      } text-[22px]`}
                  />
                </button>

                <button
                  onClick={nextSong}
                  className="w-9 h-9 flex items-center justify-center rounded-full
                             text-cool
                             bg-[rgba(30,35,60,0.05)] dark:bg-[rgba(200,205,235,0.06)]
                             hover:text-haze dark:hover:text-periwinkle
                             hover:bg-[rgba(70,80,120,0.10)] dark:hover:bg-[rgba(200,205,235,0.10)]
                             hover:-translate-y-0.5 active:translate-y-0
                             transition-all duration-200"
                  aria-label="Next song"
                >
                  <i className="ri-skip-forward-mini-fill text-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Playlist ── */}
          <div>
            <SectionLabel>Playlist</SectionLabel>
            <div className="space-y-1">
              {DataSong.map((song, idx) => (
                <button
                  key={song.id}
                  onClick={() => changeSong(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl
                              text-[0.78rem] transition-all duration-200
                              hover:-translate-y-px ${idx === songIndex
                      /* DS §13.2 Chip primary */
                      ? "bg-[rgba(200,205,235,0.20)] border border-[rgba(200,205,235,0.40)] text-haze dark:text-periwinkle font-medium"
                      /* DS §13.2 Chip muted */
                      : "text-cool border border-transparent hover:bg-[rgba(200,205,235,0.10)] dark:hover:bg-[rgba(200,205,235,0.06)] font-normal"
                    }`}
                >
                  <span className="truncate block">{song.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aurora divider — DS §1.8 grad-aurora-band */}
          <div
            className="h-px -my-2"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(200,205,235,0.28) 35%,rgba(133,117,143,0.22) 65%,transparent)",
            }}
          />

          {/* ── Explorer / Nav Links ── */}
          <div className="flex flex-col">
            <SectionLabel>Explorer</SectionLabel>
            <nav aria-label="Mobile navigation" className="flex flex-col gap-0.5">
              {HOME_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHash(link.href);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                             text-cool dark:text-cool
                             hover:text-light-text dark:hover:text-dark-text
                             hover:bg-[rgba(200,205,235,0.10)] dark:hover:bg-[rgba(200,205,235,0.06)]
                             hover:-translate-y-px active:translate-y-0
                             transition-all duration-200 group"
                >
                  <span
                    className="w-5 h-5 flex items-center justify-center text-[17px]
                                opacity-55 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <i className={link.icon} />
                  </span>
                  <span className="text-[0.82rem] font-normal">{link.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* ── Footer — DS §2.3 label token ── */}
          <div
            className="mt-auto pt-4 flex items-center gap-3
                       border-t border-[rgba(30,35,60,0.08)] dark:border-[rgba(200,205,235,0.08)]"
          >
            <img
              src={Assets.logo}
              className="w-7 h-7 rounded-full bg-charcoal p-0.5 shadow-md"
              alt="logo"
            />
            <span
              className="text-[0.58rem] font-semibold tracking-widest uppercase
                         text-cool opacity-50"
            >
              NEVINAS.DEV
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
