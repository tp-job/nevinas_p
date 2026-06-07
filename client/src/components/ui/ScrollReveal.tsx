import { motion, useTransform, MotionValue, type Variants } from 'framer-motion'
import { useScrollReveal }  from '@/hooks/useScrollReveal'
import { fadeUp }           from '@/lib/scrollVariants'
import { type ReactNode }   from 'react'
import { useSlideScroll }   from '../homepage/SlideWrapper'

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
  const slideProgress = useSlideScroll()
  const { ref, isInView } = useScrollReveal({ once })

  // Map scroll progress if slideProgress is available
  // The slide transitions between 0.3 (entering) and 0.7 (leaving)
  const opacity = useTransform(
    slideProgress || new MotionValue(0),
    [0.3, 0.45, 0.55, 0.7],
    [0, 1, 1, 0]
  )
  
  const y = useTransform(
    slideProgress || new MotionValue(0),
    [0.3, 0.5, 0.7],
    [40, 0, -40]
  )

  if (slideProgress) {
    return (
      <motion.div
        style={{ opacity, y }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

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
