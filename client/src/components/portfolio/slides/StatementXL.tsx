import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

type Props = { children: ReactNode; active: boolean };

export default function StatementXL({ children, active }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 48, filter: "blur(12px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
    );
  }, [active]);

  return (
    <div className="s-xl" ref={ref}>
      {children}
    </div>
  );
}
