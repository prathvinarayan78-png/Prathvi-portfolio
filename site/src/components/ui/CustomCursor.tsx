import { useEffect, useRef } from 'react'
import { useAppStore } from '../../stores/useAppStore'

/* Dot cursor that morphs into a labelled circle over interactive targets. */

export function CursorProvider() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useAppStore((s) => s.cursorLabel)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    let x = innerWidth / 2, y = innerHeight / 2
    let rx = x, ry = y
    let raf: number

    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY }
    addEventListener('mousemove', move, { passive: true })

    const tick = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])

  const active = label !== ''

  return (
    <>
      <div
        ref={dot}
        className="fixed left-0 top-0 z-[95] pointer-events-none -ml-[3px] -mt-[3px] hidden md:block"
      >
        <div className={`rounded-full bg-white transition-all duration-200 ${active ? 'w-0 h-0' : 'w-1.5 h-1.5'}`} />
      </div>
      <div
        ref={ring}
        className="fixed left-0 top-0 z-[94] pointer-events-none hidden md:flex"
      >
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

/* helper — attach to any element */
export function useCursorLabel(text: string) {
  const setCursorLabel = useAppStore((s) => s.setCursorLabel)
  return {
    onMouseEnter: () => setCursorLabel(text),
    onMouseLeave: () => setCursorLabel(''),
  }
}
