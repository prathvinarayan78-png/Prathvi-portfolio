import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/* Chunky marquee — speeds up on hover AND skews with scroll velocity. */

export function Marquee({
  items,
  className = '',
  speed = 18,
  reverse = false,
}: {
  items: string[]
  className?: string
  speed?: number
  reverse?: boolean
}) {
  const inner = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!inner.current) return
    let lastY = scrollY
    let raf = 0
    // one persistent tween, retargeted — no per-frame tween creation
    const skewTo = gsap.quickTo(inner.current, 'skewX', { duration: 0.3, ease: 'power2.out' })
    const tick = () => {
      const v = scrollY - lastY
      lastY = scrollY
      skewTo(gsap.utils.clamp(-14, 14, v * 0.6))
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])

  const row = items.flatMap((s) => [s, '★'])
  return (
    <div className={`marq-wrap overflow-hidden border-y-[3px] border-current py-3 md:py-4 ${className}`}>
      <div ref={inner} className="will-change-transform">
        <div
          className="marq flex whitespace-nowrap items-center gap-6 font-black text-lg md:text-2xl uppercase"
          style={{ ['--spd' as string]: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
        >
          {[...row, ...row, ...row, ...row].map((s, i) =>
            s === '★' ? (
              <span key={i} className="text-[#ff4d00]">★</span>
            ) : (
              <span
                key={i}
                className={(i >> 1) % 3 === 1 ? 'txt-outline-thin' : ''}
                style={(i >> 1) % 3 === 2 ? { color: '#ff4d00' } : undefined}
              >
                {s}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
