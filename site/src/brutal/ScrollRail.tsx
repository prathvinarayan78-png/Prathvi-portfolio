import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* THE LOOP — rebuilt from scratch. NO pinning (pins caused the
   blackout). Three full-width rails slide in opposite directions,
   scrubbed by the section's natural pass through the viewport.
   The page never stops scrolling, so there is never dead space. */

const ROWS: { words: string[]; dir: 1 | -1; stroke?: boolean }[] = [
  { words: ['DESIGN', 'DESIGN', 'DESIGN', 'DESIGN'], dir: -1 },
  { words: ['BUILD', 'BUILD', 'BUILD', 'BUILD'], dir: 1, stroke: true },
  { words: ['EDIT', 'EDIT', 'EDIT', 'EDIT'], dir: -1 },
]

export function ScrollRail() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-rail]', root.current!).forEach((rail) => {
        const dir = Number(rail.dataset.dir)
        // start shifted one way, scrub to the other as the section crosses the screen
        gsap.fromTo(
          rail,
          { xPercent: dir * 12 },
          {
            xPercent: dir * -12,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',   // begins the moment it peeks in
              end: 'bottom top',     // done when it leaves — never pinned
              scrub: 0.4,
            },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden border-y-[3px] border-current py-6 md:py-10">
      <p className="px-4 md:px-8 mb-4 font-bold text-[10px] md:text-xs uppercase opacity-60">
        the loop — scroll moves the lines
      </p>

      {ROWS.map((row, ri) => (
        <div
          key={ri}
          data-rail
          data-dir={row.dir}
          className="flex items-center gap-8 md:gap-14 whitespace-nowrap will-change-transform justify-center"
        >
          {row.words.map((w, wi) => (
            <span key={wi} className="flex items-center gap-8 md:gap-14">
              <span
                className="mega text-[clamp(3rem,11vw,10rem)] leading-[0.95]"
                style={
                  row.stroke
                    ? { WebkitTextStroke: '2.5px currentColor', color: 'transparent' }
                    : undefined
                }
              >
                {w}
              </span>
              <span className="mega text-[clamp(1.4rem,4vw,3.4rem)] text-[#ff4d00]">★</span>
            </span>
          ))}
        </div>
      ))}

      <p className="px-4 md:px-8 mt-4 font-bold text-[10px] md:text-xs uppercase opacity-60 text-right">
        repeat until loud →
      </p>
    </section>
  )
}
