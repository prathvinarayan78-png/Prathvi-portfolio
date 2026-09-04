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
    let lastY = scrollY
    let raf = 0
    const tick = () => {
      const v = scrollY - lastY
      lastY = scrollY
      const skew = gsap.utils.clamp(-14, 14, v * 0.6)
      if (inner.current) {
        gsap.to(inner.current, { skewX: skew, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
      }
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
                style={
                  (i >> 1) % 3 === 1
                    ? { WebkitTextStroke: '1.5px currentColor', color: 'transparent' }
                    : (i >> 1) % 3 === 2
                      ? { color: '#ff4d00' }
                      : undefined
                }
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
