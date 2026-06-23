import { DataServices, DataTimeline } from "@/data/homeData";

type Props = { style: React.CSSProperties };

const steps = [
  { num: "STEP 01", label: "Core Skills", title: "Languages", desc: DataTimeline[0].description },
  { num: "STEP 02", label: "Education", title: "Learning Journey", desc: DataTimeline[1].description },
  { num: "STEP 03", label: "Portfolio Work", title: "Projects", desc: DataTimeline[2].description },
  { num: "STEP 04", label: "Tech Stack", title: "Tools I Use", desc: DataTimeline[3].description },
  { num: "STEP 05", label: "Vision", title: "Future Goals", desc: DataTimeline[4].description },
];

const projects = [
  { cat: "Frontend Project", name: "Smart Learning Hub (LMS)" },
  { cat: "Web Design", name: "3D Interactive Web" },
  { cat: "Frontend Project", name: "Timeline System" },
  { cat: "UI / UX Design", name: "Dashboard Interface" },
];

const ProjArrow = () => (
  <svg className="proj-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export function JourneySlide({ style }: Props) {
  return (
    <div className="slide dk" id="s7" style={style}>
      <div className="s-pre">My Journey</div>
      <div className="s-jp" style={{ marginBottom: "1.6rem" }}>
        私の旅
      </div>
      <div className="steps-wrap">
        {steps.map((s) => (
          <div key={s.num} className="step" data-hover>
            <div className="step-num">{s.num}</div>
            <div className="step-label">{s.label}</div>
            <div className="step-title">{s.title}</div>
            <div className="step-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ServicesSlide({ style }: Props) {
  const icons = [
    <svg key="w" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 20h8M12 17v3" /></svg>,
    <svg key="d" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    <svg key="m" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" /></svg>,
    <svg key="u" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
  ];

  return (
    <div className="slide lt" id="s8" style={style}>
      <div className="s-pre">What I Offer</div>
      <div className="s-jp" style={{ marginBottom: "1.6rem" }}>
        私のサービス
      </div>
      <div className="svc-wrap">
        {DataServices.map((svc, i) => (
          <div key={svc.id} className="svc" data-hover>
            <div className="svc-ico">{icons[i]}</div>
            <div className="svc-title">{svc.title}</div>
            <div className="svc-desc">{svc.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkSlide({ style }: Props) {
  return (
    <div className="slide dk" id="s9" style={style}>
      <div className="s-pre">My Latest Work</div>
      <div className="s-jp" style={{ marginBottom: "1.6rem" }}>
        私の最新の作品
      </div>
      <div className="proj-grid">
        {projects.map((p) => (
          <div key={p.name} className="proj" data-hover>
            <div className="proj-cat">{p.cat}</div>
            <div className="proj-name">{p.name}</div>
            <ProjArrow />
          </div>
        ))}
      </div>
    </div>
  );
}
