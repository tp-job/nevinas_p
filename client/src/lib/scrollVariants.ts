import { Variants } from 'framer-motion'

/** Fade up — card, section ทั่วไป */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

/** Fade in — text, label ที่ไม่ต้องการ movement */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
}

/** Slide left — sidebar item, timeline */
export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -20 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.50, ease: [0.22, 1, 0.36, 1] },
  },
}

/** Scale in — icon gem, avatar, badge */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }, // spring
  },
}

/** Stagger container — ใช้กับ parent ของ list/grid */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
}
