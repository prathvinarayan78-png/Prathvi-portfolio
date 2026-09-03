import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ONE*BRAIN — the 3-in-1 pitch as a split diagram. The three columns
   slide together from off-screen and lock into one unit; the center
   arrows pulse. */

const HALVES = [
  { t: 'DESIGNER', d: 'sees the grid', c: 'acid', from: -100 },
  { t: 'DEVELOPER', d: 'ships the grid', c: 'pop', from: 0 },
  { t: 'EDITOR', d: 'makes it move', c: 'blue', from: 100 },
]

export function BrainSplit() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-half]', root.current!).forEach((el) => {
        const from = Number(el.dataset.from)
        gsap.fromTo(
          el,
          { xPercent: from, opacity: from === 0 ? 0 : 1, scale: from === 0 ? 0.6 : 1 },
          {
            xPercent: 0, opacity: 1, scale: 1,
            ease: 'power3.out', duration: 0.9,
            scrollTrigger: { trigger: root.current, start: 'top 65%' },
          },
        )
      })
      gsap.fromTo(
        '[data-lock]',
        { scale: 0, rotation: 180 },
        {
          scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.5)', delay: 0.75,
          scrollTrigger: { trigger: root.current, start: 'top 65%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="px-4 md:px-8 py-20 md:py-28 border-t-[3px] border-current overflow-hidden">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <h2 className="mega text-[clamp(2.6rem,9vw,8rem)]">
          ONE<span className="text-[#00ffa3]">*</span>BRAIN
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase">zero handoffs. zero lost-in-translation.</span>
      </div>

      <div className="relative grid md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
        {HALVES.map((h) => (
          <div
            key={h.t}
            data-half
            data-from={h.from}
            className={`slab ${h.c} p-6 md:p-8 text-center will-change-transform`}
            data-noclick
          >
            <p className="mega text-[clamp(1.6rem,3.6vw,2.8rem)]">{h.t}</p>
            <p className="font-bold text-[11px] md:text-sm uppercase mt-2 opacity-80">{h.d}</p>
          </div>
        ))}

        {/* lock badges between columns */}
        <span data-lock className="hidden md:grid absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 place-items-center bg-[#0a0a0a] text-white border-[3px] border-current font-black text-xl z-10 will-change-transform">
          +
        </span>
        <span data-lock className="hidden md:grid absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 place-items-center bg-[#0a0a0a] text-white border-[3px] border-current font-black text-xl z-10 will-change-transform">
          +
        </span>
      </div>

      <p className="text-center font-bold text-xs md:text-base uppercase mt-10 md:mt-14 max-w-2xl mx-auto leading-relaxed">
        same skull. the designer never argues with the developer,
        and the editor already knows what the design needs to feel like in motion.
      </p>
    </section>
  )
}
