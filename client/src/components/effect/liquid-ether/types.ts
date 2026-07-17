// Shared types for the LiquidEther component and its WebGL engine.

export interface SimOptions {
  iterations_poisson: number;
  iterations_viscous: number;
  mouse_force: number;
  resolution: number;
  cursor_size: number;
  viscous: number;
  isBounce: boolean;
  dt: number;
  isViscous: boolean;
  BFECC: boolean;
}

export interface LiquidEtherWebGL {
  output?: { simulation?: { options: SimOptions; resize: () => void } };
  autoDriver?: {
    enabled: boolean;
    speed: number;
    resumeDelay: number;
    rampDurationMs: number;
    mouse?: { autoIntensity: number; takeoverDuration: number };
    forceStop: () => void;
  };
  resize: () => void;
  start: () => void;
  pause: () => void;
  dispose: () => void;
}

/** Everything the WebGL engine needs from the React layer. */
export interface LiquidEtherConfig {
  mouseForce: number;
  cursorSize: number;
  isViscous: boolean;
  viscous: number;
  iterationsViscous: number;
  iterationsPoisson: number;
  dt: number;
  BFECC: boolean;
  resolution: number;
  isBounce: boolean;
  colors: string[];
  autoDemo: boolean;
  autoSpeed: number;
  autoIntensity: number;
  takeoverDuration: number;
  autoResumeDelay: number;
  autoRampDuration: number;
  /** Latest scroll velocity (px/s) from framer-motion's useVelocity. */
  getScrollVelocity: () => number;
  /** Whether the mount element is currently intersecting the viewport. */
  isElementVisible: () => boolean;
}
