import { NAV_LINKS } from "./portfolioConfig";

type Props = {
  isLight: boolean;
  onGoto: (index: number) => void;
};

export default function PortfolioNav({ isLight, onGoto }: Props) {
  return (
    <nav id="nav" className={isLight ? "lnav" : "dnav"}>
      <a
        href="#top"
        className="nav-l"
        data-hover
        onClick={(e) => {
          e.preventDefault();
          onGoto(0);
        }}
      >
        <div className="nav-ico">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <rect x="1" y="1" width="6" height="6" fill="white" />
            <rect x="9" y="9" width="6" height="6" fill="white" />
            <rect x="9" y="1" width="6" height="6" fill="rgba(255,255,255,.28)" />
          </svg>
        </div>
        <span className="nav-nm">
          Nevinas<sup>©</sup>
        </span>
      </a>
      <div className="nav-r">
        <span className="npill ico" style={{ fontSize: ".7rem" }} data-hover>
          i
        </span>
        {NAV_LINKS.map((link) => (
          <button
            key={link.label}
            type="button"
            className="npill"
            data-hover
            onClick={() => onGoto(link.index)}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
