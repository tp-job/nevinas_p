import type { FC } from "react";
import { Assets } from "@/data/HomeData";
import "@/styles/components/socalmedia.css";
import GradualBlur from "@/components/effect/GradualBlur"; // ✅ [Frontend] import GradualBlur

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    // ✅ [Frontend] เพิ่ม `relative` เพื่อให้ GradualBlur (position: absolute) หา anchor ถูกต้อง
    // ✅ [Frontend] เพิ่ม `overflow-hidden` กันไม่ให้ blur ล้น viewport
    <div className="mt-20 relative overflow-hidden">

      {/* ── Logo & Email ── */}
      <div className="text-center">
        <img
          src={Assets.logo}
          alt="logo"
          className="w-24 mx-auto mb-2 rounded-full"
        />
        <div className="flex items-center gap-2 mx-auto mt-4 text-xl w-max">
          <i className="ri-mail-fill"></i>
          nevinasv@gmail.com
        </div>
      </div>

      {/* ── Copyright & Social Icons ── */}
      <div className="text-center sm:flex items-center justify-between border-t border-light-border dark:border-dark-border mx-[10%] mt-12 py-6">
        <p>{currentYear} | Nevinas</p>
        <ul className="flex items-center justify-center gap-10 mt-4 sm:mt-0 wrapper">
          <li className="icon contact">
            <span className="tooltip">Twitter</span>
            <a
              href="https://x.com/nevinas_ka"
              className="hover:text-global-purple transition-colors duration-200"
            >
              <i className="text-3xl ri-twitter-fill"></i>
            </a>
          </li>
          <li className="icon contact">
            <span className="tooltip">Instagram</span>
            <a
              href="https://www.instagram.com/tp_job_th/?hl=en"
              className="hover:text-global-purple transition-colors duration-200"
            >
              <i className="text-3xl ri-instagram-fill"></i>
            </a>
          </li>
          <li className="icon contact">
            <span className="tooltip">Github</span>
            <a
              href="https://github.com/tp-job"
              className="hover:text-global-purple transition-colors duration-200"
            >
              <i className="text-3xl ri-github-fill"></i>
            </a>
          </li>
        </ul>
      </div>

      <GradualBlur
        preset="footer"
        strength={1.5}
        opacity={0.55}
        zIndex={10}
        animated="scroll"
      />
    </div>
  );
};

export default Footer;