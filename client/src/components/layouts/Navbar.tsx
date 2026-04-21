import { useEffect, useRef, useState, useCallback } from "react";
import type { FC } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Assets, DataSong } from "@/data/HomeData";

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
    ? "bg-light-bg/50 backdrop-blur-lg shadow-sm dark:bg-dark-bg/50 dark:shadow-light-bg/20"
    : "";
  const navLinksClass = !isScrolled
    ? "bg-light-bg/50 shadow-sm dark:border dark:border-light-bg/50 dark:bg-transparent"
    : "";

  return (
    <div
      className={`w-full fixed px-5 lg:px-8 xl:px-[8%] py-3 flex items-center justify-between z-50 transition-all duration-300 ${navClass}`}
    >
      {/* logo + music */}
      <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
        <img
          src={Assets.logo}
          alt="Nevinas logo"
          className="w-12 sm:w-14 rounded-full cursor-pointer"
        />
        {/* music player */}
        <div className="hidden sm:flex items-center gap-3 song-group">
          <i className="ri-voiceprint-fill text-lg"></i>
          <div className="w-24 marquee-container song-title">
            <div
              className="marquee-track"
              ref={marqueeTrackRef}
              style={
                { "--marquee-duration": marqueeDuration } as React.CSSProperties
              }
            >
              <span className="text-sm font-medium marquee-text">
                {DataSong[songIndex].title}
              </span>
              <span
                className="text-sm font-medium marquee-text"
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
          <div className="flex items-center gap-1">
            <button
              onClick={isPlaying ? pauseMusic : playMusic}
              className="p-1.5 rounded-md hover:bg-light-bg/20 dark:hover:bg-light-bg/10 transition-colors"
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              <i
                className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"} text-lg`}
              ></i>
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-1.5 rounded-md hover:bg-light-bg/20 dark:hover:bg-light-bg/10 transition-colors"
                aria-label="Song list"
                aria-expanded={isDropdownOpen}
              >
                <i className="ri-playlist-line text-lg"></i>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-light-bg dark:bg-dark-bg shadow-lg rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
                  <div className="py-1">
                    {DataSong.map((item, index) => (
                      <button
                        key={item.id ?? item.title}
                        onClick={() => {
                          changeSong(index);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors ${index === songIndex ? "bg-global-blue/10 text-global-blue font-medium" : "hover:bg-light-surface dark:hover:bg-dark-surface"}`}
                      >
                        {index === songIndex && (
                          <i className="ri-volume-up-line text-xs"></i>
                        )}
                        <span className={index === songIndex ? "" : "pl-5"}>
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* [FIX #2] nav links - fixed shadow- typo */}
      <ul
        className={`items-center hidden lg:flex gap-4 xl:gap-6 px-6 xl:px-10 py-3 rounded-full text-sm xl:text-base whitespace-nowrap transition-all duration-300 ${navLinksClass}`}
      >
        {HOME_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="hover:text-global-blue transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      {/* theme & contact */}
      <div className="flex items-center gap-3">
        {/* [FIX #6] Theme button with aria-label */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-light-bg/20 dark:hover:bg-light-bg/10 transition-colors"
          aria-label="Toggle theme"
        >
          <i className="text-2xl ri-moon-line dark:hidden"></i>
          <i className="hidden text-2xl ri-sun-line dark:block"></i>
        </button>
        {/* [FIX #8] Contact button with hover */}
        <a
          href="#contact"
          className="hidden xl:flex items-center gap-2 px-8 py-2.5 border border-dark-border dark:border-light-bg/50 rounded-full ml-2 hover:bg-light-text hover:text-light-bg dark:hover:bg-light-bg dark:hover:text-dark-bg transition-all duration-200"
        >
          Contact
        </a>
        <button
          className="block ml-1 lg:hidden p-2 rounded-md hover:bg-light-bg/20 dark:hover:bg-light-bg/10 transition-colors"
          onClick={openMenu}
          aria-label="Open menu"
        >
          <i className="text-2xl ri-menu-3-line"></i>
        </button>
      </div>
      {/* mobile overlay */}
      <div
        className={`fixed inset-0 lg:hidden transition-opacity duration-300 bg-black/30 backdrop-blur-sm ${isMenuOpen ? "opacity-100 pointer-events-auto z-40" : "opacity-0 pointer-events-none"}`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      />
      {/* [FIX #3] mobile menu - fixed text colors */}
      <ul
        id="sideMenu"
        ref={sideMenuRef}
        className="fixed top-1.5 bottom-1.5 left-1.5 z-50 flex flex-col w-88 max-w-[calc(100vw-0.75rem)] transition-transform duration-500 ease-in-out neu-panel-dark bg-theme-surface rounded-[1.75rem] lg:hidden overflow-y-auto"
        style={{ transform: isMenuOpen ? "translateX(0)" : "translateX(-110%)" }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
      >
        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="absolute top-6 right-6 p-2 rounded-full neu-panel-dark-soft hover:bg-white/10 transition-colors z-10"
          aria-label="Close menu"
        >
          <i className="ri-close-line text-xl text-dark-text"></i>
        </button>

        <div className="flex flex-col p-8 pt-20 gap-8 h-full">
          {/* Dashboard Music Widget */}
          <div className="relative p-6 rounded-3xl neu-panel-dark-soft overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-white/8 to-transparent pointer-events-none" />

            {/* Header / Player Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSongIndex((prev) => (prev - 1 + DataSong.length) % DataSong.length)}
                  className="text-dark-text-secondary hover:text-global-blue transition-colors"
                >
                  <i className="ri-skip-back-mini-fill text-xl"></i>
                </button>
                <button
                  onClick={isPlaying ? pauseMusic : playMusic}
                  className="w-12 h-12 flex items-center justify-center rounded-full neu-btn text-global-blue dark:text-white bg-linear-to-br from-global-blue/85 to-global-purple/75 border-0 hover:scale-105 active:scale-95 transition-all"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  <i className={`${isPlaying ? "ri-pause-mini-fill" : "ri-play-mini-fill"} text-2xl`}></i>
                </button>
                <button 
                  onClick={nextSong}
                  className="text-dark-text-secondary hover:text-global-blue transition-colors"
                >
                  <i className="ri-skip-forward-mini-fill text-xl"></i>
                </button>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-dark-text-secondary opacity-60">Now Playing</p>
                <p className="text-xs font-semibold text-dark-text mt-1">{DataSong[songIndex].title.split('-')[1]?.trim() || DataSong[songIndex].title}</p>
              </div>
            </div>

            {/* Active Song Highlight */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <i className="ri-music-2-line text-sm text-light-text-secondary dark:text-dark-text-secondary"></i>
                  <span className="text-xs font-medium text-dark-text-secondary">Playlist</span>
                </div>
                <span className="text-[10px] font-medium text-dark-text-secondary">{songIndex + 1} / {DataSong.length}</span>
              </div>
              
              {/* List of songs */}
              <div className="space-y-1">
                {DataSong.map((song, idx) => (
                  <button
                    key={song.id}
                    onClick={() => changeSong(idx)}
                    className={`flex items-center justify-between w-full p-2.5 rounded-xl text-left transition-all duration-300 ${
                      idx === songIndex 
                        ? "bg-global-blue/20 text-global-blue neu-nav-link" 
                        : "hover:bg-white/10 text-dark-text-secondary neu-nav-link"
                    }`}
                  >
                    <span className="text-xs font-medium truncate pr-2">{song.title}</span>
                    {idx === songIndex && (
                      <i className="ri-volume-up-fill text-xs animate-pulse"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex flex-col grow">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark-text-secondary opacity-50 mb-6 pl-2">Menu</h5>
            
            <nav className="flex flex-col gap-2">
              {HOME_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="neu-nav-link flex items-center gap-4 px-4 py-3.5 rounded-2xl text-dark-text/80 hover:bg-white/10 hover:text-global-blue transition-all duration-300 group"
                >
                  <i className={`${link.icon} text-xl transition-transform group-hover:scale-110`}></i>
                  <span className="text-sm font-semibold tracking-wide">{link.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
