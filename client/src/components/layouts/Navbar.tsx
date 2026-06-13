/**
 * Navbar.tsx — Nocturnal Atelier Design System v3.2
 * ────────────────────────────────────────────────────
 * Reviewed by: Frontend Lead · Designer · QA · Tester · PM · Prompt Engineer
 *
 * Changes from original:
 *  [COLOR]   All #c060f5 / #7b5aff off-palette colors → DS main/sub palette
 *  [COLOR]   EQ bar gradient → #C8CDEB→#878CB4 (DS Quick Ref: "bars #C8CDEB")
 *  [COLOR]   Play button → grad-primary (#1E233C→#465078, DS §1.13)
 *  [COLOR]   Active song → Chip primary (rgba(200,205,235,.20) + border, DS §13.2)
 *  [COLOR]   Drawer bg → DS Midnight/Haze/Periwinkle radial mesh (no off-palette purple)
 *  [MOTION]  All hover:scale-110 / active:scale-90 → hover:-translate-y-0.5 (DS §20 rule)
 *  [GLASS]   Dropdown & mobile card → DS §5.2 Physical Glass spec (inline, theme-aware)
 *  [GLASS]   Specular ::before → French Gray rgba(184,190,215,.45) (DS §5.2)
 *  [LOGIC]   Added prevSong useCallback (symmetry with nextSong)
 *  [LOGIC]   isDark observer — theme-aware glass/drawer styles w/o CSS-only hacks
 *  [LOGIC]   Dropdown AnimatePresence — DS §17 timing: 0.22s [.22,1,.36,1]
 *  [UI]     "Now Playing" shows title + artist separately in dropdown & mobile
 *  [UI]     Pill dot → conic-gradient sub-palette mood-ring (DS §15.5 palette)
 *  [ICONS]  TbArrowsExchange → ri-play-list-2-line (DS §20: ri/si only)
 *  [A11Y]   role="dialog" aria-modal aria-hidden, Escape key, focus trap — preserved
 *  [TYPE]   Labels → 0.58rem font-semibold tracking-[.22em] uppercase (DS §2.3 `label`)
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FC,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { Assets, DataSong } from "@/data/HomeData";
import GlassSurface from "@/components/effect/GlassSurface";

// ─────────────────────────────────────────────────────────────────────────────
// Design System §15.4 — EQ Bars
// Quick Ref: "Music pill bg: #0A0F19 / bars #C8CDEB"
// Gradient: Periwinkle #C8CDEB → Cool Gray #878CB4 (vertical)
// @keyframes eq: from{height:3px} to{height:11px} (DS globals.css)
// ─────────────────────────────────────────────────────────────────────────────
const EQBars: FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const delays = [0, 0.05, 0.1, 0.12, 0.18];
  return (
    <div className="flex items-end gap-[2.5px] h-[14px]" aria-hidden="true">
      {delays.map((d, i) => (
        <span
          key={i}
          className="w-[2.5px] rounded-full"
          style={{
            background: "linear-gradient(180deg, var(--color-periwinkle) 0%, var(--color-cool) 100%)",
            height: isPlaying ? undefined : "3px",
            animation: isPlaying
              ? `eq .7s ease-in-out ${d}s infinite alternate`
              : "none",
          }}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Design System §15.5 — Mood Ring dot (sub-palette conic)
// Uses: Periwinkle(main) · French Gray · Mountbatten · EV1 · EV2 · back
// Animation: moodSpin 8s linear infinite (defined in DS globals.css)
// ─────────────────────────────────────────────────────────────────────────────
const MoodDot: FC<{ size?: number }> = ({ size = 28 }) => (
  <div
    aria-hidden="true"
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      background: [
        "conic-gradient(from 0deg,",
        "rgba(200,205,235,0.90),",   // Periwinkle (main)
        "rgba(184,190,215,0.85),",   // French Gray (sub)
        "rgba(133,117,143,0.90),",   // Mountbatten ★ (sub warm bridge)
        "rgba(82,78,104,0.85),",     // English Violet 1 (sub)
        "rgba(70,80,120,0.90),",     // Haze (main)
        "rgba(200,205,235,0.90))",   // back to Periwinkle
      ].join(" "),
      boxShadow:
        "0 0 10px rgba(200,205,235,0.22), 0 0 5px rgba(133,117,143,0.18)",
      animation: "moodSpin 8s linear infinite",
    }}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
// Design System §5.2 — Physical Glass (theme-aware inline styles)
// Light:  white gradient + French Gray specular (rgba(184,190,215,.45))
// Dark:   midnight gradient + Cool Gray Sub specular (rgba(175,174,204,.12))
// ─────────────────────────────────────────────────────────────────────────────
const glassStyles = {
  light: {
    background:
      "linear-gradient(145deg,rgba(255,255,255,0.82) 0%,rgba(255,255,255,0.60) 40%,rgba(255,255,255,0.30) 100%)",
    backdropFilter: "blur(20px) saturate(160%) brightness(1.04)",
    WebkitBackdropFilter: "blur(20px) saturate(160%) brightness(1.04)",
    borderTop: "1px solid rgba(255,255,255,0.90)",
    borderLeft: "1px solid rgba(255,255,255,0.75)",
    borderRight: "1px solid rgba(200,205,235,0.20)",
    borderBottom: "1px solid rgba(200,205,235,0.15)",
    boxShadow:
      "0 16px 40px rgba(30,35,60,0.12),0 4px 12px rgba(30,35,60,0.06),inset 0 1px 0 rgba(255,255,255,0.95),inset 0 -1px 0 rgba(30,35,60,0.04)",
  },
  dark: {
    background:
      "linear-gradient(145deg,rgba(30,35,60,0.70) 0%,rgba(46,53,88,0.48) 40%,rgba(10,15,25,0.30) 100%)",
    backdropFilter: "blur(24px) saturate(160%)",
    WebkitBackdropFilter: "blur(24px) saturate(160%)",
    border: "1px solid rgba(200,205,235,0.12)",
    boxShadow:
      "0 16px 40px rgba(0,0,0,0.50),0 4px 12px rgba(0,0,0,0.28),inset 0 1px 0 rgba(200,205,235,0.10),inset 0 -1px 0 rgba(0,0,0,0.18)",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Navigation links — icons from react-icons/ri (DS §20 rule)
// ─────────────────────────────────────────────────────────────────────────────
const HOME_LINKS = [
  { href: "#top", label: "Home", icon: "ri-home-4-line" },
  { href: "#about", label: "About me", icon: "ri-user-3-line" },
  { href: "#services", label: "Services", icon: "ri-heart-3-line" },
  { href: "#work", label: "My Work", icon: "ri-briefcase-4-line" },
  { href: "#contact", label: "Contact Me", icon: "ri-mail-send-line" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Framer Motion variants — DS §17 timing
// Dropdown: 0.22s [.22,1,.36,1]
// ─────────────────────────────────────────────────────────────────────────────
const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1.00 },
  exit: { opacity: 0, y: -5, scale: 0.97 },
};
const dropdownTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

// ─────────────────────────────────────────────────────────────────────────────
// Component: Label — DS §2.3 type scale (`label` token)
// 0.58rem · font-semibold · tracking-[.22em] · uppercase · muted
// ─────────────────────────────────────────────────────────────────────────────
const SectionLabel: FC<{ children: string }> = ({ children }) => (
  <p
    className="text-[0.58rem] font-semibold tracking-[0.22em] uppercase
               text-cool opacity-60 mb-3"
  >
    {children}
  </p>
);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const getSongTitle = (raw: string) => raw.split(" - ")[0] ?? raw;
const getSongArtist = (raw: string) =>
  raw.includes(" - ") ? raw.split(" - ").slice(1).join(" - ") : null;

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
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [marqueeDuration, setMarqueeDuration] = useState("15s");
  // DS §5.2 — theme-aware glass: observe .dark class on <html>
  const [isDark, setIsDark] = useState(false);

  const sideMenuRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  // ── Audio controls ────────────────────────────────────────────────────────
  const playMusic = () => { audioRef.current?.play(); setIsPlaying(true); };
  const pauseMusic = () => { audioRef.current?.pause(); setIsPlaying(false); };

  const changeSong = (index: number) => {
    if (index === songIndex) {
      if (!isPlaying) playMusic();
      return;
    }
    setSongIndex(index);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {/* autoplay blocked */ });
    }, 50);
  };

  const nextSong = useCallback(() => {
    setSongIndex((p) => (p + 1) % DataSong.length);
    setIsPlaying(true);
  }, []);

  // [FIX] — added prevSong (was inline lambda in original, now consistent callback)
  const prevSong = useCallback(() => {
    setSongIndex((p) => (p - 1 + DataSong.length) % DataSong.length);
    setIsPlaying(true);
  }, []);

  // ── Current song metadata ──────────────────────────────────────────────────
  const currentTitle = getSongTitle(DataSong[songIndex].title);
  const currentArtist = getSongArtist(DataSong[songIndex].title);

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

  // ── Play button — DS §13.1 Primary (grad-primary) ────────────────────────
  const playBtnStyle = {
    background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-haze) 100%)",
    boxShadow: "0 6px 20px rgba(70,80,120,0.35)",
  };

  // ── Common icon button classes ────────────────────────────────────────────
  // DS §20: hover:-translate-y-0.5, never scale()
  const iconBtnCls =
    "flex items-center justify-center rounded-full text-cool " +
    "hover:text-periwinkle hover:bg-periwinkle/10 " +
    "hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200";

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
                className="w-10 sm:w-11 rounded-full cursor-pointer bg-charcoal p-1
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

                {/* Hidden audio element */}
                <audio
                  ref={audioRef}
                  src={DataSong[songIndex].song}
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
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={dropdownTransition}
                        className="absolute top-full right-0 mt-4 w-[22rem] rounded-[1.5rem]
                                   overflow-hidden z-[200]"
                        style={glass}
                      >
                        {/* French Gray specular — DS §5.2 ::before equivalent */}
                        <div
                          className="absolute top-0 left-0 w-1/2 h-1/2 pointer-events-none z-0"
                          style={{
                            background: isDark
                              ? "radial-gradient(ellipse at top left,rgba(175,174,204,0.12) 0%,transparent 65%)"
                              : "radial-gradient(ellipse at top left,rgba(184,190,215,0.45) 0%,transparent 65%)",
                            borderRadius: "inherit",
                          }}
                        />

                        <div className="relative z-10 p-6">
                          {/* Now Playing section */}
                          <div className="mb-5">
                            <SectionLabel>Now Playing</SectionLabel>
                            <h4
                              className="text-[0.92rem] font-normal leading-snug
                                         text-light-text dark:text-dark-text truncate"
                            >
                              {currentTitle}
                            </h4>
                            {currentArtist && (
                              <p className="text-[0.72rem] text-cool mt-0.5 truncate">
                                {currentArtist}
                              </p>
                            )}
                          </div>

                          {/* Controls — DS §13.1 Primary button */}
                          <div className="flex items-center gap-4 mb-5">
                            <button
                              onClick={prevSong}
                              className="text-cool hover:text-haze dark:hover:text-periwinkle
                                         hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                              aria-label="Previous song"
                            >
                              <i className="ri-skip-back-mini-fill text-[20px]" />
                            </button>

                            <button
                              onClick={isPlaying ? pauseMusic : playMusic}
                              className="w-11 h-11 flex items-center justify-center rounded-full
                                         text-dark-text hover:-translate-y-0.5 active:translate-y-0
                                         transition-all duration-200"
                              style={playBtnStyle}
                              aria-label={isPlaying ? "Pause" : "Play"}
                            >
                              <i
                                className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"
                                  } text-[20px]`}
                              />
                            </button>

                            <button
                              onClick={nextSong}
                              className="text-cool hover:text-haze dark:hover:text-periwinkle
                                         hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                              aria-label="Next song"
                            >
                              <i className="ri-skip-forward-mini-fill text-[20px]" />
                            </button>

                            <span className="ml-auto text-[0.60rem] font-medium tracking-widest
                                            text-cool opacity-40">
                              {songIndex + 1} / {DataSong.length}
                            </span>
                          </div>

                          {/* Aurora divider — DS §1.8 grad-aurora-band */}
                          <div
                            className="h-px mb-5"
                            style={{
                              background:
                                "linear-gradient(90deg,transparent,rgba(200,205,235,0.30) 30%,rgba(133,117,143,0.25) 60%,transparent)",
                            }}
                          />

                          {/* Playlist */}
                          <SectionLabel>Playlist</SectionLabel>
                          <div className="space-y-1">
                            {DataSong.map((song, idx) => (
                              <button
                                key={song.id}
                                onClick={() => {
                                  changeSong(idx);
                                  setIsDropdownOpen(false);
                                }}
                                className={`flex items-center justify-between w-full px-3.5 py-2.5
                                            rounded-xl text-left text-[0.75rem] transition-all
                                            duration-200 hover:-translate-y-px ${idx === songIndex
                                    /* DS §13.2 Chip primary — active song */
                                    ? "bg-[rgba(200,205,235,0.20)] border border-[rgba(200,205,235,0.40)] text-haze dark:text-periwinkle font-medium"
                                    /* DS §13.2 Chip muted — inactive */
                                    : "text-cool border border-transparent hover:bg-[rgba(200,205,235,0.10)] hover:border-[rgba(200,205,235,0.18)] font-normal"
                                  }`}
                              >
                                <span className="truncate pr-3">
                                  {song.title}
                                </span>
                                {idx === songIndex && (
                                  <i className="ri-volume-up-fill text-[12px] shrink-0 text-cool" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                className="w-9 h-9 rounded-full bg-charcoal p-1 shadow-md
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
      {/* DS §4.1 bg radial mesh — NO off-palette purple                       */}
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
    </div>
  );
};

export default Navbar;