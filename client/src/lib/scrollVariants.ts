import type { Variants } from 'framer-motion'

/** Fade up — card, section ทั่วไป */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

/** Stagger container — ใช้กับ parent ของ list/grid */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
}
