import { Assets } from "@/data/homeData";
import BlurReveal from "../BlurReveal";
import StatementXL from "./StatementXL";

type SlideProps = {
  style: React.CSSProperties;
  heroActive: boolean;
  statementActive: number | null;
};

export function HeroSlide({ style, heroActive }: Pick<SlideProps, "style" | "heroActive">) {
  return (
    <div
      className="slide dk"
      id="s0"
      style={{
        ...style,
        backgroundImage: `linear-gradient(to bottom,rgba(19,20,30,.75) 0%,rgba(30,32,44,.55) 45%,rgba(19,20,30,.9) 101%), url(${Assets.bgpage})`,
        backgroundSize: "cover",
        backgroundPosition: "center 38%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="s-pre">Frontend Developer — 2026</div>
      <div className="s-xl">
        <BlurReveal text="Nevinas" active={heroActive} />
        <span className="acc">©</span>
      </div>
      <div className="s-sub">
        異世界出身のフロントエンド開発者です。
        <br />
        <span style={{ opacity: 0.5 }}>
          Based in Isekai · Web Developer · UI Craftsman
        </span>
      </div>
    </div>
  );
}

export function StatementSlides({
  slideStyle,
  statementActive,
}: {
  slideStyle: (index: number) => React.CSSProperties;
  statementActive: number | null;
}) {
  const lines: { id: string; content: React.ReactNode }[] = [
    { id: "s1", content: "I design." },
    { id: "s2", content: "I develop." },
    { id: "s3", content: "I think." },
    {
      id: "s4",
      content: (
        <>
          And
          <br />
          listen<span className="acc">...</span>
        </>
      ),
    },
  ];

  return (
    <>
      {lines.map((line, i) => (
        <div key={line.id} className="slide dk" id={line.id} style={slideStyle(i + 1)}>
          <StatementXL active={statementActive === i + 1}>
            {line.content}
          </StatementXL>
        </div>
      ))}
    </>
  );
}

export function AboutSlide({ style }: Pick<SlideProps, "style">) {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "Python",
    "React",
    "TailwindCSS",
    "Three.js",
    "Flask",
    "Git",
  ];
  return (
    <div className="slide dk" id="s5" style={style}>
      <div className="ab-wrap">
        <div>
          <div className="ab-bg">
            私<br />に
          </div>
          <div className="ab-badge">Isekai — 異世界</div>
        </div>
        <div>
          <div className="ab-name">About Me</div>
          <div className="ab-jp">私について</div>
          <p className="ab-p">
            I am passionate about exploring the world of web development, with a
            focus on <strong>HTML, CSS, and JavaScript</strong> to craft visually
            appealing and interactive user interfaces.
          </p>
          <p className="ab-p">
            Studying at{" "}
            <strong>
              King Mongkut&apos;s Institute of Technology Ladkrabang
            </strong>{" "}
            — School of Industrial Education and Technology. Built{" "}
            <strong>5+ projects</strong> from LMS systems to 3D interactive web.
          </p>
          <div className="sk-row">
            {skills.map((sk) => (
              <span key={sk} className="sk" data-hover>
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type TlProps = { style: React.CSSProperties; tlLocal: number };

export function TimelineSlide({ style, tlLocal }: TlProps) {
  return (
    <div className="slide lt" id="s-tl" style={style}>
      <div className={`feat tl${tlLocal > 0.08 ? " show" : ""}`} id="tl1">
        <span className="feat-arr">→</span>
        <div className="feat-ico">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
            <circle cx="16" cy="16" r="10" stroke="#0f172a" strokeWidth="1" />
            <circle cx="16" cy="16" r="3" fill="#0f172a" />
            <line x1="16" y1="2" x2="16" y2="8" stroke="#0f172a" strokeWidth="1" />
            <line x1="16" y1="24" x2="16" y2="30" stroke="#0f172a" strokeWidth="1" />
            <line x1="2" y1="16" x2="8" y2="16" stroke="#0f172a" strokeWidth="1" />
            <line x1="24" y1="16" x2="30" y2="16" stroke="#0f172a" strokeWidth="1" />
          </svg>
        </div>
        <div className="feat-num">1</div>
        <div className="feat-title">
          I craft with
          <br />
          intention.
        </div>
        <div className="feat-lead">
          No learning curve.
          <br />
          Just a signal.
        </div>
        <div className="feat-sub">
          Frontend development with HTML, CSS, JS — building interfaces that feel
          as good as they look.
        </div>
      </div>

      <div className={`feat tr${tlLocal > 0.28 ? " show" : ""}`} id="tl2">
        <span className="feat-arr" style={{ textAlign: "right", display: "block" }}>
          →
        </span>
        <div className="feat-ico">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
            <circle cx="14" cy="14" r="12" stroke="#0f172a" strokeWidth="1" />
            <path d="M14 2 A12 12 0 0 1 14 26 Z" fill="#0f172a" />
            <circle cx="14" cy="14" r="3" fill="white" />
          </svg>
        </div>
        <div className="feat-num">2</div>
        <div className="feat-title">
          I think
          <br />
          long term.
        </div>
        <div className="feat-lead">
          Every piece stands
          <br />
          alone — or flows as one.
        </div>
        <div className="feat-sub">
          Building scalable systems and learning continuously to create products
          that redefine the future.
        </div>
      </div>

      <div className={`feat bl${tlLocal > 0.52 ? " show" : ""}`} id="tl3">
        <span className="feat-arr">→</span>
        <div className="feat-ico">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
            <rect x="2" y="2" width="6" height="6" rx="1" fill="var(--color-matte-azure)" />
            <rect x="10" y="2" width="6" height="6" rx="1" fill="#0f172a" />
            <rect x="18" y="2" width="6" height="6" rx="1" fill="#0f172a" />
            <rect x="2" y="10" width="6" height="6" rx="1" fill="#0f172a" />
            <rect x="10" y="10" width="6" height="6" rx="1" fill="var(--color-matte-azure)" />
            <rect x="18" y="10" width="6" height="6" rx="1" fill="#0f172a" />
            <rect x="2" y="18" width="6" height="6" rx="1" fill="#0f172a" />
            <rect x="10" y="18" width="6" height="6" rx="1" fill="#0f172a" />
            <rect x="18" y="18" width="6" height="6" rx="1" fill="var(--color-matte-azure)" />
          </svg>
        </div>
        <div className="feat-num">3</div>
        <div className="feat-title">
          Performance
          <br />
          Oriented.
        </div>
        <div className="feat-lead" style={{ fontSize: ".75rem", color: "var(--color-light-text-secondary)" }}>
          ~60FPS~
        </div>
        <div className="feat-sub">
          Fast as a cut. Light as breath. Low memory, zero layout shifts,
          native-friendly.
        </div>
      </div>

      <div className={`feat br${tlLocal > 0.72 ? " show" : ""}`} id="tl4">
        <span className="feat-arr" style={{ textAlign: "right", display: "block" }}>
          →
        </span>
        <div className="feat-ico">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
            <circle cx="13" cy="13" r="9" stroke="#0f172a" strokeWidth="2" />
            <circle cx="23" cy="13" r="9" stroke="var(--color-matte-azure)" strokeWidth="2" />
            <circle cx="13" cy="22" r="9" stroke="var(--color-matte-azure)" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="feat-num">4</div>
        <div className="feat-title">
          I reach
          <br />
          for more.
        </div>
        <div className="feat-lead">
          Craft only what
          <br />
          you need.
        </div>
        <div className="feat-sub">
          Becoming a developer who teaches, builds impactful systems, and pushes
          UI/UX boundaries.
        </div>
      </div>

      <div className={`tl-label${tlLocal > 0.2 ? " show" : ""}`} id="tl-label">
        WebGL · Real-time render · Gyroscope
      </div>
    </div>
  );
}

export function BentoSlide({ style }: Pick<SlideProps, "style">) {
  return (
    <div
      className="slide lt"
      id="s-bento"
      style={{
        ...style,
        padding: "4rem 1.2rem 0",
        alignItems: "stretch",
        justifyContent: "stretch",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="bento" style={{ flex: 1, minHeight: 0 }}>
        <div className="bc" style={{ position: "relative", paddingBottom: "2.2rem" }} data-hover>
          <div className="bc-scroll-label">SCROLL SMOOTHLY</div>
          <div className="nav-ico" style={{ width: 28, height: 28, boxShadow: "none", marginBottom: ".8rem" }}>
            <svg viewBox="0 0 14 14" fill="none" style={{ width: 13, height: 13 }} aria-hidden>
              <rect x="1" y="1" width="5" height="5" fill="white" />
              <rect x="7.5" y="7.5" width="5" height="5" fill="white" />
              <rect x="7.5" y="1" width="5" height="5" fill="rgba(255,255,255,.28)" />
            </svg>
          </div>
          <div className="bc-label">Performance</div>
          <div className="bc-title">Supervision</div>
        </div>
        <div className="bc" data-hover>
          <div className="bc-label">Identity</div>
          <div className="bc-title">About Nevinas</div>
          <div className="bc-jp">ネヴィナス</div>
          <div className="bc-sub" style={{ marginTop: ".3rem" }}>
            異世界 — Isekai
          </div>
        </div>
        <div className="bc">
          <div className="bc3-overlay">
            <div className="bc3-tag">Control your Progress Data</div>
            <div className="bc3-title">
              Full-Stack
              <br />
              Developer
            </div>
            <div className="bc3-sub">
              Scroll-driven experiences. Break it apart, apply to any element across the page.
            </div>
            <div className="bc3-brackets">
              <span>(</span>
              <span style={{ fontSize: ".52rem", color: "rgba(255,255,255,.4)" }}>Scroll → Explore</span>
              <span>)</span>
            </div>
          </div>
        </div>
        <div className="bc" data-hover>
          <div className="bc-label">Navigation</div>
          <div className="bc-title">
            Use Scroll.
            <br />
            Control all.
          </div>
          <div className="bc-sub" style={{ marginTop: ".5rem" }}>
            Wheel up / down drives every transition.
          </div>
        </div>
        <div className="bc" data-hover>
          <div className="bc-label">Typography</div>
          <div className="bc-title" style={{ fontSize: ".92rem" }}>
            Safe natural kerning when splitting
          </div>
          <div style={{ marginTop: ".6rem", fontSize: "2.2rem", fontWeight: 300, color: "var(--color-matte-azure)", letterSpacing: "-.03em", lineHeight: 1 }}>
            Tu
          </div>
        </div>
        <div className="bc dark" data-hover>
          <div className="bc-label">Performance</div>
          <div className="bc-title">
            Ultra
            <br />
            Optimized
          </div>
        </div>
        <div className="bc dark" style={{ background: "linear-gradient(160deg,#1a1a2e,#16213e)" }} data-hover>
          <div className="bc-label" style={{ color: "rgba(255,255,255,.35)" }}>
            Projects
          </div>
          <div className="bc-title">Smart Learning Hub</div>
        </div>
        <div className="bc" style={{ position: "relative", overflow: "hidden", padding: ".9rem 0" }}>
          <div className="bento-marquee">
            FOR &nbsp;&nbsp;&nbsp; DEVELOPERS &nbsp;&nbsp;&nbsp; & &nbsp;&nbsp;&nbsp; DESIGNERS &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; FOR &nbsp;&nbsp;&nbsp; DEVELOPERS
          </div>
        </div>
        <div className="bc" data-hover>
          <div style={{ fontSize: "1.2rem", marginBottom: ".5rem" }}>▶</div>
          <div className="cursor-tag">CURSOR CONTENT</div>
          <div className="bc-sub" style={{ marginTop: ".6rem" }}>
            Cursor Tracking of any kind
          </div>
        </div>
        <div className="bc" data-hover>
          <svg className="ease-svg" viewBox="0 0 120 80" aria-hidden>
            <path d="M10 70 C 30 70, 85 10, 110 10" stroke="var(--color-matte-azure)" strokeWidth="1.5" fill="none" />
          </svg>
          <div className="bc-sub">Progress Easing</div>
        </div>
        <div className="bc" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }} data-hover>
          <div className="bc-title" style={{ fontSize: "1rem" }}>
            Position Sticky?
          </div>
          <div className="bc-sub" style={{ marginTop: ".25rem" }}>
            Of course
          </div>
        </div>
      </div>
    </div>
  );
}
