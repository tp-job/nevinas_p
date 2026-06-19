// ─────────────────────────────────────────────────────────────────────────────
// Hero.tsx  ·  Nocturnal Atelier Design System v3.2
// Stack : React 19 · Framer Motion · TypeScript · Tailwind CSS
// Parallax: Motion useScroll + useTransform (scroll) · useSpring (mouse)
// Icons : react-icons/ri  ·  No emoji  ·  fontWeight max 600 (semibold)
// A11y  : prefers-reduced-motion · aria-hidden · passive listeners · useId()
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, {
    useId,
    useRef,
    useState,
    useEffect,
    useMemo,
} from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
    useReducedMotion,
    type Variants,
} from "framer-motion";
import {
    RiArrowRightUpLine,
    RiSparklingLine,
} from "react-icons/ri";

// ─────────────────────────────────────────────────────────────────────────────
// 1 · DESIGN TOKENS  (Nocturnal Atelier v3.2 — main palette for UI)
// ─────────────────────────────────────────────────────────────────────────────
const DS = {
    // Main palette
    periwinkle: "#C8CDEB",
    periwinklePale: "#E8EAF5",
    periwinkleMid: "#A8B0D9",
    cool: "#878CB4",
    coolDeep: "#5E6491",
    hazeLt: "#6B739A",
    haze: "#465078",
    midnight: "#1E233C",
    midnightDeep: "#13172B",
    charcoal: "#0A0F19",
    charcoalDeep: "#05080F",
    // Sub-palette (effects / SVG / particles only — never UI structure)
    frenchGray: "#B8BED7",
    coolSub: "#AFAECC",
    mountbatten: "#85758F",   // ★ warm bridge R>G
    ev1: "#524E68",
    ev2: "#44405A",
    // Gradients
    gradPrimary: "linear-gradient(135deg,#1E233C 0%,#465078 100%)",
    gradAccent: "linear-gradient(135deg,#C8CDEB 0%,#878CB4 55%,#465078 100%)",
    gradAurora: "linear-gradient(90deg,#C8CDEB,#85758F,#1E233C)",
    gradNebula: "linear-gradient(135deg,#B8BED7,#85758F)",
    gradVelvet: "linear-gradient(180deg,rgba(175,174,204,.30),rgba(68,64,90,.85))",
    gradWaveform: "linear-gradient(180deg,#85758F,#524E68)",
    gradGlass: "linear-gradient(135deg,rgba(184,190,215,.55),rgba(175,174,204,.22),rgba(175,174,204,0))",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 2 · ASSETS  (base64 — both landscape images embedded)
// ─────────────────────────────────────────────────────────────────────────────
import VALLEY_IMG from "@/assets/image/noubackground/valley_base64.png";
import SPHERES_IMG from "@/assets/image/noubackground/spheres_base64.png";

// ─────────────────────────────────────────────────────────────────────────────
// 3 · MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const slideIn: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4 · HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/** Cycles through words for the animated headline */
function useTypewriter(words: string[], opts = { typeMs: 80, deleteMs: 40, pauseMs: 2200 }) {
    const [displayed, setDisplayed] = useState(words[0] ?? "");
    const [wordIdx, setWordIdx] = useState(0);
    const [phase, setPhase] = useState<"type" | "pause" | "delete">("pause");
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced) { setDisplayed(words[wordIdx] ?? ""); return; }
        const word = words[wordIdx] ?? "";
        if (phase === "pause") {
            const t = setTimeout(() => setPhase("delete"), opts.pauseMs);
            return () => clearTimeout(t);
        }
        if (phase === "delete") {
            if (displayed.length === 0) {
                setWordIdx((i) => (i + 1) % words.length);
                setPhase("type");
                return;
            }
            const t = setTimeout(() => setDisplayed((s) => s.slice(0, -1)), opts.deleteMs);
            return () => clearTimeout(t);
        }
        // type
        if (displayed.length < word.length) {
            const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), opts.typeMs);
            return () => clearTimeout(t);
        }
        setPhase("pause");
    }, [displayed, phase, wordIdx, words, opts, reduced]);

    return displayed;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5 · SVG COMPONENTS  (useId() for all gradient IDs per DS rule)
// ─────────────────────────────────────────────────────────────────────────────

/** Aurora Band — 3-stop horizontal gradient bar */
function AuroraBand({ width = 320, height = 2, className = "" }: {
    width?: number; height?: number; className?: string;
}) {
    const id = useId();
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
            className={className} aria-hidden="true">
            <defs>
                <linearGradient id={`${id}-aurora`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C8CDEB" />
                    <stop offset="50%" stopColor="#85758F" />
                    <stop offset="100%" stopColor="#1E233C" />
                </linearGradient>
            </defs>
            <rect width={width} height={height} rx={height / 2}
                fill={`url(#${id}-aurora)`} opacity="0.55" />
        </svg>
    );
}

/** Waveform EQ bars — Mountbatten → EV1 (sub-palette, effects only) */
function WaveformEQ({ bars = 5 }: { bars?: number }) {
    const id = useId();
    const delays = [0, 0.08, 0.16, 0.06, 0.12];
    const heights = [10, 6, 14, 8, 12];
    return (
        <svg width={bars * 7} height={16} viewBox={`0 0 ${bars * 7} 16`} aria-hidden="true">
            <defs>
                <linearGradient id={`${id}-eq`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#85758F" />
                    <stop offset="100%" stopColor="#524E68" />
                </linearGradient>
            </defs>
            {Array.from({ length: bars }).map((_, i) => (
                <rect key={i} x={i * 7} y={8 - (heights[i] ?? 8) / 2}
                    width="3.5" height={heights[i] ?? 8} rx="1.75"
                    fill={`url(#${id}-eq)`}
                    style={{
                        animation: `waveformBounce .75s ease-in-out ${delays[i] ?? 0}s infinite alternate`,
                        transformOrigin: "bottom",
                    }} />
            ))}
        </svg>
    );
}

/** Nebula orb — French Gray → Mountbatten (sub-palette) */
function NebulaOrb({ size = 420, className = "" }: { size?: number; className?: string }) {
    const id = useId();
    return (
        <svg width={size} height={size} viewBox="0 0 200 200"
            className={className} aria-hidden="true">
            <defs>
                <radialGradient id={`${id}-orb`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#B8BED7" stopOpacity="0.35" />
                    <stop offset="45%" stopColor="#85758F" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#44405A" stopOpacity="0.00" />
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="100" fill={`url(#${id}-orb)`} />
        </svg>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6 · SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Progress bar — aurora band gradient, fixed top */
function ScrollProgressBar({ containerRef }: { containerRef?: React.RefObject<HTMLElement | null> }) {
    // Tracks the real scrolling element (HomePage's #homepage-scroll) when provided,
    // since the document/window itself never scrolls inside the slide-stack layout.
    const { scrollYProgress } = useScroll(containerRef ? { container: containerRef } : undefined);
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[200]"
            style={{ scaleX, background: DS.gradAurora }}
            aria-hidden="true"
        />
    );
}

/** Navigation bar */
function NavBar({ scrollContainerRef }: { scrollContainerRef?: React.RefObject<HTMLElement | null> }) {
    const [scrolled, setScrolled] = useState(false);
    const reduced = useReducedMotion();

    useEffect(() => {
        // Listen on the actual scrolling element when one is provided (HomePage's
        // #homepage-scroll container) — window.scrollY never changes in that layout.
        const node = scrollContainerRef?.current;
        const target: HTMLElement | Window = node ?? window;
        const getScrollPos = () => (node ? node.scrollTop : window.scrollY);
        const handler = () => setScrolled(getScrollPos() > 50);
        handler();
        target.addEventListener("scroll", handler, { passive: true });
        return () => target.removeEventListener("scroll", handler);
    }, [scrollContainerRef]);

    const navLinks = ["About", "Technology", "Services", "Support"];

    return (
        <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-7 py-4"
            style={{
                background: scrolled
                    ? "rgba(10,15,25,0.78)"
                    : "transparent",
                backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
                borderBottom: scrolled ? `1px solid rgba(200,205,235,0.08)` : "none",
                transition: reduced ? "none" : "background 0.4s ease, backdrop-filter 0.4s ease",
            }}
        >
            {/* Logo */}
            <a href="#" aria-label="Nocturnal Atelier home"
                className="flex items-center gap-2.5 group no-underline">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <path d="M2 2l7.5 9L2 20M20 2l-7.5 9L20 20"
                        stroke="#C8CDEB" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 500,
                    fontSize: "0.78rem", letterSpacing: "0.16em",
                    color: DS.periwinklePale, textTransform: "uppercase"
                }}>
                    Atelier
                </span>
            </a>

            {/* Links */}
            <ul className="hidden md:flex items-center gap-7 list-none m-0 p-0">
                {navLinks.map((link) => (
                    <li key={link}>
                        <a href="#"
                            style={{
                                fontFamily: "Inter, sans-serif", fontWeight: 400,
                                fontSize: "0.73rem", letterSpacing: "0.1em",
                                color: DS.cool, textDecoration: "none",
                                textTransform: "uppercase",
                                transition: "color 0.22s"
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = DS.periwinkle; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = DS.cool; }}>
                            {link}
                        </a>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <motion.a
                href="#"
                whileHover={{ y: -1 }}
                transition={{ duration: 0.25 }}
                className="hidden md:flex items-center gap-2 no-underline"
                style={{
                    padding: "0.45rem 1.1rem",
                    borderRadius: "2rem",
                    background: DS.gradPrimary,
                    border: "1px solid rgba(200,205,235,0.18)",
                    fontFamily: "Inter, sans-serif", fontWeight: 500,
                    fontSize: "0.73rem", letterSpacing: "0.1em",
                    color: DS.periwinklePale, textTransform: "uppercase",
                }}
            >
                Get Started
                <span style={{
                    width: "18px", height: "18px", borderRadius: "50%",
                    border: "1px solid rgba(200,205,235,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <RiArrowRightUpLine size={10} />
                </span>
            </motion.a>
        </motion.nav>
    );
}

/** "Best Video of the Month" left panel card */
function VideoOfMonth() {
    return (
        <motion.div
            variants={slideIn}
            className="flex flex-col gap-1.5"
        >
            <span style={{
                fontFamily: "Inter, sans-serif", fontWeight: 400,
                fontSize: "0.62rem", letterSpacing: "0.18em",
                color: DS.cool, textTransform: "uppercase",
            }}>
                Best Video Of The Month
            </span>
            <div style={{
                display: "flex", alignItems: "center", gap: "0.65rem",
                padding: "0.6rem 0.85rem",
                background: "rgba(30,35,60,0.45)",
                backdropFilter: "blur(14px)",
                border: `1px solid rgba(200,205,235,0.1)`,
                borderRadius: "0.875rem",
                position: "relative", overflow: "hidden",
            }}>
                {/* Glass shimmer specular — French Gray per DS */}
                <div style={{
                    position: "absolute", inset: 0, borderRadius: "inherit",
                    background: DS.gradGlass,
                    pointerEvents: "none",
                }} />

                {/* Thumbnail */}
                <div style={{
                    width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem",
                    overflow: "hidden", border: `1px solid rgba(200,205,235,0.12)`,
                    flexShrink: 0,
                }}>
                    <img src={SPHERES_IMG} alt="Exoplanet 1050 video thumbnail"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <div>
                    <p style={{
                        fontFamily: "Inter, sans-serif", fontWeight: 500,
                        fontSize: "0.8rem", color: DS.periwinklePale,
                        margin: "0 0 2px"
                    }}>
                        Exoplanet 1050
                    </p>
                    <p style={{
                        fontFamily: "Inter, sans-serif", fontWeight: 300,
                        fontSize: "0.7rem", color: DS.cool, margin: 0
                    }}>
                        FuturEyes
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

/** Slide number indicator — 01/02/03 */
function SlideIndicator({ active }: { active: number }) {
    return (
        <motion.div variants={slideIn} className="flex flex-col gap-2.5">
            {[1, 2, 3].map((n) => (
                <motion.button
                    key={n}
                    aria-label={`Go to slide ${n}`}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.22 }}
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: n === active ? "2.1rem" : "1.9rem",
                        height: n === active ? "2.1rem" : "1.9rem",
                        borderRadius: "50%",
                        background: n === active ? "rgba(200,205,235,0.12)" : "transparent",
                        border: `1px solid ${n === active ? "rgba(200,205,235,0.35)" : "rgba(200,205,235,0.12)"}`,
                        fontFamily: "Inter, sans-serif",
                        fontWeight: n === active ? 500 : 400,
                        fontSize: "0.65rem",
                        color: n === active ? DS.periwinklePale : DS.cool,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                    }}
                >
                    {String(n).padStart(2, "0")}
                </motion.button>
            ))}
        </motion.div>
    );
}

/** Glass info card — bottom row */
interface GlassCardProps {
    img: string; badge?: string; title: string;
    description: string; imgAlt: string;
}

function GlassCard({ img, badge, title, description, imgAlt }: GlassCardProps) {
    return (
        <motion.div
            variants={fadeUp}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
                position: "relative", display: "flex", alignItems: "flex-start",
                gap: "0.85rem", padding: "0.9rem 1.1rem",
                background: "rgba(19,23,43,0.60)",
                backdropFilter: "blur(20px) saturate(150%)",
                border: `1px solid rgba(200,205,235,0.1)`,
                borderRadius: "1.1rem", overflow: "hidden", cursor: "pointer",
                flex: 1,
            }}
        >
            {/* Specular — French Gray per DS (not white) */}
            <div style={{
                position: "absolute", inset: 0, borderRadius: "inherit",
                background: DS.gradGlass, pointerEvents: "none",
            }} />
            {/* Top edge shimmer */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                background: "linear-gradient(90deg,transparent,rgba(184,190,215,.35),transparent)",
                pointerEvents: "none",
            }} />

            {/* Thumbnail */}
            <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                    width: "3.25rem", height: "3.25rem", borderRadius: "0.65rem",
                    overflow: "hidden", border: `1px solid rgba(200,205,235,0.1)`,
                }}>
                    <img src={img} alt={imgAlt}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                {badge && (
                    <span style={{
                        position: "absolute", bottom: "-3px", right: "-6px",
                        padding: "0.15rem 0.45rem", borderRadius: "0.85rem",
                        background: DS.midnight,
                        border: `1px solid rgba(200,205,235,0.15)`,
                        fontFamily: "Inter, sans-serif", fontWeight: 500,
                        fontSize: "0.58rem", letterSpacing: "0.06em",
                        color: DS.periwinkle,
                    }}>
                        {badge}
                    </span>
                )}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 500,
                    fontSize: "0.82rem", color: DS.periwinklePale,
                    margin: "0 0 4px", lineHeight: 1.3
                }}>
                    {title}
                </p>
                <p style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 300,
                    fontSize: "0.72rem", color: DS.cool,
                    margin: 0, lineHeight: 1.55,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                    {description}
                </p>
            </div>

            {/* Arrow */}
            <motion.button
                aria-label={`Open ${title}`}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.22 }}
                style={{
                    flexShrink: 0, width: "1.75rem", height: "1.75rem",
                    borderRadius: "50%",
                    border: `1px solid rgba(200,205,235,0.18)`,
                    background: "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: DS.cool, cursor: "pointer", marginTop: "2px",
                }}
            >
                <RiArrowRightUpLine size={13} />
            </motion.button>
        </motion.div>
    );
}

/** Scroll caret at bottom */
function ScrollIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.55 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
            aria-hidden="true"
        >
            <span style={{
                fontFamily: "Inter, sans-serif", fontWeight: 400,
                fontSize: "0.6rem", letterSpacing: "0.2em",
                textTransform: "uppercase", color: DS.cool,
            }}>
                Scroll
            </span>
            <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    width: "1px", height: "36px",
                    background: `linear-gradient(to bottom, ${DS.cool}, transparent)`,
                }}
            />
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7 · CUSTOM CURSOR
// ─────────────────────────────────────────────────────────────────────────────
function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const ringX = useSpring(cursorX, { stiffness: 150, damping: 18 });
    const ringY = useSpring(cursorY, { stiffness: 150, damping: 18 });
    const [hovered, setHovered] = useState(false);
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced) return;
        const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
        window.addEventListener("mousemove", move, { passive: true });
        const interactables = document.querySelectorAll("a,button,[data-hover]");
        const enter = () => setHovered(true);
        const leave = () => setHovered(false);
        interactables.forEach((el) => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });
        return () => {
            window.removeEventListener("mousemove", move);
            interactables.forEach((el) => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
        };
    }, [cursorX, cursorY, reduced]);

    if (reduced) return null;

    return (
        <>
            {/* Dot — #C8CDEB per DS */}
            <motion.div
                aria-hidden="true"
                className="fixed pointer-events-none z-[9999] rounded-full"
                style={{
                    width: 7, height: 7, x: cursorX, y: cursorY,
                    translateX: "-50%", translateY: "-50%",
                    backgroundColor: DS.periwinkle,
                    scale: hovered ? 1.6 : 1,
                    transition: "scale 0.2s ease"
                }}
            />
            {/* Ring — rgba(200,205,235,.35) per DS */}
            <motion.div
                aria-hidden="true"
                className="fixed pointer-events-none z-[9998] rounded-full"
                style={{
                    width: hovered ? 44 : 34, height: hovered ? 44 : 34,
                    x: ringX, y: ringY,
                    translateX: "-50%", translateY: "-50%",
                    border: `1.5px solid rgba(200,205,235,${hovered ? ".5" : ".35"})`,
                    transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s ease"
                }}
            />
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8 · GLOBAL STYLES  (keyframes injected once — grain + EQ + cursor)
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes waveformBounce {
    from { transform: scaleY(1); }
    to   { transform: scaleY(0.25); }
  }
  @keyframes orbDrift {
    0%,100% { transform: translate(0px, 0px) scale(1); }
    50%      { transform: translate(12px,-14px) scale(1.04); }
  }
  .custom-cursor-wrap * { cursor: none !important; }
  @media (prefers-reduced-motion: reduce) {
    .parallax-layer, [data-depth], .orb-drift {
      animation: none !important;
      transform: none !important;
      transition: none !important;
    }
  }
`;

function GlobalStyles() {
    return <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9 · MAIN HERO COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface HeroProps {
    /**
     * Ref to the element that actually scrolls (e.g. HomePage's #homepage-scroll
     * container). When the page itself doesn't scroll the window — as in the
     * HomePage slide-stack layout — Framer Motion's useScroll() must target this
     * element directly or all scroll-linked motion (parallax, progress bar,
     * navbar background) stays frozen at its initial value.
     */
    scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export const Hero: React.FC<HeroProps> = ({ scrollContainerRef }) => {
    const reduced = useReducedMotion();
    const heroRef = useRef<HTMLDivElement>(null);

    // ── Scroll parallax (Framer Motion useScroll + useTransform) ───────────────
    const { scrollY } = useScroll(scrollContainerRef ? { container: scrollContainerRef } : undefined);
    const bgParallax = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 180]);   // Layer 1 — 0.3x
    const imgParallax = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 90]);   // Layer 2 — 0.15x

    // ── Mouse parallax (spring-smoothed) ──────────────────────────────────────
    const mouseRawX = useMotionValue(0);
    const mouseRawY = useMotionValue(0);
    const mouseX = useSpring(mouseRawX, { stiffness: 60, damping: 22 });
    const mouseY = useSpring(mouseRawY, { stiffness: 60, damping: 22 });

    const rotateXVal = useTransform(mouseY, (v) => v * -0.18);
    const rotateYVal = useTransform(mouseX, (v) => v * 0.14);
    const mouseXVal = useTransform(mouseX, (v) => v * -0.55);

    useEffect(() => {
        if (reduced) return;
        const el = heroRef.current;
        if (!el) return;
        const handler = (e: MouseEvent) => {
            const { left, top, width, height } = el.getBoundingClientRect();
            mouseRawX.set(((e.clientX - left - width / 2) / width) * 24);
            mouseRawY.set(((e.clientY - top - height / 2) / height) * 16);
        };
        el.addEventListener("mousemove", handler, { passive: true });
        return () => el.removeEventListener("mousemove", handler);
    }, [reduced, mouseRawX, mouseRawY]);

    // ── Slide indicator auto-advance ───────────────────────────────────────────
    const [activeSlide, setActiveSlide] = useState(1);
    useEffect(() => {
        const t = setInterval(() => setActiveSlide((p) => (p === 3 ? 1 : p + 1)), 3200);
        return () => clearInterval(t);
    }, []);

    // ── Typewriter words (headline second word cycles) ────────────────────────
    const cycleWord = useTypewriter(
        ["Differently", "Immersively", "Atmospherically", "Intentionally"],
        { typeMs: 75, deleteMs: 38, pauseMs: 2400 }
    );

    // ── Grain noise SVG (memoised) ────────────────────────────────────────────
    const grainUrl = useMemo(() => {
        return `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;
    }, []);

    return (
        <div className="custom-cursor-wrap" style={{ fontFamily: "Inter, sans-serif" }}>
            <GlobalStyles />

            {/* Custom cursor */}
            <CustomCursor />

            {/* Scroll progress bar */}
            <ScrollProgressBar containerRef={scrollContainerRef} />

            {/* Navigation */}
            <NavBar scrollContainerRef={scrollContainerRef} />

            {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════════ */}
            <section
                ref={heroRef}
                style={{
                    position: "relative",
                    minHeight: "100svh",
                    background: DS.charcoal,
                    overflow: "hidden",
                }}
                aria-label="Hero — Nocturnal Atelier"
            >

                {/* ── Layer 0: Grain texture (atmospheric, on-palette) ──────────── */}
                <div
                    aria-hidden="true"
                    role="presentation"
                    style={{
                        position: "absolute", inset: 0, zIndex: 0,
                        backgroundImage: grainUrl,
                        backgroundSize: "200px",
                        opacity: 0.55, pointerEvents: "none",
                    }}
                />

                {/* ── Layer 1: Parallax background image (0.3x speed) ──────────── */}
                <motion.div
                    aria-hidden="true"
                    role="presentation"
                    className="parallax-layer"
                    style={{
                        position: "absolute",
                        inset: "-15% 0",
                        width: "100%", height: "130%",
                        backgroundImage: `url(${VALLEY_IMG})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        willChange: "transform",
                        y: bgParallax,
                        zIndex: 1,
                    }}
                >
                    {/* Deep overlay — darkens bg per DS dark surface */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: `linear-gradient(to bottom,
              rgba(10,15,25,0.72) 0%,
              rgba(19,23,43,0.45) 35%,
              rgba(30,35,60,0.30) 55%,
              rgba(10,15,25,0.88) 100%)`,
                    }} />
                </motion.div>

                {/* ── Layer 2: Nebula orbs — mouse-parallax (sub-palette effects) ── */}
                <motion.div aria-hidden="true" role="presentation"
                    style={{
                        position: "absolute", top: "-8%", left: "-8%",
                        zIndex: 2, pointerEvents: "none", willChange: "transform",
                        x: useTransform(mouseX, (v) => v * 0.45),
                        y: useTransform(mouseY, (v) => v * 0.45),
                    }}>
                    <NebulaOrb size={520} />
                </motion.div>

                <motion.div aria-hidden="true" role="presentation"
                    style={{
                        position: "absolute", bottom: "10%", right: "-5%",
                        zIndex: 2, pointerEvents: "none", willChange: "transform",
                        x: useTransform(mouseX, (v) => v * -0.3),
                        y: useTransform(mouseY, (v) => v * -0.3),
                    }}>
                    <NebulaOrb size={380} />
                </motion.div>

                {/* ── Dot grid decoration ───────────────────────────────────────── */}
                <div aria-hidden="true" role="presentation"
                    style={{
                        position: "absolute", top: "22%", right: "6%",
                        display: "flex", flexDirection: "column", gap: "6px",
                        zIndex: 3, pointerEvents: "none",
                    }}>
                    {[0, 1, 2, 3].map(row => (
                        <div key={row} style={{ display: "flex", gap: "6px" }}>
                            {[0, 1, 2, 3].map(col => (
                                <div key={col} style={{
                                    width: "3px", height: "3px", borderRadius: "50%",
                                    background: `rgba(200,205,235,${0.12 - (row + col) * 0.008})`,
                                }} />
                            ))}
                        </div>
                    ))}
                </div>

                {/* ══════════════════════════════════════════════════════════════
            CONTENT  (Layer 4 — natural scroll, z-index 10+)
        ══════════════════════════════════════════════════════════════ */}
                <div style={{ position: "relative", zIndex: 10, paddingTop: "5.5rem" }}>

                    {/* ── Sub-headline row ────────────────────────────────────── */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="flex flex-col md:flex-row items-start md:justify-between gap-4 px-7 mb-1"
                    >
                        {/* Left: eyebrow copy */}
                        <motion.div variants={fadeUp}
                            style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <p style={{
                                    fontFamily: "Inter, sans-serif", fontWeight: 400,
                                    fontSize: "0.875rem", color: DS.periwinklePale, margin: 0,
                                }}>
                                    Create Videos With{" "}
                                    <span style={{ color: DS.periwinkle, fontWeight: 500 }}>Ai</span>
                                </p>
                                <WaveformEQ bars={5} />
                            </div>
                            <p style={{
                                fontFamily: "Inter, sans-serif", fontWeight: 300,
                                fontSize: "0.65rem", letterSpacing: "0.07em",
                                color: DS.cool, textTransform: "uppercase",
                                margin: 0, maxWidth: "240px", lineHeight: 1.6,
                            }}>
                                Innovative solutions &amp; designs that push the boundaries of the ordinary
                            </p>
                        </motion.div>

                        {/* Right: aurora band + pill indicator */}
                        <motion.div variants={fadeUp}
                            style={{
                                display: "flex", flexDirection: "column",
                                alignItems: "flex-end", gap: "0.5rem"
                            }}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: "0.5rem",
                                padding: "0.35rem 0.85rem",
                                background: DS.gradPrimary,
                                border: `1px solid rgba(200,205,235,0.15)`,
                                borderRadius: "2rem",
                            }}>
                                <RiSparklingLine size={12} color={DS.cool} aria-hidden="true" />
                                <span style={{
                                    fontFamily: "Inter, sans-serif", fontWeight: 500,
                                    fontSize: "0.65rem", letterSpacing: "0.1em",
                                    color: DS.periwinklePale, textTransform: "uppercase",
                                }}>
                                    AI-Powered Studio
                                </span>
                            </div>
                            <AuroraBand width={200} height={2} />
                        </motion.div>
                    </motion.div>

                    {/* ── MEGA HEADLINE ───────────────────────────────────────── */}
                    {/* Single h1 with a static aria-label: the typewriter cycles "Create"
                        between two visually separate nodes, which otherwise leaves the
                        word being typed/deleted entirely outside the accessible heading. */}
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        aria-label={`Create ${cycleWord || "Differently"}`}
                        style={{ padding: "0 1.25rem", lineHeight: 0.9, margin: 0 }}
                    >
                        <motion.span
                            aria-hidden="true"
                            variants={fadeUp}
                            style={{
                                display: "block",
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 600,      // DS max: font-semibold (600)
                                fontSize: "clamp(3.8rem, 10.5vw, 9.5rem)",
                                letterSpacing: "-0.03em",
                                lineHeight: 0.92,
                                background: DS.gradAccent,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Create
                        </motion.span>

                        {/* Second line — typewriter word */}
                        <motion.div variants={fadeUp} aria-hidden="true"
                            style={{ display: "flex", alignItems: "baseline", gap: "0.04em" }}>
                            <span style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 600,
                                fontSize: "clamp(3.8rem, 10.5vw, 9.5rem)",
                                letterSpacing: "-0.03em",
                                lineHeight: 0.92,
                                color: DS.periwinklePale,
                            }}>
                                {cycleWord}
                            </span>
                            {/* Cursor blink */}
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.7, repeat: Infinity, ease: "steps(1)" }}
                                style={{
                                    display: "inline-block", width: "3px",
                                    height: "clamp(3rem,8vw,7.5rem)",
                                    background: DS.cool, borderRadius: "2px",
                                    verticalAlign: "baseline", marginLeft: "4px",
                                }}
                                aria-hidden="true"
                            />
                        </motion.div>
                    </motion.h1>

                    {/* ── THREE-COLUMN VISUAL ROW ──────────────────────────────── */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="grid grid-cols-1 lg:grid-cols-[minmax(0,180px)_1fr_minmax(0,60px)] items-end gap-4 px-7 mt-[-2.5rem]"
                    >
                        {/* LEFT — Video of Month */}
                        <div className="hidden lg:block pb-8">
                            <VideoOfMonth />
                        </div>

                        {/* CENTER — Hero image card (Layer 3 — 0.15x scroll, mouse parallax) */}
                        <motion.div
                            variants={fadeUp}
                            style={{
                                position: "relative", display: "flex",
                                justifyContent: "center", alignItems: "flex-end"
                            }}
                        >
                            {/* Glow behind image — sub-palette (Mountbatten) */}
                            <div aria-hidden="true" style={{
                                position: "absolute", bottom: "-20px",
                                left: "50%", transform: "translateX(-50%)",
                                width: "75%", height: "60px",
                                background: "rgba(133,117,143,0.22)",
                                filter: "blur(32px)", borderRadius: "50%",
                                pointerEvents: "none",
                            }} />

                            {/* Image container — parallax + mouse */}
                            <motion.div
                                style={{
                                    position: "relative",
                                    width: "100%", maxWidth: "640px",
                                    borderRadius: "1.25rem",
                                    overflow: "hidden",
                                    border: `1px solid rgba(200,205,235,0.12)`,
                                    willChange: "transform",
                                    y: imgParallax,
                                    x: mouseXVal,
                                    rotateX: reduced ? 0 : rotateXVal,
                                    rotateY: reduced ? 0 : rotateYVal,
                                    boxShadow: "0 40px 100px rgba(10,15,25,0.7), 0 0 0 1px rgba(200,205,235,0.06)",
                                }}
                            >
                                <img
                                    src={VALLEY_IMG}
                                    alt="Mountain valley at dusk — hero visual"
                                    fetchPriority="high"
                                    decoding="async"
                                    style={{
                                        width: "100%", display: "block",
                                        aspectRatio: "16/9", objectFit: "cover",
                                    }}
                                />
                                {/* Image overlays */}
                                <div style={{
                                    position: "absolute", inset: 0,
                                    background: "linear-gradient(to top,rgba(10,15,25,.55) 0%,transparent 55%)",
                                }} />
                                <div style={{
                                    position: "absolute", inset: 0,
                                    background: "linear-gradient(to right,rgba(10,15,25,.22) 0%,transparent 30%,transparent 70%,rgba(10,15,25,.22) 100%)",
                                }} />

                                {/* Aurora line at top edge */}
                                {/* <AuroraBand
                                    width={640} height={2}
                                    className="absolute top-0 left-0 right-0"
                                /> */}

                                {/* Play button */}
                                {/* <motion.button
                                    aria-label="Play demo video"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.25 }}
                                    style={{
                                        position: "absolute", inset: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        background: "transparent", border: "none", cursor: "pointer",
                                    }}
                                >
                                    <motion.div
                                        whileHover={{ y: -1 }}
                                        transition={{ duration: 0.25 }}
                                        style={{
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            width: "3.5rem", height: "3.5rem", borderRadius: "50%",
                                            background: "rgba(10,15,25,0.55)",
                                            backdropFilter: "blur(14px)",
                                            border: `1px solid rgba(200,205,235,0.22)`,
                                            color: DS.periwinklePale,
                                            boxShadow: "0 8px 32px rgba(10,15,25,0.45)",
                                        }}
                                    >
                                        <RiPlayFill size={22} aria-hidden="true" />
                                    </motion.div>
                                </motion.button> */}

                                {/* Bottom caption badge */}
                                <div style={{
                                    position: "absolute", bottom: "0.85rem", left: "0.85rem",
                                    display: "flex", alignItems: "center", gap: "0.5rem",
                                    padding: "0.35rem 0.75rem",
                                    background: "rgba(10,15,25,0.65)",
                                    backdropFilter: "blur(12px)",
                                    border: `1px solid rgba(200,205,235,0.1)`,
                                    borderRadius: "2rem",
                                }}>
                                    <div style={{
                                        width: "6px", height: "6px", borderRadius: "50%",
                                        background: "#2E7D32",
                                        boxShadow: "0 0 6px #2E7D32",
                                    }} />
                                    <span style={{
                                        fontFamily: "Inter, sans-serif", fontWeight: 400,
                                        fontSize: "0.62rem", letterSpacing: "0.08em",
                                        color: DS.periwinklePale, textTransform: "uppercase",
                                    }}>
                                        Live Preview
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* RIGHT — Slide indicator */}
                        <div className="hidden lg:flex flex-col justify-end pb-10">
                            <SlideIndicator active={activeSlide} />
                        </div>
                    </motion.div>

                    {/* ── GLASS INFO CARDS ROW ───────────────────────────────── */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="flex flex-col md:flex-row gap-3 px-7 pt-3.5 max-w-[720px] lg:ml-[clamp(0px,12vw,180px)]"
                    >
                        <GlassCard
                            img={VALLEY_IMG}
                            badge="+26"
                            imgAlt="Valley gallery thumbnail"
                            title="Get Inspired"
                            description="Start creating by exploring our curated example gallery of atmospheric landscapes."
                        />
                        <GlassCard
                            img={SPHERES_IMG}
                            imgAlt="Sphere field thumbnail"
                            title="Try These Out"
                            description="Experiment with the latest generative AI tools and let us know what you think."
                        />
                    </motion.div>

                    {/* ── Bottom spacer + scroll indicator ─────────────────── */}
                    <div style={{ height: "4.5rem", position: "relative" }}>
                        <ScrollIndicator />
                    </div>
                </div>

                {/* ── Bottom edge fade ───────────────────────────────────────── */}
                <div aria-hidden="true" role="presentation"
                    style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        height: "120px", pointerEvents: "none", zIndex: 15,
                        background: `linear-gradient(to bottom, transparent, ${DS.charcoal})`,
                    }}
                />
            </section>
        </div>
    );
};

export default Hero;