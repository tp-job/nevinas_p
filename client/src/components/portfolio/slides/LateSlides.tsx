import { SLIDE_INDEX } from "../portfolioConfig";

type Props = {
  style: React.CSSProperties;
  onGotoContact: () => void;
};

export function ClaritySlide({ style }: Pick<Props, "style">) {
  const cols = [
    { n: "(1)", text: <>Uses <span className="cl-acc">native scroll</span>, refined by a precision smoothing formula that keeps every frame deliberate.</> },
    { n: "(2)", text: "Designed with a lightweight, modular architecture that lets you import only what you need." },
    { n: "(3)", text: "Configure behavior directly in your markup — no extra JavaScript required. Until you really need it." },
    { n: "(4)", text: "Built for core web animation, yet open to any prop or pattern your setup requires." },
  ];

  return (
    <div className="slide" id="s-clarity" style={style}>
      <div className="cl-top-inner">
        <div className="cl-top-row">
          <div className="cl-headline">
            Code<br />With<br />Clarity
          </div>
          <div className="cl-tagline-wrap">
            <div className="cl-tagline">
              Built to tune your experience,
              <br />
              not fight your DOM.
              <br />
              <br />
              ネヴィナス — Isekai 2026
            </div>
          </div>
        </div>
        <div className="cl-word">Native</div>
      </div>
      <div className="cl-cols">
        {cols.map((c) => (
          <div key={c.n} className="cl-col" data-hover>
            <div className="cl-num">{c.n}</div>
            <div className="cl-col-txt">{c.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AgencySlide({ style, onGotoContact }: Props) {
  const kanji = [
    { ch: "異", top: "22%", left: "12%", delay: "0s" },
    { ch: "世", top: "30%", left: "50%", delay: ".9s" },
    { ch: "界", top: "55%", left: "28%", delay: "1.8s" },
    { ch: "者", top: "20%", left: "78%", delay: "2.7s" },
    { ch: "夢", top: "62%", left: "68%", delay: "3.6s", small: true },
  ];

  const awards = [
    { title: <>Best Frontend Experience<br />of the Year</>, year: "2026", src: "AWWWARDS", logo: "W." },
    { title: <>&apos;Developer of the Year&apos;<br />Nominee</>, year: "2025", src: "CSS DESIGN AWARDS", logo: "◈" },
    { title: <>&apos;Studio of the Year&apos;<br />Nominee</>, year: "2025", src: "THE WEBBY AWARDS", logo: "彡", jp: true },
  ];

  return (
    <div className="slide" id="s-agency" style={style}>
      <div className="ag-top">
        <div className="ag-arrow">
          <svg viewBox="0 0 200 200" fill="none" aria-hidden>
            <path d="M20 20 L180 20 L180 180" stroke="var(--color-light-text-primary)" strokeWidth="26" strokeLinecap="square" />
            <path d="M20 20 L180 180" stroke="var(--color-light-text-primary)" strokeWidth="26" strokeLinecap="square" />
          </svg>
          <div className="ag-arrow-kanji">道楽者</div>
        </div>
        <div className="ag-hero-img">
          <div className="ag-kanji-overlay">
            {kanji.map((k) => (
              <span
                key={k.ch}
                className="ag-kj"
                style={{
                  top: k.top,
                  left: k.left,
                  animationDelay: k.delay,
                  fontSize: k.small ? "1.2rem" : undefined,
                }}
              >
                {k.ch}
              </span>
            ))}
          </div>
          <div className="ag-badge">HUMAN-FIRST ✦</div>
        </div>
      </div>
      <div className="ag-desc">
        <div className="ag-desc-item">
          Frontend-Led Engineering Portfolio
          <br />— Operating from <span className="hl">異世界</span> (Isekai).
        </div>
        <div className="ag-desc-item">
          Place where well-crafted web
          <br />
          experiences are born.
        </div>
        <div className="ag-desc-item">
          Building end-to-end web systems
          <br />
          where code meets culture.
        </div>
      </div>
      <div className="ag-year">©2024–2026</div>
      <div className="ag-statement">
        <div className="ag-statement-left">
          <div className="ag-statement-txt">
            A <span className="ag-fun-tag">fun<sup className="ag-sup-num">(5+)</sup></span> frontend developer committed to exceptional design and the highest development standards.
            <span className="ag-down-arr">↓</span>
          </div>
          <button type="button" className="ag-cta" data-hover onClick={onGotoContact}>
            Get in touch <span className="ag-cta-arr">→</span>
          </button>
        </div>
        <div className="ag-statement-right">
          <div className="ag-mood-ring" />
          <div className="ag-mood-label">異世界 / ISEKAI</div>
        </div>
      </div>
      <div className="ag-awards">
        {awards.map((a) => (
          <div key={a.src} className="ag-award" data-hover>
            <div>
              <div className="ag-award-title">{a.title}</div>
              <div className="ag-award-year">{a.year}</div>
            </div>
            <div className="ag-award-src">{a.src}</div>
            <div className="ag-award-logo" style={a.jp ? { fontFamily: "var(--fj)", fontWeight: 200 } : undefined}>
              {a.logo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactSlide({ style }: Pick<Props, "style">) {
  const copyEmail = () => {
    void navigator.clipboard.writeText("hello@nevinas.dev");
  };

  const alts = [
    { name: "hello@nevinas.dev", action: "COPY", onClick: copyEmail },
    { name: "GitHub", action: "VISIT ↗", href: "https://github.com/tp-job" },
    { name: "LinkedIn", action: "VISIT ↗", href: "#" },
    { name: "Resume PDF", action: "DOWNLOAD ↓", href: "#" },
    { name: "Twitter / X", action: "FOLLOW ↗", href: "#" },
  ];

  return (
    <div className="slide dk" id="s-contact" style={style}>
      <div className="ct-left">
        <div className="ct-heading">
          Nocturnal
          <br />
          Contact<span className="ct-dot" />
        </div>
        <div className="ct-jp-label">お問い合わせ</div>
        <form className="ct-form-fiddle" onSubmit={(e) => e.preventDefault()}>
          <div className="ct-field">
            <div className="ct-field-lbl">Name</div>
            <input type="text" placeholder="Your autograph, please" autoComplete="off" />
          </div>
          <div className="ct-field">
            <div className="ct-field-lbl">Email</div>
            <span className="ct-field-at">@</span>
            <input type="email" placeholder="your@email.com" autoComplete="off" style={{ paddingLeft: ".3rem" }} />
          </div>
          <div className="ct-field" style={{ alignItems: "start" }}>
            <div className="ct-field-lbl" style={{ paddingTop: "1.2rem" }}>
              Project
            </div>
            <textarea placeholder="Your project idea..." />
          </div>
          <div className="ct-field">
            <div className="ct-field-lbl">Deadline</div>
            <input type="text" placeholder="Your deadline" autoComplete="off" />
          </div>
          <div className="ct-actions">
            <div className="ct-required-note">
              Following fields need to be filled in:
              <br />
              <span>Name, Email, Project idea, Deadline.</span>
            </div>
            <button type="button" className="ct-submit-btn" data-hover>
              Submit Now →
            </button>
          </div>
        </form>
      </div>
      <div className="ct-right">
        <div className="ct-right-pre">— Connect with Nevinas</div>
        <div className="ct-alt-section">
          <div className="ct-alt-label">Alternatives</div>
          {alts.map((row) => (
            <div
              key={row.name}
              className="ct-alt-row"
              data-hover
              role="button"
              tabIndex={0}
              onClick={row.onClick}
              onKeyDown={(e) => e.key === "Enter" && row.onClick?.()}
            >
              <div className="ct-alt-name">{row.name}</div>
              {row.href ? (
                <a className="ct-alt-action" href={row.href} target="_blank" rel="noreferrer">
                  {row.action}
                </a>
              ) : (
                <div className="ct-alt-action">{row.action}</div>
              )}
            </div>
          ))}
        </div>
        <div className="ct-ambient-kanji">連絡</div>
      </div>
    </div>
  );
}

export { SLIDE_INDEX };
