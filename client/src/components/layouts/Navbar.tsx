/**
 * Navbar.tsx — Nocturnal Atelier Design System v3.2
 * ────────────────────────────────────────────────────
 * Composes the pieces in ./navbar/:
 *   constants.ts        glass styles, nav links, motion variants, helpers
 *   useMusicPlayer.ts   playback state + controls (audio element lives here)
 *   EQBars / MoodDot / SectionLabel   small DS components
 *   PlaylistDropdown    desktop playlist popover
 *   MobileDrawer        mobile overlay + side drawer
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
} from "react";
import { useTheme } from "@/context/ThemeContext";
import { Assets, DataSong } from "@/data/homeData";
import GlassSurface from "@/components/effect/GlassSurface";
import EQBars from "./navbar/EQBars";
import MoodDot from "./navbar/MoodDot";
import PlaylistDropdown from "./navbar/PlaylistDropdown";
import MobileDrawer from "./navbar/MobileDrawer";
import { glassStyles, HOME_LINKS, iconBtnCls } from "./navbar/constants";
import { useMusicPlayer } from "./navbar/useMusicPlayer";

// ─────────────────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────────────────
interface NavbarProps {
  scrollContainerId?: string;
  onGoto?: (index: number) => void;
}

const Navbar: FC<NavbarProps> = ({
  scrollContainerId = "homepage-scroll",
  onGoto,
}) => {
  const { toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [marqueeDuration, setMarqueeDuration] = useState("15s");
  // DS §5.2 — theme-aware glass: observe .dark class on <html>
  const [isDark, setIsDark] = useState(false);

  const sideMenuRef = useRef<HTMLDivElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const player = useMusicPlayer();
  const {
    songIndex, isPlaying, setIsPlaying, audioRef,
    playMusic, pauseMusic, nextSong, currentTitle,
  } = player;

  // ── Dark-mode observer (for theme-aware inline glass styles) ─────────────
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const root =
      document.getElementById(scrollContainerId) ?? document.documentElement;
    const onScroll = () => {
      const y =
        root === document.documentElement ? window.scrollY : root.scrollTop;
      setIsScrolled(y > 50);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => root.removeEventListener("scroll", onScroll);
  }, [scrollContainerId]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // ── Hash scroll ───────────────────────────────────────────────────────────
  const scrollToHash = useCallback(
    (href: string) => {
      if (onGoto) {
        const map: Record<string, number> = {
          "#top": 0,
          "#about": 5,
          "#services": 11,
          "#work": 12,
          "#contact": 16,
        };
        if (map[href] !== undefined) onGoto(map[href]);
        closeMenu();
        return;
      }
      const id = href.replace(/^#/, "");
      if (!id) return;
      const container = document.getElementById(scrollContainerId);
      const el =
        container?.querySelector<HTMLElement>(`#${CSS.escape(id)}`) ??
        document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu();
    },
    [scrollContainerId, closeMenu, onGoto],
  );

  // ── Body-scroll lock + Escape + focus trap (mobile menu) ─────────────────
  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    sideMenuRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen, closeMenu]);

  // ── Close on desktop resize ───────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isDropdownOpen]);

  // ── Marquee duration ──────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const track = marqueeTrackRef.current;
      if (!track) return;
      const singleWidth = track.scrollWidth / 2;
      const seconds = Math.max(10, Math.min(30, singleWidth / 80));
      setMarqueeDuration(`${seconds.toFixed(2)}s`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [songIndex]);

  // ── Computed nav classes ──────────────────────────────────────────────────
  // DS §1.11 semantic surfaces
  const navClass = isScrolled
    ? "text-light-text dark:text-dark-text border-b border-light-border dark:border-[rgba(200,205,235,0.12)]"
    : "text-light-text dark:text-dark-text";

  // Nav links pill — glass surface when not scrolled (DS §5.1 Float layer)
  // Dark: richer bg with periwinkle-tinted border for premium depth
  const navLinksClass = !isScrolled
    ? "bg-light-surface-2/90 dark:bg-[rgba(10,15,25,0.70)] backdrop-blur-2xl shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.50)] border border-light-border dark:border-[rgba(200,205,235,0.14)]"
    : "dark:border dark:border-[rgba(200,205,235,0.08)]";

  // ── Glass style for current theme ────────────────────────────────────────
  const glass = isDark ? glassStyles.dark : glassStyles.light;

  return (
    <div className="font-inter">
      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* HEADER (Glass surface wrapper)                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <header
        className={`pointer-events-none fixed top-0 left-0 right-0 z-50 w-full transition-shadow duration-400 ${isScrolled
            ? "shadow-[0_4px_24px_rgba(30,35,60,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.60)]"
            : ""
          }`}
      >
        <GlassSurface
          borderRadius={0}
          borderWidth={0.03}
          brightness={isDark ? 18 : 88}
          opacity={isDark ? 0.82 : 0.92}
          blur={isDark ? 32 : 24}
          backgroundOpacity={isDark ? 0.55 : 0.06}
          saturation={isDark ? 1.8 : 2.2}
          className="pointer-events-auto w-full overflow-visible"
          style={{ width: "100%", height: "auto", borderRadius: 0 }}
        >
          {/* ── Dark mode inner tint — DS midnight→haze premium gradient ── */}
          {isDark && (
            <div
              className="absolute inset-0 pointer-events-none z-[1]"
              style={{
                background: [
                  "linear-gradient(90deg,",
                  "rgba(10,15,25,0.72) 0%,",
                  "rgba(19,23,43,0.65) 40%,",
                  "rgba(30,35,60,0.60) 70%,",
                  "rgba(10,15,25,0.72) 100%)",
                ].join(" "),
                borderBottom: "1px solid rgba(200,205,235,0.10)",
              }}
            />
          )}
          {/* ───────────────────────────────────────────────── DESKTOP NAV ── */}
          <nav
            aria-label="Main navigation"
            className={`hidden lg:flex w-full px-8 xl:px-[8%] py-3 items-center justify-between
                        transition-all duration-400 ${navClass}`}
          >
            {/* ── Zone 1: Logo + Music Pill ── */}
            <div className="flex items-center gap-6 lg:gap-8">
              {/* Logo — DS §6.4 nav logo 30px */}
              <img
                src={Assets.logo}
                alt="Nevinas"
                className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-full cursor-pointer bg-charcoal p-1
                           shadow-lg border border-[rgba(200,205,235,0.12)]
                           hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              />

              {/* ── Music Pill — DS Quick Ref: bg #0A0F19 / bars #C8CDEB ── */}
              <div
                className="hidden sm:flex items-center gap-3 rounded-full
                           px-3.5 py-1.5 pl-2"
                style={{
                  background: "var(--color-charcoal)",
                  border: "1px solid rgba(200,205,235,0.10)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(200,205,235,0.06)",
                }}
              >
                {/* Mood-ring dot — DS §15.5 conic sub-palette */}
                <MoodDot size={28} />

                {/* EQ bars — DS §15.4 + Quick Ref periwinkle */}
                <EQBars isPlaying={isPlaying} />

                {/* Song title marquee */}
                <div className="w-32 overflow-hidden">
                  <div
                    className="marquee-track whitespace-nowrap"
                    ref={marqueeTrackRef}
                    style={
                      {
                        "--marquee-duration": marqueeDuration,
                      } as React.CSSProperties
                    }
                  >
                    <span className="text-[0.68rem] font-medium text-periwinkle/70 marquee-text">
                      {currentTitle}
                    </span>
                    <span
                      className="text-[0.68rem] font-medium text-periwinkle/70 marquee-text"
                      aria-hidden="true"
                    >
                      {currentTitle}
                    </span>
                  </div>
                </div>

                {/* Hidden audio element — preload="none" so the multi-MB MP3s
                    never download until the user actually hits play. */}
                <audio
                  ref={audioRef}
                  src={DataSong[songIndex].song}
                  preload="none"
                  onEnded={nextSong}
                  onLoadedData={() => {
                    if (isPlaying) {
                      try { audioRef.current?.play(); }
                      catch { /* autoplay blocked */ }
                    }
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* Play / Pause */}
                <button
                  onClick={isPlaying ? pauseMusic : playMusic}
                  className="text-cool hover:text-periwinkle hover:-translate-y-0.5
                             active:translate-y-0 transition-all duration-200 ml-1"
                  aria-label={isPlaying ? "Pause music" : "Play music"}
                >
                  <i
                    className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"
                      } text-[14px]`}
                  />
                </button>

                {/* Playlist toggle — [FIX] ri-play-list-2-line (DS §20: ri/si only) */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen((p) => !p)}
                    className="text-cool/60 hover:text-periwinkle hover:-translate-y-0.5
                               active:translate-y-0 transition-all duration-200"
                    aria-label="Toggle playlist"
                    aria-expanded={isDropdownOpen}
                  >
                    <i className="ri-play-list-2-line text-[14px]" />
                  </button>

                  {/* ── Playlist Dropdown — DS §5.2 glass + §17 animation ── */}
                  <PlaylistDropdown
                    isOpen={isDropdownOpen}
                    onClose={() => setIsDropdownOpen(false)}
                    isDark={isDark}
                    glass={glass}
                    player={player}
                  />
                </div>
              </div>
            </div>

            {/* ── Zone 2: Nav Links ── */}
            {/* DS §12 nav link pill */}
            <ul
              className={`items-center flex gap-1 px-2 py-1.5 rounded-full
                          whitespace-nowrap transition-all duration-300 ${navLinksClass}`}
            >
              {HOME_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHash(link.href);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-[0.75rem] font-medium
                               text-cool dark:text-cool
                               hover:text-light-text dark:hover:text-dark-text
                               hover:bg-[rgba(70,80,120,0.08)] dark:hover:bg-[rgba(200,205,235,0.08)]
                               transition-all duration-200 block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* ── Zone 3: Theme toggle + Contact CTA ── */}
            <div className="flex items-center gap-3">
              {/* DS §13.9 ThemeToggle (simplified — no framer-motion swap needed) */}
              <button
                onClick={toggleTheme}
                className={`w-8 h-8 ${iconBtnCls}`}
                aria-label="Toggle theme"
              >
                <i className="text-[15px] ri-moon-line dark:hidden" />
                <i className="hidden text-[15px] ri-sun-line dark:block" />
              </button>

              {/* DS §13.1 Outline light button — Contact */}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash("#contact");
                }}
                className="hidden xl:flex items-center gap-1.5 text-[0.75rem] font-medium
                           border border-[rgba(30,35,60,0.12)] dark:border-[rgba(200,205,235,0.12)]
                           rounded-full px-3.5 py-1.5
                           text-light-text dark:text-dark-text
                           hover:border-[rgba(70,80,120,0.35)] hover:bg-[rgba(70,80,120,0.08)]
                           dark:hover:border-[rgba(200,205,235,0.25)] dark:hover:bg-[rgba(200,205,235,0.08)]
                           hover:-translate-y-px active:translate-y-0
                           transition-all duration-200"
              >
                <i className="ri-mail-send-line text-[13px]" />
                Contact
              </a>
            </div>
          </nav>

          {/* ──────────────────────────────────────────────── MOBILE TOP BAR ── */}
          <div
            className="flex lg:hidden min-h-16 w-full items-center justify-between
                       px-5 py-3 text-light-text dark:text-dark-text"
          >
            {/* Logo + Brand */}
            <div className="flex items-center gap-3">
              <img
                src={Assets.logo}
                alt="logo"
                className="w-9 h-9 object-cover rounded-full bg-charcoal p-1 shadow-md
                           border border-[rgba(200,205,235,0.10)]"
              />
              <h1 className="text-[0.82rem] font-medium text-light-text dark:text-dark-text">
                Nevinas Ka
              </h1>
            </div>

            {/* Theme + Hamburger */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleTheme}
                className={`w-8 h-8 ${iconBtnCls}`}
                aria-label="Toggle theme"
              >
                <i className="text-[15px] ri-moon-line dark:hidden" />
                <i className="hidden text-[15px] ri-sun-line dark:block" />
              </button>
              <button
                onClick={() => setIsMenuOpen(true)}
                className={`w-8 h-8 ${iconBtnCls}`}
                aria-label="Open navigation menu"
              >
                <i className="text-[20px] ri-menu-3-line" />
              </button>
            </div>
          </div>
        </GlassSurface>
      </header>

      {/* Mobile overlay + side drawer */}
      <MobileDrawer
        isMenuOpen={isMenuOpen}
        closeMenu={closeMenu}
        sideMenuRef={sideMenuRef}
        isDark={isDark}
        glass={glass}
        player={player}
        scrollToHash={scrollToHash}
      />
    </div>
  );
};

export default Navbar;
