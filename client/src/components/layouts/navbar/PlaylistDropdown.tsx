import type { CSSProperties, FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DataSong } from "@/data/homeData";
import SectionLabel from "./SectionLabel";
import {
  dropdownTransition,
  dropdownVariants,
  playBtnStyle,
} from "./constants";
import type { MusicPlayer } from "./useMusicPlayer";

interface PlaylistDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  glass: CSSProperties;
  player: MusicPlayer;
}

// ─────────────────────────────────────────────────────────────────────────────
// Playlist Dropdown — DS §5.2 glass + §17 animation
// ─────────────────────────────────────────────────────────────────────────────
const PlaylistDropdown: FC<PlaylistDropdownProps> = ({
  isOpen,
  onClose,
  isDark,
  glass,
  player,
}) => {
  const {
    songIndex, isPlaying, playMusic, pauseMusic,
    changeSong, nextSong, prevSong, currentTitle, currentArtist,
  } = player;

  return (
    <AnimatePresence>
      {isOpen && (
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
                    onClose();
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
  );
};

export default PlaylistDropdown;
