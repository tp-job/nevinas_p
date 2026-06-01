import { useState } from "react";

type Props = { style: React.CSSProperties };

const FAQ_ITEMS = [
  {
    q: "What technologies do you work with?",
    a: "React, TypeScript, TailwindCSS, Three.js, Flask, Python, and Node.js — with a focus on exceptional frontend experiences.",
  },
  {
    q: "Are you available for freelance projects?",
    a: "Yes — open to freelance work, collaborations, and full-time roles on ambitious web projects.",
  },
  {
    q: "What is your design philosophy?",
    a: "Intentional design — every pixel and interaction serves a purpose. Inspired by Japanese minimalism and precision.",
    open: true,
  },
  {
    q: "What is your development process?",
    a: "Understand the problem, prototype fast, iterate with feedback, ship production-ready code with performance and accessibility.",
  },
  {
    q: "What is 異世界 (Isekai) in your portfolio context?",
    a: "Isekai means another world — great web experiences should transport users into a world entirely their own.",
  },
  {
    q: "How do you approach performance optimization?",
    a: "60FPS targets: rAF, transforms, lazy loading, and careful Three.js tuning. This portfolio runs multiple WebGL renderers.",
  },
  {
    q: "How can we get in touch?",
    a: "Use the Contact slide or email hello@nevinas.dev — responses within 24 hours.",
  },
];

export default function FaqSlide({ style }: Props) {
  const [openIndex, setOpenIndex] = useState(2);

  return (
    <div className="slide" id="s-faq" style={style}>
      <div className="faq-meta-bar">
        {["B01 ↑", "B02 ↑", "B03 ↑", "B04 ↑"].map((label) => (
          <div key={label} className="faq-meta-cell">
            <div className="faq-meta-dot" />
            {label}
          </div>
        ))}
      </div>
      <div className="faq-hero">
        <div className="faq-hcell">
          <div className="faq-logo">FAQ</div>
        </div>
        <div className="faq-hcell faq-art">
          <div className="faq-art-ring">
            <div className="faq-art-dot" />
          </div>
        </div>
        <div className="faq-hcell">
          <div className="faq-intro-label">Most Common Questions</div>
          <div className="faq-intro-sub">
            No worries, here you can find all
            <br />
            the answers you need.
          </div>
        </div>
        <div className="faq-hcell" style={{ background: "rgba(255,255,255,.35)", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <div style={{ fontFamily: "var(--fj)", fontSize: "1.4rem", color: "rgba(20,18,16,.08)", letterSpacing: ".1em" }}>問答</div>
        </div>
      </div>
      <div className="faq-list">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={item.q}
            className={`faq-item${openIndex === i ? " open" : ""}`}
            data-hover
          >
            <div className="faq-q">
              <span className="faq-q-txt">{item.q}</span>
              <button
                type="button"
                className="faq-btn"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                +
              </button>
            </div>
            <div className="faq-a">
              <div className="faq-a-txt">{item.a}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="faq-news">
        <div className="faq-news-hero">
          <div className="faq-news-label">
            Latest
            <br />
            News<sup className="faq-news-sup">NEW</sup>
          </div>
          <div className="faq-news-btn">→</div>
        </div>
        <div className="faq-news-nav">
          <div className="faq-nav-arr">‹</div>
          <div className="faq-nav-arr">›</div>
        </div>
        <div className="faq-news-card" data-hover>
          <div className="faq-card-img">
            <div className="faq-card-badge">PROJECT · LMS</div>
          </div>
          <div className="faq-card-title">Smart Learning Hub — React &amp; Flask LMS</div>
          <div className="faq-card-meta">
            <span>Weekly</span>
            <span>May 2026</span>
          </div>
        </div>
        <div className="faq-news-card" data-hover>
          <div className="faq-card-img">
            <div className="faq-card-badge">PROJECT · 3D</div>
          </div>
          <div className="faq-card-title">3D Interactive Web — Three.js gyroscope experiences</div>
          <div className="faq-card-meta">
            <span>Weekly</span>
            <span>Apr 2026</span>
          </div>
        </div>
      </div>
      <div className="faq-bigword">
        <div className="fq-corner tl" />
        <div className="fq-corner tr" />
        <span>
          ネヴィ<span style={{ color: "#e85c2a" }}>ナス</span>
        </span>
        <div className="fq-corner bl" />
        <div className="fq-corner br" />
      </div>
    </div>
  );
}
