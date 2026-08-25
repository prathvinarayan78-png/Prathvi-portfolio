import { useRef, type ReactNode } from 'react'

/* Hover text-scramble — decodes to the real label like a cipher. */

const CHARS = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function Scramble({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const busy = useRef(false)

  const run = () => {
    if (busy.current || !ref.current) return
    busy.current = true
    const el = ref.current
    let frame = 0
    const total = Math.max(10, text.length * 2)

    const tick = () => {
      frame++
      const progress = frame / total
      el.textContent = text
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' '
          if (i < progress * text.length) return ch
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')
      if (frame < total) requestAnimationFrame(tick)
      else { el.textContent = text; busy.current = false }
    }
    requestAnimationFrame(tick)
  }

  return (
    <span ref={ref} className={className} onMouseEnter={run}>
      {text}
    </span>
  )
}

/* wrapper util so any parent can trigger scrambles on its children if needed */
export type ScrambleProps = { text: string; className?: string; children?: ReactNode }
