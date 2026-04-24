import { motion, Variants } from 'framer-motion'
import { useScrollReveal }  from '@/hooks/useScrollReveal'
import { fadeUp }           from '@/lib/scrollVariants'
import { ReactNode }        from 'react'

interface Props {
  children:  ReactNode
  variants?: Variants
  delay?:    number
  className?: string
  once?:     boolean
}

export function ScrollReveal({
  children,
  variants = fadeUp,
  delay    = 0,
  className,
  once     = true,
}: Props) {
  const { ref, isInView } = useScrollReveal({ once })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
