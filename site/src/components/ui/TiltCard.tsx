import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'

/* 3D tilt + moving glare sheen. Wrap any card in it. */

export function TiltCard({ children, max = 10, className = '' }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const glare = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const el = ref.current!
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.55, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.55, ease: 'power3.out' })
    const gx = gsap.quickTo(glare.current, 'xPercent', { duration: 0.55, ease: 'power3.out' })
    const gy = gsap.quickTo(glare.current, 'yPercent', { duration: 0.55, ease: 'power3.out' })
    const go = gsap.quickTo(glare.current, 'opacity', { duration: 0.4 })

    gsap.set(el, { transformPerspective: 900 })

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      ry(px * max); rx(-py * max)
      gx(px * 120); gy(py * 120); go(1)
    }
    const leave = () => { rx(0); ry(0); go(0) }
    el.addEventListener('mousemove', move, { passive: true })
    el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) }
  }, [max])

  return (
    <div ref={ref} className={`relative will-change-transform ${className}`}>
      {children}
      <div
        ref={glare}
        aria-hidden
        className="absolute inset-[-40%] pointer-events-none opacity-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.14) 0%, transparent 55%)',
        }}
      />
    </div>
  )
}
