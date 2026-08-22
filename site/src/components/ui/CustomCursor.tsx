import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useAppStore } from '../../stores/useAppStore'

/* Ultra-smooth cursor: gsap.quickTo (no tween churn), xPercent centering,
   scale pop on press. */

export function CursorProvider() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useAppStore((s) => s.cursorLabel)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power2.out' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power2.out' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' })

    const move = (e: MouseEvent) => {
      dx(e.clientX); dy(e.clientY)
      rx(e.clientX); ry(e.clientY)
    }
    const down = () => gsap.to(ring.current, { scale: 0.8, duration: 0.2, ease: 'power2.out' })
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.35, ease: 'elastic.out(1,0.5)' })

    addEventListener('mousemove', move, { passive: true })
    addEventListener('mousedown', down)
    addEventListener('mouseup', up)
    return () => {
      removeEventListener('mousemove', move)
      removeEventListener('mousedown', down)
      removeEventListener('mouseup', up)
    }
  }, [])

  const active = label !== ''

  return (
    <>
      <div ref={dot} className="fixed left-0 top-0 z-[95] pointer-events-none hidden md:block will-change-transform">
        <div className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-200 ${active ? 'w-0 h-0' : 'w-1.5 h-1.5'}`} />
      </div>
      <div ref={ring} className="fixed left-0 top-0 z-[94] pointer-events-none hidden md:flex will-change-transform">
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border flex items-center justify-center font-mono text-[10px] tracking-[0.2em] transition-all duration-300 ${
            active
              ? 'w-20 h-20 bg-white text-black border-white'
              : 'w-8 h-8 border-white/30 text-transparent'
          }`}
        >
          {label}
        </div>
      </div>
    </>
  )
}

export function useCursorLabel(text: string) {
  const setCursorLabel = useAppStore((s) => s.setCursorLabel)
  return {
    onMouseEnter: () => setCursorLabel(text),
    onMouseLeave: () => setCursorLabel(''),
  }
}
