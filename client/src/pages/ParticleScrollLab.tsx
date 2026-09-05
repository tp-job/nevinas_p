/**
 * ParticleScrollLab — debug route (`/particle-scroll`), not linked from the app.
 *
 * Exists because the effect cannot be judged from the homepage: it depends on
 * the experimental html-in-canvas APIs (`layoutsubtree` + `drawElementImage` +
 * `requestPaint`), which ship behind a flag in Chromium and nowhere else. This
 * page reports whether the current browser has them, and drives BOTH modes:
 *
 *   - element mode   — the standalone path, content scrolls inside the effect
 *   - progress mode  — the homepage path, driven by a SlideScrollContext value
 *                      that the slider below stands in for
 *
 * Mirrors the existing `/laserflow` debug-route precedent.
 */

import { useMemo, useState, type FC } from "react";
import { motionValue } from "framer-motion";
import ParticleScroll from "@/components/effect/ParticleScroll";
import ParticleScrollLazy from "@/components/effect/ParticleScrollLazy";
import CodeWithClarity from "@/components/homepage/CodeWithClarity";
import { supportsHtmlInCanvas } from "@/components/effect/particle-scroll/createParticleScroll";
import { SlideScrollContext } from "@/components/homepage/slideScroll";
import { useDeviceProfile } from "@/hooks/useDeviceCapability";

const SampleCopy: FC<{ title: string }> = ({ title }) => (
  <div className="px-8 py-10 text-periwinkle">
    <h2 className="text-3xl font-light mb-4">{title}</h2>
    {Array.from({ length: 8 }, (_, i) => (
      <p key={i} className="mb-4 max-w-prose text-cool leading-relaxed">
        {i + 1}. Sand settles into legible type as the formation line passes
        over it. Each row of grains condenses on its own delay, so the block
        resolves top-down the way it would be read rather than all at once.
      </p>
    ))}
  </div>
);

const Row: FC<{ label: string; value: string; ok?: boolean }> = ({
  label,
  value,
  ok,
}) => (
  <div className="flex items-baseline justify-between gap-6 py-1.5 border-b border-dark-border/40">
    <span className="text-xs uppercase tracking-wider text-cool">{label}</span>
    <span
      className={`text-sm font-medium ${
        ok === undefined
          ? "text-periwinkle"
          : ok
            ? "text-global-green"
            : "text-global-red"
      }`}
    >
      {value}
    </span>
  </div>
);

const ParticleScrollLab: FC = () => {
  const supported = supportsHtmlInCanvas();
  const { tier, isMobile, reducedMotion } = useDeviceProfile();
  const affordable = !isMobile && tier !== "low";

  // Stands in for the slide's scrollYProgress so progress mode can be driven
  // by hand rather than by scrolling the whole homepage.
  const progress = useMemo(() => motionValue(0), []);
  const [progressLabel, setProgressLabel] = useState(0);
  const [active, setActive] = useState(true);

  return (
    <div className="min-h-svh bg-charcoal p-6 lg:p-10 space-y-8">
      <header>
        <h1 className="text-3xl font-light text-periwinkle mb-1">
          ParticleScroll Lab
        </h1>
        <p className="text-sm text-cool">
          Debug route. Not linked from the app.
        </p>
      </header>

      <section className="max-w-md glass rounded-2xl p-5">
        <h2 className="text-xs uppercase tracking-wider text-cool mb-3">
          Environment
        </h2>
        <Row
          label="html-in-canvas"
          value={supported ? "supported" : "unsupported"}
          ok={supported}
        />
        <Row label="device tier" value={tier} ok={tier !== "low"} />
        <Row label="isMobile" value={String(isMobile)} ok={!isMobile} />
        <Row label="reduced motion" value={String(reducedMotion)} />
        <Row
          label="effect can render"
          value={supported && affordable ? "yes" : "no"}
          ok={supported && affordable}
        />
        {!supported && (
          <p className="mt-3 text-xs leading-relaxed text-cool">
            Without <code>drawElementImage</code>/<code>requestPaint</code> the
            shader has no content texture to scatter, so the output canvas draws
            nothing and the plain-DOM fallback below is what you see. No WebGL
            context is created in this state. To see the real effect, run Chrome
            with <code>--enable-blink-features=HTMLInCanvas</code> (or enable the
            html-in-canvas flag in <code>chrome://flags</code>).
          </p>
        )}
      </section>

      {/* ── Element mode ─────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-cool">
          Element mode — content scrolls inside the effect
        </h2>
        <ParticleScroll
          useSlideProgress={false}
          className="h-[420px] rounded-2xl overflow-hidden border border-dark-border"
        >
          <SampleCopy title="Element mode" />
        </ParticleScroll>
      </section>

      {/* ── Progress mode ────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-cool">
          Progress mode — driven by slide progress, no inner scroller
        </h2>

        <div className="flex flex-wrap items-center gap-4 text-sm text-periwinkle">
          <label className="flex items-center gap-3">
            <span className="text-cool">progress</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              defaultValue={0}
              className="w-64"
              onChange={(e) => {
                const v = Number(e.target.value);
                progress.set(v);
                setProgressLabel(v);
              }}
            />
            <span className="tabular-nums w-12">
              {progressLabel.toFixed(2)}
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <span className="text-cool">active</span>
          </label>
        </div>

        <SlideScrollContext.Provider value={progress}>
          <ParticleScroll
            active={active}
            className="h-[420px] rounded-2xl overflow-hidden border border-dark-border"
          >
            <SampleCopy title="Progress mode" />
          </ParticleScroll>
        </SlideScrollContext.Provider>
      </section>

      {/* ── Production composition ───────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-cool">
          Production composition — ParticleScrollLazy + CodeWithClarity, the
          exact pairing the homepage&apos;s <code>clarity</code> slide uses
        </h2>
        <p className="max-w-2xl text-xs leading-relaxed text-cool">
          CodeWithClarity is the chosen host because the effect&apos;s base pass
          is opaque: it fills with a background colour sampled from the nearest
          opaque ancestor. A slide over the shared LiquidEther would have the
          ether painted out, so ether slides are excluded and the host must
          bring its own solid background. This one does, and is a self-contained
          100svh block, so content ≈ viewport and the sweep geometry holds.
        </p>
        <SlideScrollContext.Provider value={progress}>
          <ParticleScrollLazy
            active={active}
            className="h-[520px] rounded-2xl overflow-hidden border border-dark-border"
          >
            <CodeWithClarity />
          </ParticleScrollLazy>
        </SlideScrollContext.Provider>
      </section>
    </div>
  );
};

export default ParticleScrollLab;
