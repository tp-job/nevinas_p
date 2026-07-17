import { useCallback, useRef, useState } from "react";
import { DataSong } from "@/data/homeData";
import { getSongArtist, getSongTitle } from "./constants";

// ─────────────────────────────────────────────────────────────────────────────
// Music player state + controls shared by the desktop pill, playlist dropdown
// and mobile drawer. The <audio> element itself stays in Navbar and receives
// `audioRef` from here.
// ─────────────────────────────────────────────────────────────────────────────
export function useMusicPlayer() {
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const currentTitle = getSongTitle(DataSong[songIndex].title);
  const currentArtist = getSongArtist(DataSong[songIndex].title);

  return {
    songIndex,
    isPlaying,
    setIsPlaying,
    audioRef,
    playMusic,
    pauseMusic,
    changeSong,
    nextSong,
    prevSong,
    currentTitle,
    currentArtist,
  };
}

export type MusicPlayer = ReturnType<typeof useMusicPlayer>;
