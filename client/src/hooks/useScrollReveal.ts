import { useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface Options {
  once?:      boolean  // animate once only (default: true)
  amount?:    number   // % of element visible to trigger (default: 0.2)
  margin?:    string   // rootMargin (default: '0px 0px -60px 0px')
}

export function useScrollReveal({
  once   = true,
  amount = 0.2,
  margin = '0px 0px -60px 0px',
}: Options = {}) {
  const ref = useRef(null)
  const scrollRoot = useRef<HTMLElement | null>(null)

  useEffect(() => {
    scrollRoot.current = document.getElementById('homepage-scroll')
  }, [])

  const isInView = useInView(ref, {
    once,
    amount,
    margin,
    root: scrollRoot,
  })
  return { ref, isInView }
}
