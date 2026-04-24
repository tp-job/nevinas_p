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
  const sideMenuRef = useRef<HTMLUListElement | null>(null);
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
    setSongIndex(index);
    setIsPlaying(true);
  };
  const nextSong = () => {
    setSongIndex((prev) => (prev + 1) % DataSong.length);
    setIsPlaying(true);
  };

  // Nav classes based on scroll state
  const navClass = isScrolled
    ? "bg-theme-surface/80 backdrop-blur-lg shadow-md border-b border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary"
    : "text-light-text-primary dark:text-dark-text-primary";
    
  const navLinksClass = !isScrolled
    ? "bg-theme-surface/40 backdrop-blur-md shadow-sm border border-light-border dark:border-white/10"
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
          {/* music player */}
          <div className="hidden sm:flex items-center gap-4 group/player">
            <i className="ri-voiceprint-fill text-[20px] text-global-blue animate-pulse"></i>
            <div className="w-24 marquee-container">
              <div
                className="marquee-track"
                ref={marqueeTrackRef}
                style={
                  { "--marquee-duration": marqueeDuration } as React.CSSProperties
                }
              >
                <span className="text-[14px] font-semibold marquee-text">
                  {DataSong[songIndex].title}
                </span>
                <span
                  className="text-[14px] font-semibold marquee-text"
                  aria-hidden="true"
                >
                  {DataSong[songIndex].title}
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
            {/* controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={isPlaying ? pauseMusic : playMusic}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#1f2438] shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-4px_-4px_10px_rgba(70,80,120,0.1)] hover:scale-110 active:scale-90 transition-all text-global-blue"
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                <i
                  className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"} text-[20px]`}
                ></i>
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#1f2438] shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-4px_-4px_10px_rgba(70,80,120,0.1)] hover:scale-110 active:scale-90 transition-all text-global-blue/60 hover:text-global-blue"
                  aria-label="Change song"
                  aria-expanded={isDropdownOpen}
                >
                  <TbArrowsExchange className="text-[20px]" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full right-[-60px] mt-4 w-80 bg-theme-surface/95 backdrop-blur-2xl border border-light-border dark:border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden p-8 z-[60] animate-in fade-in zoom-in duration-300">
                    {/* Top Player Controls */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => setSongIndex((prev) => (prev - 1 + DataSong.length) % DataSong.length)}
                          className="text-light-text-secondary dark:text-dark-text-secondary opacity-40 hover:opacity-100 transition-opacity hover:scale-110 active:scale-90"
                        >
                          <i className="ri-skip-back-mini-fill text-[20px]"></i>
                        </button>
                        <button
                          onClick={isPlaying ? pauseMusic : playMusic}
                          className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-[#5983FC] to-[#964EC2] text-white shadow-[0_8px_20px_rgba(89,131,252,0.4)] hover:scale-110 active:scale-90 transition-all"
                        >
                          <i className={`${isPlaying ? "ri-pause-mini-fill" : "ri-play-mini-fill"} text-[22px]`}></i>
                        </button>
                        <button 
                          onClick={nextSong}
                          className="text-light-text-secondary dark:text-dark-text-secondary opacity-40 hover:opacity-100 transition-opacity hover:scale-110 active:scale-90"
                        >
                          <i className="ri-skip-forward-mini-fill text-[20px]"></i>
                        </button>
                      </div>
                      <span className="text-[12px] font-bold opacity-30 tracking-widest">{songIndex + 1} / {DataSong.length}</span>
                    </div>
  
                    {/* Select Song Section */}
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 mb-5 pl-1">Playlists</h5>
                      <div className="space-y-2">
                        {DataSong.map((song, idx) => (
                          <button
                            key={song.id}
                            onClick={() => {
                              changeSong(idx);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between w-full px-5 py-3.5 rounded-[1.25rem] text-left transition-all duration-300 border ${
                              idx === songIndex 
                                ? "bg-global-blue/10 text-global-blue border-global-blue/30 font-semibold" 
                                : "text-light-text-secondary dark:text-dark-text-secondary border-transparent hover:bg-light-bg/5 dark:hover:bg-white/5 font-medium"
                            } text-[13px]`}
                          >
                            <span className="truncate pr-4">{song.title}</span>
                            {idx === songIndex && <i className="ri-volume-up-fill text-[14px]"></i>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* nav links */}
        <ul
          className={`items-center flex gap-6 px-10 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${navLinksClass}`}
        >
          {HOME_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="hover:text-global-blue transition-all font-semibold text-[14px] tracking-tight hover:scale-105 active:scale-95 block"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* theme & contact */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-global-blue/10 transition-all text-light-text-primary dark:text-dark-text-primary hover:scale-110 active:scale-90 shadow-sm"
            aria-label="Toggle theme"
          >
            <i className="text-[22px] ri-moon-line dark:hidden"></i>
            <i className="hidden text-[22px] ri-sun-line dark:block"></i>
          </button>
          <a
            href="#contact"
            className="hidden xl:flex items-center gap-2 px-8 py-2.5 bg-gradient-to-br from-[#5983FC] to-[#964EC2] text-white rounded-full shadow-[0_8px_20px_rgba(89,131,252,0.3)] hover:shadow-[0_12px_25px_rgba(89,131,252,0.5)] hover:scale-105 active:scale-95 transition-all font-bold text-[14px] tracking-tight"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* ======================== */}
      {/* Mobile Top Bar */}
      {/* ======================== */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-5 transition-all duration-300 ${isScrolled ? "bg-theme-surface/80 backdrop-blur-lg border-b border-light-border dark:border-dark-border shadow-md" : "bg-transparent"} text-light-text-primary dark:text-dark-text-primary`}>
        <div className="flex items-center gap-3">
          <img
            src={Assets.logo}
            alt="logo"
            className="w-9 h-9 rounded-full bg-black p-1 shadow-md border border-white/10"
          />
          <h1 className="text-[14px] font-bold tracking-tight">Nevinas Ka</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-global-blue/10 transition-all hover:scale-110 active:scale-90"
            aria-label="Toggle theme"
          >
            <i className="text-[20px] ri-moon-line dark:hidden"></i>
            <i className="hidden text-[20px] ri-sun-line dark:block"></i>
          </button>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-global-blue/10 transition-all hover:scale-110 active:scale-90"
            onClick={openMenu}
            aria-label="Open menu"
          >
            <i className="text-[24px] ri-menu-3-line"></i>
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
            --drawer-bg: radial-gradient(600px at 80% 100%, rgba(150,78,194,0.05), transparent), 
                         radial-gradient(500px at 0% 0%, rgba(89,131,252,0.05), transparent), 
                         linear-gradient(180deg, rgba(255,255,255,0.8), rgba(244,246,251,0.9));
          }
          .dark #sideMenu {
            --drawer-bg: radial-gradient(600px at 80% 100%, rgba(150,78,194,0.15), transparent), 
                         radial-gradient(500px at 0% 0%, rgba(89,131,252,0.1), transparent), 
                         linear-gradient(180deg, rgba(21,24,39,0.7), rgba(26,31,53,0.8));
          }
        `}} />

        <button
          onClick={closeMenu}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all hover:scale-110 active:scale-90 text-light-text-secondary dark:text-white/40"
          aria-label="Close menu"
        >
          <i className="ri-close-line text-[24px]"></i>
        </button>

        <div className="flex flex-col p-8 gap-10 h-full overflow-y-auto custom-scrollbar">
          {/* PLAYER CONTROLS */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-[#1f2438] shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.6),-4px_-4px_10px_rgba(70,80,120,0.2)] hover:scale-110 active:scale-90 transition-all">
              <button 
                onClick={() => setSongIndex((prev) => (prev - 1 + DataSong.length) % DataSong.length)}
                className="text-light-text-secondary dark:text-white/60 hover:text-global-blue"
              >
                <i className="ri-skip-back-mini-fill text-[22px]"></i>
              </button>
            </div>

            <button
              onClick={isPlaying ? pauseMusic : playMusic}
              className="w-[56px] h-[56px] flex items-center justify-center rounded-full bg-gradient-to-br from-[#5983FC] to-[#964EC2] text-white shadow-[0_10px_20px_rgba(89,131,252,0.3)] hover:scale-110 active:scale-90 transition-all"
            >
              <i className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"} text-[26px]`}></i>
            </button>

            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-[#1f2438] shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.6),-4px_-4px_10px_rgba(70,80,120,0.2)] hover:scale-110 active:scale-90 transition-all">
              <button 
                onClick={nextSong}
                className="text-light-text-secondary dark:text-white/60 hover:text-global-blue"
              >
                <i className="ri-skip-forward-mini-fill text-[22px]"></i>
              </button>
            </div>
          </div>

          {/* NOW PLAYING TEXT */}
          <div className="now">
            <span className="text-[10px] font-bold tracking-[2px] text-light-text-secondary dark:text-[#7b839a] uppercase opacity-60">Now Playing</span>
            <h4 className="mt-1 text-[14px] font-semibold text-light-text-primary dark:text-white truncate">
              {DataSong[songIndex].title.split('-')[1]?.trim() || DataSong[songIndex].title}
            </h4>
          </div>

          {/* PLAYLIST */}
          <div className="playlist space-y-2">
            {DataSong.map((song, idx) => (
              <button
                key={song.id}
                onClick={() => changeSong(idx)}
                className={`w-full text-left px-5 py-3 rounded-[14px] text-[12px] transition-all duration-300 ${
                  idx === songIndex 
                    ? "bg-global-blue/10 text-global-blue dark:text-[#6ea1ff] shadow-[inset_0_0_10px_rgba(89,131,252,0.1)] font-semibold" 
                    : "text-light-text-secondary dark:text-[#aab0c2] hover:bg-light-text/5 dark:hover:bg-white/5 font-medium"
                } hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span className="truncate block">{song.title}</span>
              </button>
            ))}
          </div>

          {/* MENU */}
          <div className="flex flex-col">
            <h5 className="text-[10px] font-bold tracking-[2px] text-light-text-secondary dark:text-[#6c738a] uppercase mb-5 opacity-40">Explorer</h5>
            <nav className="flex flex-col gap-6">
              {HOME_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center gap-4 text-light-text-secondary dark:text-[#cdd2df] hover:text-global-blue dark:hover:text-white transition-all duration-200 group hover:scale-105 active:scale-95"
                >
                  <div className="w-6 h-6 flex items-center justify-center text-[22px] opacity-60 group-hover:opacity-100 transition-all">
                    <i className={link.icon}></i>
                  </div>
                  <span className="text-[14px] font-semibold tracking-tight">{link.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Footer area */}
          <div className="mt-auto pt-6 border-t border-light-border dark:border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <img src={Assets.logo} className="w-8 h-8 rounded-full bg-black p-1 shadow-md" alt="logo" />
               <span className="text-[10px] font-bold tracking-widest text-light-text-secondary dark:text-white/30 uppercase">NEVINAS.DEV</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
