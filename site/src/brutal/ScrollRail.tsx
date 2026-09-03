import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* THE LOOP v3 — three counter-sliding rails, no pinning.
   Now with color-block words, tilt shear, and hover-invert rows. */

const ROWS: {
  word: string
  dir: 1 | -1
  style: 'fill' | 'stroke' | 'block'
  color?: string
}[] = [
  { word: 'DESIGN', dir: -1, style: 'fill' },
  { word: 'BUILD', dir: 1, style: 'block', color: '#ff4d00' },
  { word: 'EDIT', dir: -1, style: 'stroke' },
]

const MARKS = ['★', '✦', '●', '■']

export function ScrollRail() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-rail]', root.current!).forEach((rail, i) => {
        const dir = Number(rail.dataset.dir)
        gsap.fromTo(
          rail,
          { xPercent: dir * 14, rotate: dir * 0.8 },
          {
            xPercent: dir * -14,
            rotate: dir * -0.8,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.35 + i * 0.12, // rows lag slightly differently — depth
            },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden border-y-[3px] border-current py-14 md:py-20 bg-page">
      {/* corner tags */}
      <div className="flex justify-between px-4 md:px-8 mb-5 font-bold text-[10px] md:text-xs uppercase">
        <span className="border-[2.5px] border-current px-2 py-1">THE LOOP</span>
        <span className="opacity-60">scroll shears the lines →</span>
      </div>

      <div className="space-y-2 md:space-y-4">
        {ROWS.map((row, ri) => (
          <div
            key={ri}
            data-rail
            data-dir={row.dir}
            className="group flex items-center gap-6 md:gap-10 whitespace-nowrap will-change-transform justify-center cursor-crosshair"
          >
            {[0, 1, 2, 3].map((wi) => (
              <span key={wi} className="flex items-center gap-6 md:gap-10">
                <span
                  className={`mega leading-[0.95] text-[clamp(2.6rem,9.5vw,8.5rem)] transition-colors duration-150 ${
                    row.style === 'block'
                      ? 'px-3 md:px-5 text-[#0a0a0a] group-hover:text-[#ff4d00] group-hover:bg-[#0a0a0a]'
                      : 'group-hover:text-[#ff4d00]'
                  }`}
                  style={
                    row.style === 'stroke'
                      ? { WebkitTextStroke: '2.5px currentColor', color: 'transparent' }
                      : row.style === 'block'
                        ? { backgroundColor: row.color }
                        : undefined
                  }
                >
                  {row.word}
                </span>
                <span className="mega text-[clamp(1.2rem,3.4vw,2.8rem)] text-[#ff4d00] group-hover:rotate-90 transition-transform duration-300">
                  {MARKS[(ri + wi) % MARKS.length]}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <p className="px-4 md:px-8 mt-5 font-bold text-[10px] md:text-xs uppercase opacity-60 text-right">
        repeat until loud
      </p>
    </section>
  )
}
