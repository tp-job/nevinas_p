import * as THREE from 'three';
import {
  face_vert,
  line_vert,
  mouse_vert,
  advection_frag,
  color_frag,
  divergence_frag,
  externalForce_frag,
  poisson_frag,
  pressure_frag,
  viscous_frag
} from './shaders';
import type { LiquidEtherConfig, LiquidEtherWebGL, SimOptions } from './types';
import { createGuardedRenderer, releaseRenderer } from '@/three/webglGuard';

function makePaletteTexture(stops: string[]): THREE.DataTexture {
  let arr: string[];
  if (Array.isArray(stops) && stops.length > 0) {
    arr = stops.length === 1 ? [stops[0], stops[0]] : stops;
  } else {
    arr = ['#ffffff', '#ffffff'];
  }
  const w = arr.length;
  const data = new Uint8Array(w * 4);
  for (let i = 0; i < w; i++) {
    const c = new THREE.Color(arr[i]);
    data[i * 4 + 0] = Math.round(c.r * 255);
    data[i * 4 + 1] = Math.round(c.g * 255);
    data[i * 4 + 2] = Math.round(c.b * 255);
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Builds the WebGL fluid-simulation engine, fully detached from React.
 * Everything (renderer, mouse handling, auto-driver, shader passes) lives in
 * this closure — exactly as it previously lived inside LiquidEther's
 * useEffect — so each call produces a fresh, isolated simulation.
 */
export function createLiquidEther(
  mountContainer: HTMLElement,
  config: LiquidEtherConfig
): LiquidEtherWebGL | null {
  const paletteTex = makePaletteTexture(config.colors);
  // Hard-code transparent background vector (alpha 0)
  const bgVec4 = new THREE.Vector4(0, 0, 0, 0);
  let rafId: number | null = null;

  class CommonClass {
    width = 0;
    height = 0;
    aspect = 1;
    pixelRatio = 1;
    isMobile = false;
    breakpoint = 768;
    fboWidth: number | null = null;
    fboHeight: number | null = null;
    time = 0;
    delta = 0;
    container: HTMLElement | null = null;
    renderer: THREE.WebGLRenderer | null = null;
    clock: THREE.Clock | null = null;
    /** @returns false when the browser refused a WebGL context. */
    init(container: HTMLElement): boolean {
      this.container = container;
      this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      this.resize();
      // Idempotent: the factory pre-flights this call so it can bail on a
      // refused context, and WebGLManager's constructor calls it again. Only
      // the first call may allocate a context.
      if (this.renderer) return true;
      this.renderer = createGuardedRenderer({ antialias: true, alpha: true });
      // A refused context is not an error condition — the backdrop's CSS
      // gradient placeholder is the intended fallback. Report it upward so the
      // factory can bail before building shader passes against a null renderer.
      if (!this.renderer) return false;
      // Always transparent
      this.renderer.autoClear = false;
      this.renderer.setClearColor(new THREE.Color(0x000000), 0);
      this.renderer.setPixelRatio(this.pixelRatio);
      this.renderer.setSize(this.width, this.height);
      const el = this.renderer.domElement;
      el.style.width = '100%';
      el.style.height = '100%';
      el.style.display = 'block';
      this.clock = new THREE.Clock();
      this.clock.start();
      return true;
    }
    resize() {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      this.width = Math.max(1, Math.floor(rect.width));
      this.height = Math.max(1, Math.floor(rect.height));
      this.aspect = this.width / this.height;
      if (this.renderer) this.renderer.setSize(this.width, this.height, false);
    }
    update() {
      if (!this.clock) return;
      this.delta = this.clock.getDelta();
      this.time += this.delta;
    }
  }
  const Common = new CommonClass();

  class MouseClass {
    mouseMoved = false;
    coords = new THREE.Vector2();
    coords_old = new THREE.Vector2();
    diff = new THREE.Vector2();
    scrollDiffY = 0;
    timer: number | null = null;
    container: HTMLElement | null = null;
    docTarget: Document | null = null;
    listenerTarget: Window | null = null;
    isHoverInside = false;
    hasUserControl = false;
    isAutoActive = false;
    autoIntensity = 2.0;
    takeoverActive = false;
    takeoverStartTime = 0;
    takeoverDuration = 0.25;
    takeoverFrom = new THREE.Vector2();
    takeoverTo = new THREE.Vector2();
    onInteract: (() => void) | null = null;
    private _onMouseMove = this.onDocumentMouseMove.bind(this);
    private _onTouchStart = this.onDocumentTouchStart.bind(this);
    private _onTouchMove = this.onDocumentTouchMove.bind(this);
    private _onTouchEnd = this.onTouchEnd.bind(this);
    private _onDocumentLeave = this.onDocumentLeave.bind(this);
    init(container: HTMLElement) {
      this.container = container;
      this.docTarget = container.ownerDocument || null;
      const defaultView = this.docTarget?.defaultView || (typeof window !== 'undefined' ? window : null);
      if (!defaultView) return;
      this.listenerTarget = defaultView;
      this.listenerTarget.addEventListener('mousemove', this._onMouseMove);
      this.listenerTarget.addEventListener('touchstart', this._onTouchStart, {
        passive: true
      });
      this.listenerTarget.addEventListener('touchmove', this._onTouchMove, {
        passive: true
      });
      this.listenerTarget.addEventListener('touchend', this._onTouchEnd);
      this.docTarget?.addEventListener('mouseleave', this._onDocumentLeave);
    }
    dispose() {
      if (this.listenerTarget) {
        this.listenerTarget.removeEventListener('mousemove', this._onMouseMove);
        this.listenerTarget.removeEventListener('touchstart', this._onTouchStart);
        this.listenerTarget.removeEventListener('touchmove', this._onTouchMove);
        this.listenerTarget.removeEventListener('touchend', this._onTouchEnd);
      }
      if (this.docTarget) {
        this.docTarget.removeEventListener('mouseleave', this._onDocumentLeave);
      }
      this.listenerTarget = null;
      this.docTarget = null;
      this.container = null;
    }
    private isPointInside(clientX: number, clientY: number) {
      if (!this.container) return false;
      const rect = this.container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    }
    private updateHoverState(clientX: number, clientY: number) {
      this.isHoverInside = this.isPointInside(clientX, clientY);
      return this.isHoverInside;
    }
    setCoords(x: number, y: number) {
      if (!this.container) return;
      if (this.timer) window.clearTimeout(this.timer);
      const rect = this.container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = (x - rect.left) / rect.width;
      const ny = (y - rect.top) / rect.height;
      this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
      this.mouseMoved = true;
      this.timer = window.setTimeout(() => {
        this.mouseMoved = false;
      }, 100);
    }
    setNormalized(nx: number, ny: number) {
      this.coords.set(nx, ny);
      this.mouseMoved = true;
    }
    onDocumentMouseMove(event: MouseEvent) {
      if (!this.updateHoverState(event.clientX, event.clientY)) return;
      if (this.onInteract) this.onInteract();
      if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = (event.clientY - rect.top) / rect.height;
        this.takeoverFrom.copy(this.coords);
        this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
        this.takeoverStartTime = performance.now();
        this.takeoverActive = true;
        this.hasUserControl = true;
        this.isAutoActive = false;
        return;
      }
      this.setCoords(event.clientX, event.clientY);
      this.hasUserControl = true;
    }
    onDocumentTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) return;
      const t = event.touches[0];
      if (!this.updateHoverState(t.clientX, t.clientY)) return;
      if (this.onInteract) this.onInteract();
      this.setCoords(t.clientX, t.clientY);
      this.hasUserControl = true;
    }
    onDocumentTouchMove(event: TouchEvent) {
      if (event.touches.length !== 1) return;
      const t = event.touches[0];
      if (!this.updateHoverState(t.clientX, t.clientY)) return;
      if (this.onInteract) this.onInteract();
      this.setCoords(t.clientX, t.clientY);
    }
    onTouchEnd() {
      this.isHoverInside = false;
    }
    onDocumentLeave() {
      this.isHoverInside = false;
    }
    update() {
      if (this.takeoverActive) {
        const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
        if (t >= 1) {
          this.takeoverActive = false;
          this.coords.copy(this.takeoverTo);
          this.coords_old.copy(this.coords);
          this.diff.set(0, 0);
        } else {
          const k = t * t * (3 - 2 * t);
          this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
        }
      }
      this.diff.subVectors(this.coords, this.coords_old);
      this.coords_old.copy(this.coords);
      if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);

      // Add scroll velocity Y component
      this.diff.y += this.scrollDiffY;

      if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
    }
  }
  const Mouse = new MouseClass();

  class AutoDriver {
    mouse: MouseClass;
    manager: WebGLManager;
    enabled: boolean;
    speed: number;
    resumeDelay: number;
    rampDurationMs: number;
    active = false;
    current = new THREE.Vector2(0, 0);
    target = new THREE.Vector2();
    lastTime = performance.now();
    activationTime = 0;
    margin = 0.2;
    private _tmpDir = new THREE.Vector2();
    constructor(
      mouse: MouseClass,
      manager: WebGLManager,
      opts: { enabled: boolean; speed: number; resumeDelay: number; rampDuration: number }
    ) {
      this.mouse = mouse;
      this.manager = manager;
      this.enabled = opts.enabled;
      this.speed = opts.speed;
      this.resumeDelay = opts.resumeDelay || 3000;
      this.rampDurationMs = (opts.rampDuration || 0) * 1000;
      this.pickNewTarget();
    }
    pickNewTarget() {
      const r = Math.random;
      this.target.set((r() * 2 - 1) * (1 - this.margin), (r() * 2 - 1) * (1 - this.margin));
    }
    forceStop() {
      this.active = false;
      this.mouse.isAutoActive = false;
    }
    update() {
      if (!this.enabled) return;
      const now = performance.now();
      const idle = now - this.manager.lastUserInteraction;
      if (idle < this.resumeDelay) {
        if (this.active) this.forceStop();
        return;
      }
      if (this.mouse.isHoverInside) {
        if (this.active) this.forceStop();
        return;
      }
      if (!this.active) {
        this.active = true;
        this.current.copy(this.mouse.coords);
        this.lastTime = now;
        this.activationTime = now;
      }
      if (!this.active) return;
      this.mouse.isAutoActive = true;
      let dtSec = (now - this.lastTime) / 1000;
      this.lastTime = now;
      if (dtSec > 0.2) dtSec = 0.016;
      const dir = this._tmpDir.subVectors(this.target, this.current);
      const dist = dir.length();
      if (dist < 0.01) {
        this.pickNewTarget();
        return;
      }
      dir.normalize();
      let ramp = 1;
      if (this.rampDurationMs > 0) {
        const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs);
        ramp = t * t * (3 - 2 * t);
      }
      const step = this.speed * dtSec * ramp;
      const move = Math.min(step, dist);
      this.current.addScaledVector(dir, move);
      this.mouse.setNormalized(this.current.x, this.current.y);
    }
  }

  /**
   * Every uniform this simulation binds is one of these. Naming the union means
   * assigning e.g. a string to `dt.value` is a compile error rather than a
   * silently-wrong shader.
   */
  type UniformValue =
    | number
    | boolean
    | THREE.Vector2
    | THREE.Vector4
    | THREE.Texture
    | null
    // `undefined` is in the union because SimPassProps' fields are optional per
    // pass — Divergence binds no `dt`, ExternalForce no `boundarySpace`. three
    // leaves such a uniform unset rather than erroring.
    | undefined;
  type Uniforms = Record<string, { value: UniformValue }>;

  /**
   * What a ShaderPass is constructed with. `output0`/`output1` are the
   * ping-pong pair the two iterative passes (Viscous, Poisson) alternate
   * between; the single-shot passes leave them undefined.
   */
  interface ShaderPassProps {
    material?: THREE.ShaderMaterialParameters & { uniforms?: Uniforms };
    output?: THREE.WebGLRenderTarget | null;
    output0?: THREE.WebGLRenderTarget | null;
    output1?: THREE.WebGLRenderTarget | null;
  }

  /**
   * The union of fields the six passes read off their constructor argument.
   * The render targets are nullable because Simulation.fbos holds them that way
   * until createAllFBO runs — which init() always does before createShaderPass,
   * hence the non-null assertions at the .texture reads below.
   */
  interface SimPassProps {
    cellScale: THREE.Vector2;
    boundarySpace?: THREE.Vector2;
    fboSize?: THREE.Vector2;
    src?: THREE.WebGLRenderTarget | null;
    dst?: THREE.WebGLRenderTarget | null;
    dst_?: THREE.WebGLRenderTarget | null;
    src_p?: THREE.WebGLRenderTarget | null;
    src_v?: THREE.WebGLRenderTarget | null;
    dt?: number;
    viscous?: number;
    cursor_size?: number;
  }

  class ShaderPass {
    props: ShaderPassProps;
    uniforms?: Uniforms;
    scene: THREE.Scene | null = null;
    camera: THREE.Camera | null = null;
    material: THREE.RawShaderMaterial | null = null;
    geometry: THREE.BufferGeometry | null = null;
    plane: THREE.Mesh | null = null;
    constructor(props: ShaderPassProps) {
      this.props = props || {};
      this.uniforms = this.props.material?.uniforms;
    }
    init(..._args: unknown[]) {
      this.scene = new THREE.Scene();
      this.camera = new THREE.Camera();
      if (this.uniforms) {
        this.material = new THREE.RawShaderMaterial(this.props.material);
        this.geometry = new THREE.PlaneGeometry(2, 2);
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
      }
    }
    update(..._args: unknown[]) {
      if (!Common.renderer || !this.scene || !this.camera) return;
      Common.renderer.setRenderTarget(this.props.output || null);
      Common.renderer.render(this.scene, this.camera);
      Common.renderer.setRenderTarget(null);
    }
  }

  class Advection extends ShaderPass {
    line!: THREE.LineSegments;
    constructor(simProps: SimPassProps) {
      super({
        material: {
          vertexShader: face_vert,
          fragmentShader: advection_frag,
          uniforms: {
            boundarySpace: { value: simProps.cellScale },
            px: { value: simProps.cellScale },
            fboSize: { value: simProps.fboSize },
            velocity: { value: simProps.src!.texture },
            dt: { value: simProps.dt },
            isBFECC: { value: true }
          }
        },
        output: simProps.dst
      });
      this.uniforms = this.props.material!.uniforms;
      this.init();
    }
    init() {
      super.init();
      this.createBoundary();
    }
    createBoundary() {
      const boundaryG = new THREE.BufferGeometry();
      const vertices_boundary = new Float32Array([
        -1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0
      ]);
      boundaryG.setAttribute('position', new THREE.BufferAttribute(vertices_boundary, 3));
      const boundaryM = new THREE.RawShaderMaterial({
        vertexShader: line_vert,
        fragmentShader: advection_frag,
        uniforms: this.uniforms!
      });
      this.line = new THREE.LineSegments(boundaryG, boundaryM);
      this.scene!.add(this.line);
    }
    update(...args: unknown[]) {
      const { dt, isBounce, BFECC } = (args[0] || {}) as { dt?: number; isBounce?: boolean; BFECC?: boolean };
      if (!this.uniforms) return;
      if (typeof dt === 'number') this.uniforms.dt.value = dt;
      if (typeof isBounce === 'boolean') this.line.visible = isBounce;
      if (typeof BFECC === 'boolean') this.uniforms.isBFECC.value = BFECC;
      super.update();
    }
  }

  class ExternalForce extends ShaderPass {
    mouse!: THREE.Mesh;
    constructor(simProps: SimPassProps) {
      super({ output: simProps.dst });
      this.init(simProps);
    }
    init(simProps: SimPassProps) {
      super.init();
      const mouseG = new THREE.PlaneGeometry(1, 1);
      const mouseM = new THREE.RawShaderMaterial({
        vertexShader: mouse_vert,
        fragmentShader: externalForce_frag,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          px: { value: simProps.cellScale },
          force: { value: new THREE.Vector2(0, 0) },
          center: { value: new THREE.Vector2(0, 0) },
          scale: { value: new THREE.Vector2(simProps.cursor_size, simProps.cursor_size) }
        }
      });
      this.mouse = new THREE.Mesh(mouseG, mouseM);
      this.scene!.add(this.mouse);
    }
    update(...args: unknown[]) {
      const props = (args[0] || {}) as {
        mouse_force?: number;
        cursor_size?: number;
        cellScale?: THREE.Vector2;
      };
      const forceX = (Mouse.diff.x / 2) * (props.mouse_force || 0);
      const forceY = (Mouse.diff.y / 2) * (props.mouse_force || 0);
      const cellScale = props.cellScale || { x: 1, y: 1 };
      const cursorSize = props.cursor_size || 0;
      const cursorSizeX = cursorSize * cellScale.x;
      const cursorSizeY = cursorSize * cellScale.y;
      const centerX = Math.min(
        Math.max(Mouse.coords.x, -1 + cursorSizeX + cellScale.x * 2),
        1 - cursorSizeX - cellScale.x * 2
      );
      const centerY = Math.min(
        Math.max(Mouse.coords.y, -1 + cursorSizeY + cellScale.y * 2),
        1 - cursorSizeY - cellScale.y * 2
      );
      const uniforms = (this.mouse.material as THREE.RawShaderMaterial).uniforms;
      uniforms.force.value.set(forceX, forceY);
      uniforms.center.value.set(centerX, centerY);
      uniforms.scale.value.set(cursorSize, cursorSize);
      super.update();
    }
  }

  class Viscous extends ShaderPass {
    constructor(simProps: SimPassProps) {
      super({
        material: {
          vertexShader: face_vert,
          fragmentShader: viscous_frag,
          uniforms: {
            boundarySpace: { value: simProps.boundarySpace },
            velocity: { value: simProps.src!.texture },
            velocity_new: { value: simProps.dst_!.texture },
            v: { value: simProps.viscous },
            px: { value: simProps.cellScale },
            dt: { value: simProps.dt }
          }
        },
        output: simProps.dst,
        output0: simProps.dst_,
        output1: simProps.dst
      });
      this.init();
    }
    update(...args: unknown[]) {
      const { viscous, iterations, dt } = (args[0] || {}) as { viscous?: number; iterations?: number; dt?: number };
      if (!this.uniforms) return;
      let fbo_in: THREE.WebGLRenderTarget | null | undefined = null;
      let fbo_out: THREE.WebGLRenderTarget | null | undefined = null;
      if (typeof viscous === 'number') this.uniforms.v.value = viscous;
      const iter = iterations ?? 0;
      for (let i = 0; i < iter; i++) {
        if (i % 2 === 0) {
          fbo_in = this.props.output0;
          fbo_out = this.props.output1;
        } else {
          fbo_in = this.props.output1;
          fbo_out = this.props.output0;
        }
        this.uniforms.velocity_new.value = fbo_in!.texture;
        this.props.output = fbo_out;
        if (typeof dt === 'number') this.uniforms.dt.value = dt;
        super.update();
      }
      return fbo_out;
    }
  }

  class Divergence extends ShaderPass {
    constructor(simProps: SimPassProps) {
      super({
        material: {
          vertexShader: face_vert,
          fragmentShader: divergence_frag,
          uniforms: {
            boundarySpace: { value: simProps.boundarySpace },
            velocity: { value: simProps.src!.texture },
            px: { value: simProps.cellScale },
            dt: { value: simProps.dt }
          }
        },
        output: simProps.dst
      });
      this.init();
    }
    update(...args: unknown[]) {
      const { vel } = (args[0] || {}) as { vel?: THREE.WebGLRenderTarget | null };
      if (this.uniforms && vel) {
        this.uniforms.velocity.value = vel.texture;
      }
      super.update();
    }
  }

  class Poisson extends ShaderPass {
    constructor(simProps: SimPassProps) {
      super({
        material: {
          vertexShader: face_vert,
          fragmentShader: poisson_frag,
          uniforms: {
            boundarySpace: { value: simProps.boundarySpace },
            pressure: { value: simProps.dst_!.texture },
            divergence: { value: simProps.src!.texture },
            px: { value: simProps.cellScale }
          }
        },
        output: simProps.dst,
        output0: simProps.dst_,
        output1: simProps.dst
      });
      this.init();
    }
    update(...args: unknown[]) {
      const { iterations } = (args[0] || {}) as { iterations?: number };
      let p_in: THREE.WebGLRenderTarget | null | undefined = null;
      let p_out: THREE.WebGLRenderTarget | null | undefined = null;
      const iter = iterations ?? 0;
      for (let i = 0; i < iter; i++) {
        if (i % 2 === 0) {
          p_in = this.props.output0;
          p_out = this.props.output1;
        } else {
          p_in = this.props.output1;
          p_out = this.props.output0;
        }
        if (this.uniforms) this.uniforms.pressure.value = p_in!.texture;
        this.props.output = p_out;
        super.update();
      }
      return p_out;
    }
  }

  class Pressure extends ShaderPass {
    constructor(simProps: SimPassProps) {
      super({
        material: {
          vertexShader: face_vert,
          fragmentShader: pressure_frag,
          uniforms: {
            boundarySpace: { value: simProps.boundarySpace },
            pressure: { value: simProps.src_p!.texture },
            velocity: { value: simProps.src_v!.texture },
            px: { value: simProps.cellScale },
            dt: { value: simProps.dt }
          }
        },
        output: simProps.dst
      });
      this.init();
    }
    update(...args: unknown[]) {
      const { vel, pressure } = (args[0] || {}) as {
        vel?: THREE.WebGLRenderTarget | null;
        pressure?: THREE.WebGLRenderTarget | null;
      };
      if (this.uniforms && vel && pressure) {
        this.uniforms.velocity.value = vel.texture;
        this.uniforms.pressure.value = pressure.texture;
      }
      super.update();
    }
  }

  class Simulation {
    options: SimOptions;
    fbos: Record<string, THREE.WebGLRenderTarget | null> = {
      vel_0: null,
      vel_1: null,
      vel_viscous0: null,
      vel_viscous1: null,
      div: null,
      pressure_0: null,
      pressure_1: null
    };
    fboSize = new THREE.Vector2();
    cellScale = new THREE.Vector2();
    boundarySpace = new THREE.Vector2();
    advection!: Advection;
    externalForce!: ExternalForce;
    viscous!: Viscous;
    divergence!: Divergence;
    poisson!: Poisson;
    pressure!: Pressure;
    constructor(options?: Partial<SimOptions>) {
      this.options = {
        iterations_poisson: 32,
        iterations_viscous: 32,
        mouse_force: 20,
        resolution: 0.5,
        cursor_size: 100,
        viscous: 30,
        isBounce: false,
        dt: 0.014,
        isViscous: false,
        BFECC: true,
        ...options
      };
      this.init();
    }
    init() {
      this.calcSize();
      this.createAllFBO();
      this.createShaderPass();
    }
    getFloatType() {
      const isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
      return isIOS ? THREE.HalfFloatType : THREE.FloatType;
    }
    createAllFBO() {
      const type = this.getFloatType();
      const opts = {
        type,
        depthBuffer: false,
        stencilBuffer: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping
      } as const;
      for (const key in this.fbos) {
        this.fbos[key] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, opts);
      }
    }
    createShaderPass() {
      this.advection = new Advection({
        cellScale: this.cellScale,
        fboSize: this.fboSize,
        dt: this.options.dt,
        src: this.fbos.vel_0,
        dst: this.fbos.vel_1
      });
      this.externalForce = new ExternalForce({
        cellScale: this.cellScale,
        cursor_size: this.options.cursor_size,
        dst: this.fbos.vel_1
      });
      this.viscous = new Viscous({
        cellScale: this.cellScale,
        boundarySpace: this.boundarySpace,
        viscous: this.options.viscous,
        src: this.fbos.vel_1,
        dst: this.fbos.vel_viscous1,
        dst_: this.fbos.vel_viscous0,
        dt: this.options.dt
      });
      this.divergence = new Divergence({
        cellScale: this.cellScale,
        boundarySpace: this.boundarySpace,
        src: this.fbos.vel_viscous0,
        dst: this.fbos.div,
        dt: this.options.dt
      });
      this.poisson = new Poisson({
        cellScale: this.cellScale,
        boundarySpace: this.boundarySpace,
        src: this.fbos.div,
        dst: this.fbos.pressure_1,
        dst_: this.fbos.pressure_0
      });
      this.pressure = new Pressure({
        cellScale: this.cellScale,
        boundarySpace: this.boundarySpace,
        src_p: this.fbos.pressure_0,
        src_v: this.fbos.vel_viscous0,
        dst: this.fbos.vel_0,
        dt: this.options.dt
      });
    }
    calcSize() {
      const width = Math.max(1, Math.round(this.options.resolution * Common.width));
      const height = Math.max(1, Math.round(this.options.resolution * Common.height));
      this.cellScale.set(1 / width, 1 / height);
      this.fboSize.set(width, height);
    }
    resize() {
      this.calcSize();
      for (const key in this.fbos) {
        this.fbos[key]!.setSize(this.fboSize.x, this.fboSize.y);
      }
    }
    update() {
      if (this.options.isBounce) this.boundarySpace.set(0, 0);
      else this.boundarySpace.copy(this.cellScale);
      this.advection.update({ dt: this.options.dt, isBounce: this.options.isBounce, BFECC: this.options.BFECC });
      this.externalForce.update({
        cursor_size: this.options.cursor_size,
        mouse_force: this.options.mouse_force,
        cellScale: this.cellScale
      });
      let vel: THREE.WebGLRenderTarget | null | undefined = this.fbos.vel_1;
      if (this.options.isViscous) {
        vel = this.viscous.update({
          viscous: this.options.viscous,
          iterations: this.options.iterations_viscous,
          dt: this.options.dt
        });
      }
      this.divergence.update({ vel });
      const pressure = this.poisson.update({ iterations: this.options.iterations_poisson });
      this.pressure.update({ vel, pressure });
    }
  }

  class Output {
    simulation: Simulation;
    scene: THREE.Scene;
    camera: THREE.Camera;
    output: THREE.Mesh;
    constructor() {
      this.simulation = new Simulation();
      this.scene = new THREE.Scene();
      this.camera = new THREE.Camera();
      this.output = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.RawShaderMaterial({
          vertexShader: face_vert,
          fragmentShader: color_frag,
          transparent: true,
          depthWrite: false,
          uniforms: {
            velocity: { value: this.simulation.fbos.vel_0!.texture },
            boundarySpace: { value: new THREE.Vector2() },
            palette: { value: paletteTex },
            bgColor: { value: bgVec4 }
          }
        })
      );
      this.scene.add(this.output);
    }
    resize() {
      this.simulation.resize();
    }
    render() {
      if (!Common.renderer) return;
      Common.renderer.setRenderTarget(null);
      Common.renderer.render(this.scene, this.camera);
    }
    update() {
      this.simulation.update();
      this.render();
    }
  }

  /** What createLiquidEther hands the manager — a subset of LiquidEtherConfig
   *  plus the mount element. */
  interface WebGLManagerProps {
    $wrapper: HTMLElement;
    autoDemo: boolean;
    autoSpeed: number;
    autoIntensity: number;
    takeoverDuration: number;
    autoResumeDelay: number;
    autoRampDuration: number;
  }

  class WebGLManager implements LiquidEtherWebGL {
    props: WebGLManagerProps;
    output!: Output;
    autoDriver?: AutoDriver;
    lastUserInteraction = performance.now();
    running = false;
    private _loop = this.loop.bind(this);
    private _resize = this.resize.bind(this);
    private _onVisibility?: () => void;
    constructor(props: WebGLManagerProps) {
      this.props = props;
      Common.init(props.$wrapper);
      Mouse.init(props.$wrapper);
      Mouse.autoIntensity = props.autoIntensity;
      Mouse.takeoverDuration = props.takeoverDuration;
      Mouse.onInteract = () => {
        this.lastUserInteraction = performance.now();
        if (this.autoDriver) this.autoDriver.forceStop();
      };
      this.autoDriver = new AutoDriver(Mouse, this, {
        enabled: props.autoDemo,
        speed: props.autoSpeed,
        resumeDelay: props.autoResumeDelay,
        rampDuration: props.autoRampDuration
      });
      this.init();
      window.addEventListener('resize', this._resize);
      this._onVisibility = () => {
        const hidden = document.hidden;
        if (hidden) {
          this.pause();
        } else if (config.isElementVisible() && !config.isPaused()) {
          this.start();
        }
      };
      document.addEventListener('visibilitychange', this._onVisibility);
    }
    init() {
      if (!Common.renderer) return;
      this.props.$wrapper.prepend(Common.renderer.domElement);
      this.output = new Output();
    }
    resize() {
      Common.resize();
      this.output.resize();
    }
    render() {
      const scrollVelocity = config.getScrollVelocity();
      const velAbs = Math.abs(scrollVelocity);
      const velocityFactor = Math.min(velAbs / 1500, 1.0);

      // Dynamically adjust options in the simulation based on velocity
      const sim = this.output?.simulation;
      if (sim) {
        sim.options.mouse_force = config.mouseForce + velocityFactor * 30;
        if (config.isViscous) {
          sim.options.viscous = config.viscous * (1.0 - velocityFactor * 0.5);
        }
      }

      // Apply scroll pull force (negative Y direction when scrolling down)
      Mouse.scrollDiffY = scrollVelocity * -0.00015;

      if (this.autoDriver) this.autoDriver.update();
      Mouse.update();
      Common.update();
      this.output.update();
    }
    loop() {
      if (!this.running) return;
      this.render();
      rafId = requestAnimationFrame(this._loop);
    }
    start() {
      if (this.running) return;
      this.running = true;
      this._loop();
    }
    pause() {
      this.running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
    dispose() {
      try {
        this.pause();
        window.removeEventListener('resize', this._resize);
        if (this._onVisibility) document.removeEventListener('visibilitychange', this._onVisibility);
        Mouse.dispose();
        if (Common.renderer) {
          const canvas = Common.renderer.domElement;
          if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
          // dispose only — forceContextLoss() counts as a page-caused context
          // loss, and enough of those get the document blocked from creating
          // any further WebGL context. See three/webglGuard.ts.
          releaseRenderer(Common.renderer);
          Common.renderer = null;
        }
      } catch {
        /* noop */
      }
    }
  }

  // Claim the WebGL context before building anything on top of it. If the
  // browser refuses one there is nothing to construct — return null and let the
  // caller keep its static placeholder rather than throwing into the app's
  // ErrorBoundary.
  if (!Common.init(mountContainer)) return null;

  return new WebGLManager({
    $wrapper: mountContainer,
    autoDemo: config.autoDemo,
    autoSpeed: config.autoSpeed,
    autoIntensity: config.autoIntensity,
    takeoverDuration: config.takeoverDuration,
    autoResumeDelay: config.autoResumeDelay,
    autoRampDuration: config.autoRampDuration
  });
}
