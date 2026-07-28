import * as THREE from 'three'

/**
 * Central gate for every WebGL context this app creates.
 *
 * Two production failures motivate this module, both visible in the Render
 * deployment's console as:
 *
 *   THREE.WebGLRenderer: A WebGL context could not be created.
 *   Reason: Web page caused context loss and was blocked
 *
 * 1. **The block itself.** Chrome counts context losses that the PAGE caused —
 *    i.e. every `renderer.forceContextLoss()` call. Past a small threshold it
 *    stops honouring `getContext('webgl')` for the rest of the document's life.
 *    Our loading screen is the router's Suspense fallback, so it mounted and
 *    unmounted a full-screen LaserFlow context on every lazy route transition;
 *    a handful of navigations was enough to trip the guard. `dispose()` frees
 *    the GPU resources on its own — `forceContextLoss()` buys nothing here and
 *    is what gets the page blacklisted, so `releaseRenderer()` below never
 *    calls it.
 *
 * 2. **The crash.** `new THREE.WebGLRenderer()` THROWS when the context can't
 *    be created. Every call site did that inside a `useEffect` with no
 *    try/catch, so the throw reached the router's ErrorBoundary and replaced
 *    the entire portfolio with the 500 page — a decorative background taking
 *    the whole site down. `createGuardedRenderer()` returns `null` instead;
 *    callers bail out and the CSS fallback layers carry the look.
 *
 * Once creation fails once, it will fail for every later attempt on this
 * document, so the failure is latched and subsequent calls short-circuit
 * without touching the GPU process again.
 */

/** Set the first time context creation fails; never cleared for this document. */
let blocked = false

/**
 * Live contexts we hold. Chrome evicts the oldest past ~16 per page, which
 * triggers a context-loss event and feeds problem 1 above. Nothing here needs
 * more than a couple at a time, so cap well below the browser limit and treat
 * hitting it as a bug we degrade around rather than crash on.
 */
const live = new Set<THREE.WebGLRenderer>()
const MAX_LIVE_CONTEXTS = 4

/** True once the browser has refused us a context. */
export function isWebGLBlocked(): boolean {
  return blocked
}

/**
 * Cheap pre-flight check for gating UI *before* paying for three.js.
 *
 * Uses a throwaway 1x1 canvas, which does not count against the live-context
 * budget in any meaningful way and is released immediately.
 */
export function isWebGLAvailable(): boolean {
  if (blocked) return false
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return false
    // Hand the context back right away — this probe must not hold one open.
    ;(gl.getExtension('WEBGL_lose_context') as { loseContext(): void } | null)?.loseContext()
    return true
  } catch {
    return false
  }
}

/**
 * Create a renderer, or return `null` if the browser won't give us a context.
 *
 * Callers MUST handle `null` — that is the whole point. Never let a missing
 * decorative effect propagate as an exception.
 */
export function createGuardedRenderer(
  params?: THREE.WebGLRendererParameters,
): THREE.WebGLRenderer | null {
  if (blocked) return null

  if (live.size >= MAX_LIVE_CONTEXTS) {
    console.warn(
      `[webglGuard] Refusing a new WebGL context — ${live.size} already live. ` +
        'Something is leaking renderers; check that every effect calls releaseRenderer() on unmount.',
    )
    return null
  }

  try {
    const renderer = new THREE.WebGLRenderer(params)
    live.add(renderer)
    return renderer
  } catch (err) {
    blocked = true
    console.warn(
      '[webglGuard] WebGL context creation failed; all GPU effects are disabled for this page load.',
      err,
    )
    return null
  }
}

/**
 * Tear a renderer down.
 *
 * `dispose()` only — deliberately NOT `forceContextLoss()`. See the note at the
 * top of this file: the forced loss is what got the page blocked in production.
 * Dropping our last reference lets the browser reclaim the context on its own
 * schedule, without counting it as a page-caused loss.
 */
export function releaseRenderer(renderer: THREE.WebGLRenderer | null | undefined): void {
  if (!renderer) return
  live.delete(renderer)
  try {
    renderer.dispose()
  } catch {
    /* a renderer whose context is already gone throws here; nothing to clean up */
  }
}
