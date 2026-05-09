import { useEffect, useRef, useState, useCallback } from "react";
import type { FC } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Assets, DataSong } from "@/data/HomeData";
import { TbArrowsExchange } from "react-icons/tb";

const HOME_LINKS = [
  { href: "#top", label: "Home", icon: "ri-home-4-line" },
  { href: "#about", label: "About me", icon: "ri-user-3-line" },
  { href: "#services", label: "Services", icon: "ri-heart-3-line" },
  { href: "#work", label: "My Work", icon: "ri-briefcase-4-line" },
  { href: "#contact", label: "Contact Me", icon: "ri-mail-send-line" },
];

const Navbar: FC = () => {
  const { toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const sideMenuRef = useRef<HTMLDivElement | null>(null);
  const [songIndex, setSongIndex] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const [marqueeDuration, setMarqueeDuration] = useState<string>("15s");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // [FIX #1] Scroll effect via React state instead of DOM manipulation
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Lock body scroll + Escape key + focus trap
  useEffect(() => {
    if (isMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeMenu();
      };
      window.addEventListener("keydown", onKeyDown);
      const firstLink = sideMenuRef.current?.querySelector("a");
      firstLink?.focus?.();
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [isMenuOpen, closeMenu]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // [FIX #4] Close song dropdown on click outside
  useEffect(() => {
    if (!isDropdownOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isDropdownOpen]);

  // Marquee duration calculation
  useEffect(() => {
    const updateDuration = () => {
      const track = marqueeTrackRef.current;
      if (!track) return;
      const singleWidth = track.scrollWidth / 2;
      const pxPerSecond = 80;
      const seconds = Math.max(10, Math.min(30, singleWidth / pxPerSecond));
      setMarqueeDuration(`${seconds.toFixed(2)}s`);
    };
    updateDuration();
    window.addEventListener("resize", updateDuration);
    return () => window.removeEventListener("resize", updateDuration);
  }, [songIndex]);

  const playMusic = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };
  const pauseMusic = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };
  const changeSong = (index: number) => {
    if (index === songIndex) {
      if (!isPlaying) playMusic();
      return;
    }
    setSongIndex(index);
    setIsPlaying(true);
    // Force play on next tick if needed, though onLoadedData usually handles it
    setTimeout(() => {
      audioRef.current?.play().catch(() => {
        /* autoplay blocked */
      });
    }, 50);
  };
  const nextSong = useCallback(() => {
    setSongIndex((prev) => (prev + 1) % DataSong.length);
    setIsPlaying(true);
  }, []);

  // Nav classes based on scroll state
  const navClass = isScrolled
    ? "bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] border-b border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
    : "text-light-text dark:text-dark-text";
    
  const navLinksClass = !isScrolled
    ? "bg-white/90 dark:bg-white/7 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.40)] border border-black/10 dark:border-white/11"
    : "";

  return (
    <div className="font-inter">
      {/* ======================== */}
      {/* Desktop Navbar */}
      {/* ======================== */}
      <nav
        className={`hidden lg:flex w-full fixed px-8 xl:px-[8%] py-3 items-center justify-between z-50 transition-all duration-400 ${navClass}`}
      >
        {/* logo + music */}
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-3">
            <img
              src={Assets.logo}
              alt="Nevinas logo"
              className="w-10 sm:w-11 rounded-full cursor-pointer bg-black p-1 shadow-lg border border-white/10 hover:scale-105 active:scale-95 transition-all"
            />
          </div>

          {/* ── Premium Music Player Pill ── */}
          <div className="hidden sm:flex items-center gap-3 bg-[#0d0d0d] rounded-full px-3.5 py-1.5 pl-2">
            {/* Velvet glow dot */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c060f5] to-[#7b5aff] shrink-0 shadow-[0_0_12px_rgba(192,96,245,0.4)]" />
            
            {/* Equalizer bars */}
            <div className="flex items-end gap-[2px] h-3.5">
              {[0, 0.05, 0.10, 0.12, 0.18].map((d, i) => (
                <span
                  key={i}
                  className="w-[2px] rounded-full bg-white/80"
                  style={{
                    animation: isPlaying
                      ? `eq .7s ease-in-out ${d}s infinite alternate`
                      : "none",
                    height: isPlaying ? undefined : "3px",
                  }}
                />
              ))}
            </div>

            {/* Song title marquee */}
            <div className="w-24 marquee-container">
              <div
                className="marquee-track"
                ref={marqueeTrackRef}
                style={
                  { "--marquee-duration": marqueeDuration } as React.CSSProperties
                }
              >
                <span className="text-[0.68rem] font-medium text-white/70 marquee-text">
                  {DataSong[songIndex].title.split(' - ')[0]}
                </span>
                <span
                  className="text-[0.68rem] font-medium text-white/70 marquee-text"
                  aria-hidden="true"
                >
                  {DataSong[songIndex].title.split(' - ')[0]}
                </span>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={DataSong[songIndex].song}
              onEnded={nextSong}
              onLoadedData={() => {
                if (isPlaying) {
                  try {
                    audioRef.current?.play();
                  } catch (_) {
                    /* autoplay blocked */
                  }
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            ></audio>

            {/* Play/Pause */}
            <button
              onClick={isPlaying ? pauseMusic : playMusic}
              className="text-white/60 hover:text-white transition-colors ml-1"
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              <i
                className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"} text-[14px]`}
              ></i>
            </button>

            {/* Song Switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Change song"
                aria-expanded={isDropdownOpen}
              >
                <TbArrowsExchange className="text-[14px]" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full right-[-60px] mt-4 w-80 glass-premium rounded-[2rem] p-7 z-[60]">
                  <div className="relative z-10">
                    {/* Top Player Controls */}
                    <div className="flex items-center justify-between mb-7">
                      <div className="flex items-center gap-5">
                        <button 
                          onClick={() => setSongIndex((prev) => (prev - 1 + DataSong.length) % DataSong.length)}
                          className="text-light-text-secondary dark:text-dark-text-secondary opacity-40 hover:opacity-100 transition-opacity hover:scale-110 active:scale-90"
                        >
                          <i className="ri-skip-back-mini-fill text-[18px]"></i>
                        </button>
                        <button
                          onClick={isPlaying ? pauseMusic : playMusic}
                          className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-[#c060f5] to-[#7b5aff] text-white shadow-[0_8px_20px_rgba(192,96,245,0.35)] hover:scale-110 active:scale-90 transition-all"
                        >
                          <i className={`${isPlaying ? "ri-pause-mini-fill" : "ri-play-mini-fill"} text-[22px]`}></i>
                        </button>
                        <button 
                          onClick={nextSong}
                          className="text-light-text-secondary dark:text-dark-text-secondary opacity-40 hover:opacity-100 transition-opacity hover:scale-110 active:scale-90"
                        >
                          <i className="ri-skip-forward-mini-fill text-[18px]"></i>
                        </button>
                      </div>
                      <span className="text-[0.65rem] font-medium opacity-30 tracking-widest text-light-text-secondary dark:text-dark-text-secondary">{songIndex + 1} / {DataSong.length}</span>
                    </div>
  
                    {/* Select Song Section */}
                    <div>
                      <h5 className="text-[0.60rem] font-medium uppercase tracking-[0.2em] text-light-text-secondary dark:text-dark-text-secondary opacity-40 mb-4 pl-1">Playlists</h5>
                      <div className="space-y-1.5">
                        {DataSong.map((song, idx) => (
                          <button
                            key={song.id}
                            onClick={() => {
                              changeSong(idx);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-[1rem] text-left transition-all duration-300 border ${
                              idx === songIndex 
                                ? "bg-[rgba(192,96,245,0.12)] text-[#c060f5] dark:text-[#d08eff] border-[rgba(192,96,245,0.25)] font-medium" 
                                : "text-light-text-secondary dark:text-dark-text-secondary border-transparent hover:bg-light-surface/50 dark:hover:bg-dark-surface/50 font-normal"
                            } text-[0.78rem]`}
                          >
                            <span className="truncate pr-4">{song.title}</span>
                            {idx === songIndex && <i className="ri-volume-up-fill text-[13px]"></i>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* nav links */}
        <ul
          className={`items-center flex gap-1 px-2 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 ${navLinksClass}`}
        >
          {HOME_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-3.5 py-1.5 rounded-full text-[0.75rem] font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-matte-azure/14 transition-all duration-200 block"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* theme & contact */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-black/6 dark:hover:bg-white/8 transition-all duration-200"
            aria-label="Toggle theme"
          >
            <i className="text-[15px] ri-moon-line dark:hidden"></i>
            <i className="hidden text-[15px] ri-sun-line dark:block"></i>
          </button>
          <a
            href="#contact"
            className="hidden xl:flex items-center gap-1.5 text-[0.75rem] font-medium border border-black/12 dark:border-white/12 rounded-full px-3.5 py-1.5 text-light-text dark:text-dark-text hover:border-matte-azure/40 hover:bg-matte-azure/8 transition-all duration-200"
          >
            <i className="ri-mail-send-line text-[13px]"></i>
            Contact
          </a>
        </div>
      </nav>

      {/* ======================== */}
      {/* Mobile Top Bar */}
      {/* ======================== */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-5 transition-all duration-300 ${isScrolled ? "bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-xl border-b border-light-border dark:border-dark-border shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]" : "bg-transparent"} text-light-text dark:text-dark-text`}>
        <div className="flex items-center gap-3">
          <img
            src={Assets.logo}
            alt="logo"
            className="w-9 h-9 rounded-full bg-black p-1 shadow-md border border-white/10"
          />
          <h1 className="text-[0.82rem] font-medium">Nevinas Ka</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-black/6 dark:hover:bg-white/8 transition-all duration-200"
            aria-label="Toggle theme"
          >
            <i className="text-[15px] ri-moon-line dark:hidden"></i>
            <i className="hidden text-[15px] ri-sun-line dark:block"></i>
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-black/6 dark:hover:bg-white/8 transition-all duration-200"
            onClick={openMenu}
            aria-label="Open menu"
          >
            <i className="text-[20px] ri-menu-3-line"></i>
          </button>
        </div>
      </div>

      {/* ======================== */}
      {/* Mobile Menu Drawer */}
      {/* ======================== */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 lg:hidden transition-opacity duration-400 bg-black/60 backdrop-blur-sm z-40 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      />

      {/* Side Panel */}
      <div
        id="sideMenu"
        ref={sideMenuRef}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-80 transition-transform duration-500 ease-in-out border-r border-light-border dark:border-white/10 shadow-2xl lg:hidden overflow-hidden backdrop-blur-xl ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} bg-white/70 dark:bg-transparent`}
        style={{
          background: "var(--drawer-bg, none)"
        }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          #sideMenu {
            --drawer-bg: radial-gradient(600px at 80% 100%, rgba(192,96,245,0.06), transparent), 
                         radial-gradient(500px at 0% 0%, rgba(123,90,255,0.05), transparent), 
                         linear-gradient(180deg, rgba(255,255,255,0.85), rgba(244,246,251,0.92));
          }
          .dark #sideMenu {
            --drawer-bg: radial-gradient(600px at 80% 100%, rgba(192,96,245,0.12), transparent), 
                         radial-gradient(500px at 0% 0%, rgba(123,90,255,0.08), transparent), 
                         linear-gradient(180deg, rgba(21,24,39,0.85), rgba(26,31,53,0.92));
          }
        `}} />

        <button
          onClick={closeMenu}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all hover:scale-110 active:scale-90 text-light-text-secondary dark:text-dark-text-secondary"
          aria-label="Close menu"
        >
          <i className="ri-close-line text-[24px]"></i>
        </button>

        <div className="flex flex-col p-8 gap-8 h-full overflow-y-auto custom-scrollbar">
          {/* ── Premium Music Player Card ── */}
          <div className="glass-premium rounded-[1.5rem] p-5 relative overflow-hidden">
            <div className="relative z-10">
              {/* Now Playing Label */}
              <span className="text-[0.60rem] font-medium tracking-[0.2em] text-light-text-secondary dark:text-dark-text-secondary uppercase opacity-50">Now Playing</span>
              <h4 className="mt-1.5 text-[0.82rem] font-medium text-light-text dark:text-dark-text truncate mb-4">
                {DataSong[songIndex].title.split(' - ')[0]}
              </h4>

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => setSongIndex((prev) => (prev - 1 + DataSong.length) % DataSong.length)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-light-surface/50 dark:bg-dark-surface/50 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-all hover:scale-110 active:scale-90"
                >
                  <i className="ri-skip-back-mini-fill text-[18px]"></i>
                </button>

                <button
                  onClick={isPlaying ? pauseMusic : playMusic}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#c060f5] to-[#7b5aff] text-white shadow-[0_8px_24px_rgba(192,96,245,0.35)] hover:scale-110 active:scale-90 transition-all"
                >
                  <i className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"} text-[22px]`}></i>
                </button>

                <button 
                  onClick={nextSong}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-light-surface/50 dark:bg-dark-surface/50 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-all hover:scale-110 active:scale-90"
                >
                  <i className="ri-skip-forward-mini-fill text-[18px]"></i>
                </button>
              </div>
            </div>
          </div>

          {/* ── Playlist ── */}
          <div>
            <h5 className="text-[0.60rem] font-medium tracking-[0.2em] text-light-text-secondary dark:text-dark-text-secondary uppercase mb-3 opacity-40">Playlist</h5>
            <div className="space-y-1">
              {DataSong.map((song, idx) => (
                <button
                  key={song.id}
                  onClick={() => changeSong(idx)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-[0.78rem] transition-all duration-300 ${
                    idx === songIndex 
                      ? "bg-[rgba(192,96,245,0.12)] text-[#c060f5] dark:text-[#d08eff] font-medium" 
                      : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-surface/40 dark:hover:bg-dark-surface/40 font-normal"
                  } hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <span className="truncate block">{song.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Navigation Menu ── */}
          <div className="flex flex-col">
            <h5 className="text-[0.60rem] font-medium tracking-[0.2em] text-light-text-secondary dark:text-dark-text-secondary uppercase mb-4 opacity-40">Explorer</h5>
            <nav className="flex flex-col gap-1">
              {HOME_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface/40 dark:hover:bg-dark-surface/40 transition-all duration-200 group"
                >
                  <div className="w-5 h-5 flex items-center justify-center text-[18px] opacity-60 group-hover:opacity-100 transition-all">
                    <i className={link.icon}></i>
                  </div>
                  <span className="text-[0.82rem] font-medium">{link.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Footer area */}
          <div className="mt-auto pt-5 border-t border-light-border dark:border-dark-border flex items-center justify-between">
             <div className="flex items-center gap-3">
               <img src={Assets.logo} className="w-7 h-7 rounded-full bg-black p-0.5 shadow-md" alt="logo" />
               <span className="text-[0.60rem] font-medium tracking-widest text-light-text-secondary dark:text-dark-text-secondary uppercase opacity-40">NEVINAS.DEV</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
