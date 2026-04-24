import { useState, useEffect } from 'react'

interface UseTypewriterOptions {
  words: string[]
  speed?: number        // ms per character (default: 80)
  deleteSpeed?: number  // ms per character delete (default: 40)
  pause?: number        // ms pause after full word (default: 2000)
}

export function useTypewriter({
  words,
  speed = 80,
  deleteSpeed = 40,
  pause = 2000,
}: UseTypewriterOptions) {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex]     = useState(0)
  const [isDeleting, setIsDeleting]   = useState(false)
  const [isWaiting, setIsWaiting]     = useState(false)

  useEffect(() => {
    const current = words[wordIndex % words.length]

    if (isWaiting) return

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, displayText.length + 1))
        if (displayText.length + 1 === current.length) {
          setIsWaiting(true)
          setTimeout(() => {
            setIsWaiting(false)
            setIsDeleting(true)
          }, pause)
        }
      } else {
        setDisplayText(current.slice(0, displayText.length - 1))
        if (displayText.length === 0) {
          setIsDeleting(false)
          setWordIndex((i) => i + 1)
        }
      }
    }, isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, isWaiting, wordIndex, words, speed, deleteSpeed, pause])

  return displayText
}
