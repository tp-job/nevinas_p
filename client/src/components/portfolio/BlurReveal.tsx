import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
// anime.js v4 — split-character reveal (React Bits–style)

type Props = {
  text: string;
  className?: string;
  delay?: number;
  active?: boolean;
};

/** React Bits–style split blur reveal (anime.js v4) */
export default function BlurReveal({
  text,
  className = "",
  delay = 0,
  active = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active || played.current) return;

    const chars = text.split("");
    el.innerHTML = chars
      .map((c) => `<span class="pf-char" style="display:inline-block">${c === " " ? "&nbsp;" : c}</span>`)
      .join("");

    played.current = true;
    animate(el.querySelectorAll(".pf-char"), {
      opacity: [0, 1],
      translateY: [18, 0],
      filter: ["blur(10px)", "blur(0px)"],
      delay: stagger(42, { start: delay }),
      duration: 720,
      ease: "out(3)",
    });
  }, [text, delay, active]);

  return <span ref={ref} className={className} />;
}
