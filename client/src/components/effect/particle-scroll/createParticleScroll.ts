/**
 * Imperative core of the ParticleScroll effect — no React.
 *
 * Mirrors liquid-ether/createLiquidEther.ts: the WebGL lifecycle lives in a
 * plain .ts module and ParticleScroll.tsx is a thin component around it.
 */

import { createGuardedContext, releaseContext } from "@/three/webglGuard";
import { BASE_FRAG, POINT_FRAG, POINT_VERT, QUAD_VERT } from "./shaders";
// Re-exported so existing importers of this module keep working.
export { supportsHtmlInCanvas } from "./support";
import type { ElementImageContext, PaintableCanvas } from "./support";
import {
  DEFAULTS,
  type ParticleScrollElements,
  type ParticleScrollInstance,
  type ParticleScrollOptions,
  type ParticleScrollProgressSource,
} from "./types";

export function createParticleScroll(
  elements: ParticleScrollElements,
  options: ParticleScrollOptions = {},
  progressSource: ParticleScrollProgressSource | null = null,
): ParticleScrollInstance | null {
  const config = { ...DEFAULTS, ...options };
  const { source, content, output } = elements;

  // Through the guard, never `output.getContext` directly — the raw context
  // draws on the same per-page budget as every three.js effect, and one the
  // guard cannot see is how the page creeps back over the limit that got a
  // deployed build blacklisted. See three/webglGuard.ts.
  const gl = createGuardedContext(output, {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: false,
  });
  if (!gl) return null;

  const sourceCtx = source.getContext("2d") as ElementImageContext | null;
  const paintable = source as PaintableCanvas;
  const htmlInCanvas = Boolean(
    sourceCtx &&
    typeof sourceCtx.drawElementImage === "function" &&
    typeof paintable.requestPaint === "function",
  );

  let contentDirty = false;
  let wake = () => {};

  if (htmlInCanvas) {
    paintable.onpaint = () => {
      try {
        sourceCtx!.reset();
        sourceCtx!.drawElementImage!(content, 0, 0);
        contentDirty = true;
        wake();
      } catch {
        /* drawElementImage throws on content it cannot rasterise (cross-origin
           media, an unsupported paint). The frame is simply not refreshed —
           the previous capture stays on screen, which is the right degrade. */
      }
    };
  }

  function compile(type: number, text: string): WebGLShader {
    const shader = gl!.createShader(type)!;
    gl!.shaderSource(shader, text);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.error(
        "ParticleScroll shader error:",
        gl!.getShaderInfoLog(shader),
      );
    }
    return shader;
  }

  function link(vertText: string, fragText: string) {
    const vert = compile(gl!.VERTEX_SHADER, vertText);
    const frag = compile(gl!.FRAGMENT_SHADER, fragText);
    const program = gl!.createProgram()!;
    gl!.attachShader(program, vert);
    gl!.attachShader(program, frag);
    gl!.linkProgram(program);
    const uniforms: Record<string, WebGLUniformLocation> = {};
    const count = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const info = gl!.getActiveUniform(program, i)!;
      uniforms[info.name] = gl!.getUniformLocation(program, info.name)!;
    }
    return { program, vert, frag, uniforms };
  }

  const base = link(QUAD_VERT, BASE_FRAG);
  const points = link(POINT_VERT, POINT_FRAG);

  const quadVao = gl.createVertexArray()!;
  gl.bindVertexArray(quadVao);
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const pointVao = gl.createVertexArray()!;

  const contentTexture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, contentTexture);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 0]),
  );
  gl.generateMipmap(gl.TEXTURE_2D);

  let contentMaxX = 1;

  const rowTex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, rowTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let rowProgress = new Float32Array(0);
  let rowWindow = new Float32Array(0);
  let rowsAnimating = false;
  let rowsAssembled = false;

  let bg: [number, number, number] = [0, 0, 0];
  const bgProbe = document.createElement("canvas");
  bgProbe.width = bgProbe.height = 1;
  const bgCtx = bgProbe.getContext("2d", { willReadFrequently: true });

  function syncBgColor() {
    if (!bgCtx) return;
    let el: Element | null = content;
    while (el) {
      const css = getComputedStyle(el).backgroundColor;
      if (css && css !== "transparent") {
        bgCtx.clearRect(0, 0, 1, 1);
        bgCtx.fillStyle = css;
        bgCtx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = bgCtx.getImageData(0, 0, 1, 1).data;
        if (a > 0) {
          bg = [r / 255, g / 255, b / 255];
          return;
        }
      }
      el = el.parentElement;
    }
    bg = [0, 0, 0];
  }

  function syncCanvasSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(output.clientWidth * dpr));
    const height = Math.max(1, Math.round(output.clientHeight * dpr));
    if (output.width !== width || output.height !== height) {
      output.width = width;
      output.height = height;
    }
    contentMaxX = Math.min(
      1,
      Math.max(0.05, content.clientWidth / Math.max(output.clientWidth, 1)),
    );
    if (htmlInCanvas) {
      const cssWidth = Math.max(1, Math.round(source.clientWidth));
      const cssHeight = Math.max(1, Math.round(source.clientHeight));
      if (source.width !== cssWidth * dpr || source.height !== cssHeight * dpr) {
        source.width = cssWidth * dpr;
        source.height = cssHeight * dpr;
      }
      paintable.requestPaint!();
    }
  }

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionQuery.matches;

  let time = 0;
  let introDone = false;
  let introWait = 0;
  let introReady = false;

  /* ── Scroll source ───────────────────────────────────────────────────────
     Everything downstream works in "document pixels scrolled". In element mode
     that is literally `content.scrollTop`. In progress mode the content never
     scrolls, so we synthesise the same quantity from the host's 0→1 progress:
     the formation line is swept across a stationary block instead. Keeping the
     synthetic value in the same units means `rowTargetFor` and the shaders are
     untouched by the distinction. */

  /** Distance from the top of the viewport to the formation line, in px. */
  function lineOffset() {
    return (
      Math.min(Math.max(config.point, 0), 1) * Math.max(output.clientHeight, 1)
    );
  }

  /** Total sweep length: first row a band below the line → last row above it. */
  function sweepRange() {
    return content.scrollHeight + lineOffset() + Math.max(config.band, 1);
  }

  /**
   * Shape raw host progress into assembly progress.
   *
   * Ramps in up to `enter`, holds fully assembled, ramps back out after `exit`
   * — so a slide's content condenses on the way in and dissolves on the way
   * out, rather than latching assembled forever at progress 1.
   */
  function assemblyProgress() {
    const raw = Math.min(Math.max(progressSource!.get(), 0), 1);
    const enter = Math.min(Math.max(config.enter, 0), 1);
    const exit = Math.min(Math.max(config.exit, enter), 1);
    if (raw < enter) return raw / Math.max(enter, 1e-4);
    if (raw > exit) return Math.max(0, 1 - (raw - exit) / Math.max(1 - exit, 1e-4));
    return 1;
  }

  function readScrollTop() {
    if (!progressSource) return content.scrollTop;
    return (
      assemblyProgress() * sweepRange() - (lineOffset() + Math.max(config.band, 1))
    );
  }

  let scrollSmooth = readScrollTop();
  syncCanvasSize();
  syncBgColor();

  function uploadContent() {
    if (!htmlInCanvas || !contentDirty) return;
    contentDirty = false;
    introReady = true;
    syncBgColor();
    gl!.bindTexture(gl!.TEXTURE_2D, contentTexture);
    gl!.texImage2D(
      gl!.TEXTURE_2D,
      0,
      gl!.RGBA,
      gl!.RGBA,
      gl!.UNSIGNED_BYTE,
      source,
    );
    gl!.generateMipmap(gl!.TEXTURE_2D);
  }

  function rowTargetFor(docRowY: number) {
    if (reducedMotion || !introDone) return 1;
    const h = Math.max(output.clientHeight, 1);
    const band = Math.max(config.band, 1);
    let line = lineOffset();
    // Progress mode skips the end-of-scroll easing below: the `exit` ramp in
    // assemblyProgress() already dissolves the block on the way out, and
    // running both would double the effect.
    if (!progressSource) {
      const max = content.scrollHeight - content.clientHeight;
      if (max <= 1) {
        line = h + band;
      } else {
        const endP = Math.min(
          Math.max((scrollSmooth - (max - h * 0.5)) / (h * 0.5), 0),
          1,
        );
        line += (h + band - line) * endP * endP;
      }
    }
    const vy = docRowY - scrollSmooth;
    return Math.min(Math.max((line + band - vy) / band, 0), 1);
  }

  function updateRows(
    dt: number,
    density: number,
    winStart: number,
    winLen: number,
  ) {
    const docRows = Math.max(1, Math.ceil(content.scrollHeight / density));
    if (rowProgress.length !== docRows) {
      const next = new Float32Array(docRows);
      for (let i = 0; i < docRows; i++) {
        next[i] = rowTargetFor((i + 0.5) * density);
      }
      rowProgress = next;
    }
    if (rowWindow.length !== winLen) rowWindow = new Float32Array(winLen);
    rowsAnimating = false;
    let minP = 1;
    const settle = Math.max(config.settle, 0.05);
    for (let i = 0; i < docRows; i++) {
      const target = rowTargetFor((i + 0.5) * density);
      let p = rowProgress[i];
      const inWin = i >= winStart - 4 && i < winStart + winLen + 4;
      if (p !== target) {
        if (reducedMotion || !inWin) {
          p = target;
        } else {
          if (p < target) p = Math.min(p + dt / settle, target);
          else p = Math.max(p - dt / (settle * 0.6), target);
          if (p !== target) rowsAnimating = true;
        }
        rowProgress[i] = p;
      }
      if (inWin && p < minP) minP = p;
    }
    rowsAssembled = minP >= 0.9995;
    rowWindow.fill(1);
    const from = Math.min(Math.max(winStart, 0), docRows);
    const to = Math.min(winStart + winLen, docRows);
    if (to > from)
      rowWindow.set(rowProgress.subarray(from, to), from - winStart);
    gl!.bindTexture(gl!.TEXTURE_2D, rowTex);
    gl!.texImage2D(
      gl!.TEXTURE_2D,
      0,
      gl!.R32F,
      winLen,
      1,
      0,
      gl!.RED,
      gl!.FLOAT,
      rowWindow,
    );
  }

  function render(dt: number) {
    uploadContent();
    const w = Math.max(output.clientWidth, 1);
    const h = Math.max(output.clientHeight, 1);
    const dpr = output.width / w;
    const density = Math.max(
      Math.max(config.density, 1),
      Math.sqrt((w * h) / 800000),
    );
    const scrollTop = readScrollTop();
    const gridX = Math.ceil(w / density);
    const winStart = Math.floor(scrollTop / density);
    const winLen = Math.ceil(h / density) + 2;
    const stagger = Math.min(Math.max(config.stagger, 0), 0.95);
    updateRows(dt, density, winStart, winLen);

    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    gl!.viewport(0, 0, output.width, output.height);
    gl!.activeTexture(gl!.TEXTURE1);
    gl!.bindTexture(gl!.TEXTURE_2D, rowTex);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, contentTexture);

    gl!.disable(gl!.BLEND);
    gl!.useProgram(base.program);
    gl!.bindVertexArray(quadVao);
    gl!.uniform1i(base.uniforms.uContent, 0);
    gl!.uniform1i(base.uniforms.uRowTex, 1);
    gl!.uniform2f(base.uniforms.uRes, w, h);
    gl!.uniform1f(base.uniforms.uDensity, density);
    gl!.uniform1f(base.uniforms.uRowCount, winLen);
    gl!.uniform1f(base.uniforms.uStagger, stagger);
    gl!.uniform1f(base.uniforms.uMaxX, contentMaxX);
    gl!.uniform1f(base.uniforms.uCover, htmlInCanvas ? 1 : 0);
    gl!.uniform1f(base.uniforms.uScroll, scrollTop);
    gl!.uniform1f(base.uniforms.uWinStart, winStart);
    gl!.uniform3f(base.uniforms.uBg, bg[0], bg[1], bg[2]);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

    if (!htmlInCanvas || rowsAssembled) return;
    gl!.enable(gl!.BLEND);
    gl!.blendFuncSeparate(
      gl!.SRC_ALPHA,
      gl!.ONE_MINUS_SRC_ALPHA,
      gl!.ZERO,
      gl!.ONE,
    );
    gl!.useProgram(points.program);
    gl!.bindVertexArray(pointVao);
    gl!.uniform1i(points.uniforms.uRowTex, 1);
    gl!.uniform2f(points.uniforms.uRes, w, h);
    gl!.uniform2f(points.uniforms.uGrid, gridX, winLen);
    gl!.uniform1f(points.uniforms.uDensity, density);
    gl!.uniform1f(points.uniforms.uStagger, stagger);
    gl!.uniform1f(points.uniforms.uSpread, Math.max(config.spread, 0));
    gl!.uniform1f(
      points.uniforms.uGravity,
      Math.min(Math.max(config.gravity, -1), 1),
    );
    gl!.uniform1f(points.uniforms.uDrift, Math.max(config.drift, 0));
    gl!.uniform1f(points.uniforms.uSwirl, Math.max(config.swirl, 0));
    gl!.uniform1f(points.uniforms.uTime, time);
    gl!.uniform1f(points.uniforms.uFade, Math.min(Math.max(config.fade, 0), 1));
    gl!.uniform1f(points.uniforms.uSize, Math.max(config.size, 0.5));
    gl!.uniform1f(points.uniforms.uDpr, dpr);
    gl!.uniform1f(points.uniforms.uMaxX, contentMaxX);
    gl!.uniform1i(points.uniforms.uContent, 0);
    gl!.uniform1f(points.uniforms.uLag, lag);
    gl!.uniform1f(points.uniforms.uScroll, scrollTop);
    gl!.uniform1f(points.uniforms.uWinStart, winStart);
    gl!.drawArrays(gl!.POINTS, 0, gridX * winLen);
    gl!.bindVertexArray(quadVao);
    gl!.disable(gl!.BLEND);
  }

  let raf = 0;
  let lastTime = performance.now();
  let destroyed = false;
  let running = false;
  let visible = true;
  let active = true;
  let lag = 0;
  let lastScrollTop = readScrollTop();

  function frame(now: number) {
    if (destroyed) return;
    if (!visible || !active) {
      running = false;
      return;
    }
    const delta = Math.min((now - lastTime) / 1000, 1 / 30);
    lastTime = now;
    time += delta;
    const scrollTop = readScrollTop();
    lag += scrollTop - lastScrollTop;
    lastScrollTop = scrollTop;
    lag *= Math.exp(-delta / 0.22);
    lag = Math.min(Math.max(lag, -400), 400);
    if (reducedMotion || Math.abs(lag) < 0.1) lag = 0;
    if (!introDone) {
      if (reducedMotion || !htmlInCanvas) introDone = true;
      else if (introReady) {
        introWait += delta;
        if (introWait >= 1) introDone = true;
      }
    }
    const tau = config.smoothing;
    const k =
      reducedMotion || tau <= 0
        ? 1
        : 1 - Math.exp(-delta / Math.max(tau, 1e-4));
    scrollSmooth += (scrollTop - scrollSmooth) * k;
    if (Math.abs(scrollTop - scrollSmooth) < 0.5) scrollSmooth = scrollTop;
    render(delta);
    if (
      !contentDirty &&
      scrollSmooth === scrollTop &&
      !rowsAnimating &&
      rowsAssembled &&
      introDone &&
      lag === 0
    ) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (destroyed || running || !visible || !active) return;
    running = true;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  }

  wake = start;
  start();

  // Element mode listens to the content's own scroll. Progress mode subscribes
  // to the host's signal instead and never touches the DOM scroll event — the
  // content is not a scroller there, which is the entire point.
  let unsubscribeProgress: (() => void) | null = null;
  function onScroll() {
    if (htmlInCanvas) paintable.requestPaint!();
    start();
  }
  if (progressSource) {
    // No requestPaint here: progress changing does not change the content's
    // own layout, only where the formation line falls across it.
    unsubscribeProgress = progressSource.subscribe(start);
  } else {
    content.addEventListener("scroll", onScroll, { passive: true });
  }

  function onMotionChange() {
    reducedMotion = motionQuery.matches;
    start();
  }
  motionQuery.addEventListener("change", onMotionChange);

  const observer = new ResizeObserver(() => {
    syncCanvasSize();
    start();
  });
  observer.observe(output);
  observer.observe(content);

  const intersection = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1]?.isIntersecting ?? true;
    if (visible) start();
  });
  intersection.observe(output);

  return {
    setOptions(next) {
      if (
        !Object.entries(next).some(
          ([key, value]) =>
            config[key as keyof ParticleScrollOptions] !== value,
        )
      )
        return;
      Object.assign(config, next);
      start();
    },
    resize() {
      syncCanvasSize();
      start();
    },
    setActive(next) {
      if (active === next) return;
      active = next;
      if (active) {
        start();
      } else {
        cancelAnimationFrame(raf);
        // Must clear `running` too — start() bails on it, so leaving it set
        // would make the effect unresumable.
        running = false;
      }
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      unsubscribeProgress?.();
      content.removeEventListener("scroll", onScroll);
      observer.disconnect();
      intersection.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      gl!.deleteTexture(contentTexture);
      gl!.deleteTexture(rowTex);
      gl!.deleteProgram(base.program);
      gl!.deleteProgram(points.program);
      gl!.deleteShader(base.vert);
      gl!.deleteShader(base.frag);
      gl!.deleteShader(points.vert);
      gl!.deleteShader(points.frag);
      gl!.deleteBuffer(quad);
      gl!.deleteVertexArray(quadVao);
      gl!.deleteVertexArray(pointVao);
      if (htmlInCanvas) paintable.onpaint = null;
      // Hand the context budget back. Deliberately no loseContext() — see
      // releaseContext() in three/webglGuard.ts for why forcing the loss is
      // what gets a page blacklisted.
      releaseContext(gl);
    },
  };
}
