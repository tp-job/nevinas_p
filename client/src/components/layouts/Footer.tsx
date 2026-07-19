import type { FC } from "react";
import { Assets } from "@/data/homeData";
import "@/styles/components/socalmedia.css";
import GradualBlur from "@/components/effect/GradualBlur";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    /**
     * Layout decisions
     * ─────────────────────────────────────────────────────────────────────
     * • `relative overflow-hidden`   — GradualBlur anchor + clip boundary
     * • `min-h-svh`                  — fills the full viewport when used as
     *                                  a 'fill' slide in HomePage
     * • `flex flex-col items-center justify-center`
     *                                — centres the content block both axes
     *                                  (replaces the old `justify-end` that
     *                                  pinned content to the bottom)
     */
    <footer className="relative overflow-hidden min-h-svh flex flex-col items-center justify-center text-light-text dark:text-dark-text">

      {/* LiquidEther mesh is now a single shared backdrop mounted in HomePage. */}

      {/* ── Content — sits above the mesh on z-10 ── */}
      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Logo & Email */}
        <div className="text-center">
          <img
            src={Assets.logo}
            alt="logo"
            className="w-24 mx-auto mb-2 rounded-full"
          />
          <a
            href="mailto:nevinasv@gmail.com"
            className="flex items-center gap-2 mx-auto mt-4 text-xl w-max text-light-text dark:text-dark-text hover:text-matte-azure transition-colors duration-200"
          >
            <i className="ri-mail-fill" aria-hidden="true" />
            nevinasv@gmail.com
          </a>
        </div>

        {/* Copyright & Social Icons */}
        <div className="w-full text-center sm:flex items-center justify-between border-t border-light-border dark:border-dark-border mx-auto px-[10%] mt-12 py-6 max-w-5xl text-light-text-secondary dark:text-dark-text-secondary">
          <p className="dark:text-dark-text">{currentYear} | Nevinas</p>
          <ul className="flex items-center justify-center gap-10 mt-4 sm:mt-0 wrapper">
            <li className="icon contact">
              <span className="tooltip" aria-hidden="true">Twitter</span>
              <a
                href="https://x.com/nevinas_ka"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-light-text dark:text-dark-text hover:text-matte-azure transition-colors duration-200"
              >
                <i className="text-3xl ri-twitter-fill" aria-hidden="true" />
              </a>
            </li>
            <li className="icon contact">
              <span className="tooltip" aria-hidden="true">Instagram</span>
              <a
                href="https://www.instagram.com/tp_job_th/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-light-text dark:text-dark-text hover:text-matte-azure transition-colors duration-200"
              >
                <i className="text-3xl ri-instagram-fill" aria-hidden="true" />
              </a>
            </li>
            <li className="icon contact">
              <span className="tooltip" aria-hidden="true">Github</span>
              <a
                href="https://github.com/tp-job"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
                className="text-light-text dark:text-dark-text hover:text-matte-azure transition-colors duration-200"
              >
                <i className="text-3xl ri-github-fill" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* GradualBlur — rendered last so it composites over the mesh */}
      <GradualBlur
        preset="footer"
        strength={1.5}
        opacity={0.55}
        zIndex={10}
        animated="scroll"
      />

    </footer>
  );
};

export default Footer;