import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/* Cursor spotlight — a soft radial glow that follows the mouse over
   the whole page, brightening whatever you're reading. */

export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const xTo = gsap.quickTo(ref.current, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(ref.current, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = (e: MouseEvent) => { xTo(e.clientX); yTo(e.clientY) }
    addEventListener('mousemove', move, { passive: true })
    return () => removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed left-0 top-0 z-[5] pointer-events-none hidden md:block will-change-transform"
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 w-[46vw] h-[46vw] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(68,136,255,0.07) 0%, rgba(255,170,51,0.04) 35%, transparent 65%)',
        }}
      />
    </div>
  )
}
