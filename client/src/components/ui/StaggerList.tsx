import { motion }           from 'framer-motion'
import type { Variants }    from 'framer-motion'
import { useScrollReveal }  from '@/hooks/useScrollReveal'
import { staggerContainer, fadeUp } from '@/lib/scrollVariants'
import type { ReactNode }   from 'react'

interface Props {
  children:  ReactNode
  className?: string
}

export function StaggerList({ children, className }: Props) {
  const { ref, isInView } = useScrollReveal({ amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** ใช้คู่กับ StaggerList เสมอ */
export function StaggerItem({ children, className, variants = fadeUp }: { children: ReactNode; className?: string; variants?: Variants }) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  )
}
