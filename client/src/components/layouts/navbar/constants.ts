// ─────────────────────────────────────────────────────────────────────────────
// Navbar shared constants — Nocturnal Atelier Design System v3.2
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Design System §5.2 — Physical Glass (theme-aware inline styles)
// Light:  white gradient + French Gray specular (rgba(184,190,215,.45))
// Dark:   midnight gradient + Cool Gray Sub specular (rgba(175,174,204,.12))
// ─────────────────────────────────────────────────────────────────────────────
export const glassStyles = {
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
export const HOME_LINKS = [
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
export const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1.00 },
  exit: { opacity: 0, y: -5, scale: 0.97 },
};
export const dropdownTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

// ─────────────────────────────────────────────────────────────────────────────
// Common icon button classes
// DS §20: hover:-translate-y-0.5, never scale()
// ─────────────────────────────────────────────────────────────────────────────
export const iconBtnCls =
  "flex items-center justify-center rounded-full text-cool " +
  "hover:text-periwinkle hover:bg-periwinkle/10 " +
  "hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200";

// ─────────────────────────────────────────────────────────────────────────────
// Play button — DS §13.1 Primary (grad-primary)
// ─────────────────────────────────────────────────────────────────────────────
export const playBtnStyle = {
  background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-haze) 100%)",
  boxShadow: "0 6px 20px rgba(70,80,120,0.35)",
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
export const getSongTitle = (raw: string) => raw.split(" - ")[0] ?? raw;
export const getSongArtist = (raw: string) =>
  raw.includes(" - ") ? raw.split(" - ").slice(1).join(" - ") : null;
