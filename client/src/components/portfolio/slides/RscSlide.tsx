import { useState } from "react";

type Props = { style: React.CSSProperties };

type TabId = "projects" | "blogs" | "github" | "contact";

const TABS: { id: TabId; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "blogs", label: "Blogs" },
  { id: "github", label: "GitHub" },
  { id: "contact", label: "Contact" },
];

export default function RscSlide({ style }: Props) {
  const [tab, setTab] = useState<TabId>("projects");

  return (
    <div className="slide" id="s-rsc" style={style}>
      <div className="rsc-topnav">
        <div className="rsc-brand">RSC</div>
        <div className="rsc-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`rsc-tab${tab === t.id ? " active" : ""}`}
              data-hover
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="rsc-brand" style={{ textAlign: "right", fontSize: ".55rem", color: "rgba(20,18,16,.3)" }}>
          ポートフォリオ
        </div>
      </div>
      <div className="rsc-body">
        <div className="rsc-left" id="rscLeft">
          <div className="rsc-sec-lbl">PORTFOLIO OVERVIEW</div>
          <div className="rsc-sub-lbl">DEVELOPER</div>
          <div className="rsc-sidebar-p">
            Frontend developer from Isekai (異世界). Scroll-driven, Three.js-powered experiences with React &amp; TypeScript.
          </div>
          <div className="rsc-sub-lbl" style={{ marginTop: "1.4rem" }}>
            QUICK STATS
          </div>
          <div className="rsc-stat-row">
            <span className="rsc-stat-k">Projects</span>
            <span className="rsc-stat-v">9</span>
          </div>
          <div className="rsc-stat-row">
            <span className="rsc-stat-k">Blog Posts</span>
            <span className="rsc-stat-v">6</span>
          </div>
        </div>
        <div className="rsc-center" id="rscCenter">
          {tab === "projects" && (
            <div className="rsc-panel active" id="rsc-tab-projects">
              <div className="rsc-topic-lbl">TOPIC</div>
              <div className="rsc-topic-title">
                Portfolio
                <br />
                Projects
              </div>
              <div className="rsc-topic-desc">
                Fullstack and frontend projects with React, TypeScript, Three.js, and Flask.
              </div>
              <div className="rsc-proj-list">
                <div className="rsc-proj-item" data-hover>
                  <div className="rsc-proj-head">
                    <span className="rsc-proj-name">nevinas_ka_i</span>
                    <span className="rsc-proj-status inprogress">in-progress</span>
                  </div>
                  <div className="rsc-proj-desc">
                    MERN portfolio — analytics, gallery, blog, scroll-driven UI.
                  </div>
                  <div className="rsc-proj-links">
                    <a href="https://github.com/tp-job/nevinas_ka_i" className="rsc-link" target="_blank" rel="noreferrer">
                      GitHub ↗
                    </a>
                  </div>
                </div>
                <div className="rsc-proj-item" data-hover>
                  <div className="rsc-proj-head">
                    <span className="rsc-proj-name">ComTech-Prep</span>
                    <span className="rsc-proj-status inprogress">in-progress</span>
                  </div>
                  <div className="rsc-proj-desc">CS learning platform — Pyodide, Monaco, ReactFlow.</div>
                </div>
              </div>
            </div>
          )}
          {tab === "blogs" && (
            <div className="rsc-panel active" id="rsc-tab-blogs">
              <div className="rsc-topic-title">Blog Posts</div>
              <div className="rsc-blog-list">
                <div className="rsc-blog-item" data-hover>
                  <div className="rsc-blog-cat">Engineering</div>
                  <div className="rsc-blog-title">The Future of React: Server Components Explained</div>
                </div>
                <div className="rsc-blog-item" data-hover>
                  <div className="rsc-blog-cat">Tutorial</div>
                  <div className="rsc-blog-title">Running Python in the Browser with Pyodide</div>
                </div>
              </div>
            </div>
          )}
          {tab === "github" && (
            <div className="rsc-panel active" id="rsc-tab-github">
              <div className="rsc-topic-title">
                GitHub
                <br />
                Activity
              </div>
              <a href="https://github.com/tp-job" className="rsc-link" target="_blank" rel="noreferrer">
                github.com/tp-job ↗
              </a>
            </div>
          )}
          {tab === "contact" && (
            <div className="rsc-panel active" id="rsc-tab-contact">
              <div className="rsc-topic-title">
                Get in
                <br />
                Touch
              </div>
              <div className="rsc-contact-grid">
                <div className="rsc-contact-item">
                  <div className="rsc-data-lbl">EMAIL</div>
                  <a href="mailto:hello@nevinas.dev" className="rsc-link">
                    hello@nevinas.dev ↗
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="rsc-right">
          <svg className="rsc-svg" viewBox="0 0 260 560" fill="none" aria-hidden>
            <rect x="90" y="10" width="80" height="340" rx="40" stroke="rgba(20,18,16,.18)" strokeWidth="1" />
            <circle cx="130" cy="230" r="18" stroke="rgba(20,18,16,.12)" strokeWidth=".8" />
            <text x="15" y="520" fill="rgba(20,18,16,.12)" fontFamily="monospace" fontSize="8">
              NEVINAS · ISEKAI UNIT
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
