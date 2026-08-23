import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useSlideScroll } from "@/components/homepage/SlideWrapper";
import { useDeviceProfile } from "@/hooks/useDeviceCapability";
import {
  createParticleScroll,
  supportsHtmlInCanvas,
} from "./particle-scroll/createParticleScroll";
import type {
  ParticleScrollInstance,
  ParticleScrollOptions,
  ParticleScrollProgressSource,
} from "./particle-scroll/types";

// Re-exported so existing `from "@/components/effect/ParticleScroll"` imports
// keep working after the core moved into particle-scroll/.
export type {
  ParticleScrollElements,
  ParticleScrollInstance,
  ParticleScrollOptions,
  ParticleScrollProgressSource,
} from "./particle-scroll/types";

export interface ParticleScrollProps extends ParticleScrollOptions {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Whether the effect should render. Pass the host's own active flag when the
   * component lives somewhere that stays mounted while invisible — homepage
   * slides are absolutely stacked and always intersecting, so the internal
   * IntersectionObserver cannot detect that case on its own.
   */
  active?: boolean;
  /**
   * Ride the enclosing homepage slide's scroll progress instead of scrolling
   * internally. Defaults to true when rendered inside a `SlideWrapper`, which
   * is the only correct behaviour there — an internal scroller nested in the
   * homepage's single scroll container would starve the outer one and freeze
   * `activeSlide`. Set false to force standalone element-scroll mode.
   */
  useSlideProgress?: boolean;
}

const emptySubscribe = () => () => {};

export function ParticleScroll({
  children,
  className,
  style,
  active = true,
  useSlideProgress = true,
  ...options
}: ParticleScrollProps) {
  const sourceRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<ParticleScrollInstance | null>(null);
  const [initialOptions] = useState(options);
  const [failed, setFailed] = useState(false);

  const { tier, isMobile } = useDeviceProfile();
  // Two separate signals on purpose (see CLAUDE.md): `isMobile` because
  // html-in-canvas plus a per-pixel particle sim is wrong on any handheld
  // regardless of speed, `tier` because low-end hardware genuinely cannot
  // afford it. Either way we fall through to the plain-DOM branch, which is
  // what the overwhelming majority of browsers render anyway.
  const affordable = !isMobile && tier !== "low";

  const slideScroll = useSlideScroll();
  const progressSource = useMemo<ParticleScrollProgressSource | null>(() => {
    if (!useSlideProgress || !slideScroll) return null;
    return {
      get: () => slideScroll.get(),
      subscribe: (onChange) => slideScroll.on("change", onChange),
    };
  }, [useSlideProgress, slideScroll]);

  const supported = useSyncExternalStore(
    emptySubscribe,
    supportsHtmlInCanvas,
    () => false,
  );
  const native = supported && !failed && affordable;

  useEffect(() => {
    const source = sourceRef.current;
    const content = contentRef.current;
    const output = outputRef.current;
    if (!source || !content || !output) return;
    // Build the GL pipeline only when it can actually paint something.
    //
    // Without html-in-canvas there is no content texture, so the base pass
    // draws at uCover = 0 and the particle pass is skipped outright — the
    // output canvas renders literally nothing. Creating the instance anyway
    // spent a WebGL2 context out of the guard's budget of 4, a shader
    // compile, two observers and a RAF loop to produce no pixels, on every
    // browser that has not enabled the flag (i.e. very nearly all of them).
    if (!native) return;
    instanceRef.current = createParticleScroll(
      { source, content, output },
      initialOptions,
      progressSource,
    );
    if (!instanceRef.current) setFailed(true);
    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [initialOptions, native, progressSource]);

  useEffect(() => {
    instanceRef.current?.setActive(active);
  }, [active]);

  // Options are compared by value inside setOptions(), so an unchanged object
  // is a cheap no-op; the dependency is the serialised value rather than the
  // freshly-allocated literal, which would otherwise re-run every render.
  const optionsKey = JSON.stringify(options);
  useEffect(() => {
    instanceRef.current?.setOptions(JSON.parse(optionsKey));
  }, [optionsKey]);

  // Progress mode must NOT create a scroller: nesting one inside the
  // homepage's single scroll container starves the outer one, which is what
  // drives activeSlide and every scroll-linked transform in ActiveSlide.
  const contentStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: progressSource ? "hidden" : "auto",
  };

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <canvas
        ref={sourceRef}
        // @ts-expect-error experimental html-in-canvas attribute
        layoutsubtree="true"
        suppressHydrationWarning
        style={
          native
            ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
            : { display: "none" }
        }
      >
        {native ? (
          <div ref={contentRef} style={contentStyle}>
            {children}
          </div>
        ) : null}
      </canvas>
      {!native ? (
        <div ref={contentRef} style={contentStyle}>
          {children}
        </div>
      ) : null}
      <canvas
        ref={outputRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}


export default ParticleScroll;
