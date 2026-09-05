import { useEffect, useState } from 'react'

/**
 * Device performance tier, used to decide whether an effect is affordable.
 *
 * - `low`  — budget hardware, data-saver, reduced-motion, or a mobile device.
 *            Skip GPU/CPU-heavy work entirely and render the cheap fallback.
 * - `high` — a desktop/laptop that can carry the full effects.
 */
export type DeviceTier = 'low' | 'high'

export interface DeviceProfile {
  /** Overall "can this device afford heavy work" judgment. */
  tier: DeviceTier
  /**
   * True for phones and tablets — a touch-primary device.
   *
   * Kept SEPARATE from `tier` on purpose. Some effects are skipped because the
   * device is weak (a `tier` question), and others because a full-screen
   * simulation is simply the wrong thing to run on a handheld regardless of how
   * fast its chip is — battery, thermals, and competing with scroll for the
   * main thread. Consumers should pick the signal that matches their reason.
   */
  isMobile: boolean
  /** The user's prefers-reduced-motion setting. Always honour this. */
  reducedMotion: boolean
}

/**
 * Narrow typings for the capability APIs we probe. These are widely shipped on
 * Chromium (which is what low-end Android overwhelmingly runs) but are absent
 * from lib.dom.d.ts, and missing on Safari/Firefox — every read is optional and
 * has a defined fallback below.
 */
interface NavigatorCapabilities {
  deviceMemory?: number
  hardwareConcurrency?: number
  connection?: { saveData?: boolean; effectiveType?: string }
}

/** Treat <= 4 GB RAM as memory-constrained. */
const LOW_MEMORY_GB = 4
/** Treat <= 4 logical cores as CPU-constrained. */
const LOW_CORE_COUNT = 4

/**
 * Is this a phone or tablet?
 *
 * `(pointer: coarse)` describes the PRIMARY input device, so it matches phones
 * and tablets but not a touchscreen laptop being driven by its trackpad — which
 * is exactly the line we want. Viewport width is only a fallback for engines
 * that don't support the pointer media query.
 *
 * This also covers a Lighthouse blind spot: its mobile profile emulates a small
 * touch screen and throttles CPU 4x, but leaves navigator.deviceMemory /
 * hardwareConcurrency reporting the HOST machine. A 16 GB / 16-core dev box
 * therefore looked like a capable device under a mobile audit and still paid
 * ~1.9 s of WebGL script evaluation. Screen/input class is the honest signal.
 */
function detectMobile(): boolean {
  if (typeof window === 'undefined') return true
  const mq = window.matchMedia?.('(pointer: coarse)')
  if (mq) return mq.matches
  return window.innerWidth < 768
}

function detectProfile(): DeviceProfile {
  // SSR / non-browser: assume the constrained case so we never schedule heavy
  // work speculatively.
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { tier: 'low', isMobile: true, reducedMotion: false }
  }

  const nav = navigator as Navigator & NavigatorCapabilities
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const isMobile = detectMobile()

  const tier: DeviceTier = (() => {
    // An explicit accessibility preference outranks every hardware signal.
    if (reducedMotion) return 'low'

    // Data-saver, or a connection too slow to justify a WebGL payload.
    const conn = nav.connection
    if (conn?.saveData) return 'low'
    if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return 'low'

    if (isMobile) return 'low'

    // Hardware limits, for laptops/desktops that are genuinely constrained.
    // `deviceMemory` is capped at 8 by the spec and rounded down to a power of
    // two, so <= 4 reliably identifies budget hardware.
    if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= LOW_MEMORY_GB) return 'low'
    if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= LOW_CORE_COUNT)
      return 'low'

    return 'high'
  })()

  return { tier, isMobile, reducedMotion }
}

/** Conservative initial state — upgraded after mount once we can probe. */
const INITIAL: DeviceProfile = { tier: 'low', isMobile: true, reducedMotion: false }

/**
 * Reports what this device can afford.
 *
 * Starts constrained and relaxes after mount. Deliberately pessimistic: first
 * paint is the moment a device is most contended, so we never kick off WebGL
 * before we know it can take it, and relaxing costs only one extra render.
 */
export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(INITIAL)

  useEffect(() => {
    setProfile(detectProfile())

    // Re-evaluate if the user flips reduced-motion, or if the primary pointer
    // changes (e.g. a 2-in-1 docking to a mouse).
    const queries = [
      window.matchMedia?.('(prefers-reduced-motion: reduce)'),
      window.matchMedia?.('(pointer: coarse)'),
    ].filter(Boolean) as MediaQueryList[]

    const onChange = () => setProfile(detectProfile())
    queries.forEach((q) => q.addEventListener('change', onChange))
    return () => queries.forEach((q) => q.removeEventListener('change', onChange))
  }, [])

  return profile
}

/** Convenience wrapper for consumers that only care about the tier. */
export function useDeviceCapability(): DeviceTier {
  return useDeviceProfile().tier
}

