import { useTypewriter } from '@/hooks/useTypewriter'
import { ElementType } from 'react'

interface Props {
  as?: ElementType               // 'h1' | 'h2' | 'h3' (default: 'h1')
  words: string[]
  staticPrefix?: string          // ข้อความก่อน typewriter เช่น "Hi, I'm "
  className?: string
  cursorClassName?: string
  speed?: number
  pause?: number
}

export function TypewriterHeading({
  as: Tag = 'h1',
  words,
  staticPrefix = '',
  className = '',
  cursorClassName = '',
  speed,
  pause,
}: Props) {
  const text = useTypewriter({ words, speed, pause })

  return (
    <Tag className={className}>
      {staticPrefix}
      <span>{text}</span>
      <span
        className={`inline-block w-[2px] h-[1em] ml-0.5 align-middle
                    bg-current animate-[blink_1s_ease-in-out_infinite]
                    ${cursorClassName}`}
      />
    </Tag>
  )
}
