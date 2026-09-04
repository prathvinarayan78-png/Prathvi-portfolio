import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* HOW*I*WORK v2 — rebuilt from scratch, ZERO pinning.
   A zigzag assembly line: a center spine draws itself downward
   (scrubbed), and each step swings in from alternating sides as it
   enters the viewport. Normal page flow — blackout impossible. */

const STEPS = [
  {
    n: '01', t: 'YOU TALK', c: 'acid',
    d: 'Brief me. Voice note, doc, napkin sketch — anything human.',
    chip: 'INPUT: CHAOS',
  },
  {
    n: '02', t: 'I DIG', c: 'pop',
    d: 'References, rabbit holes, moodboards. The ugly research phase nobody posts about.',
    chip: 'MODE: OBSESSED',
  },
  {
    n: '03', t: 'I MAKE', c: 'blue',
    d: 'Design. Build. Cut. First drafts in 48 hours — no month-long silence.',
    chip: 'STATUS: COOKING',
  },
  {
    n: '04', t: 'WE SHIP', c: 'acid',
    d: 'Revisions until it slaps. Then it goes live and we both brag about it.',
    chip: 'OUTPUT: LOUD',
  },
]

export function Process() {
  const root = useRef<HTMLElement>(null)
  const spine = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // spine draws with scroll — scrubbed, but never pins the page
      gsap.fromTo(
        spine.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 55%',
            end: 'bottom 80%',
            scrub: 0.4,
          },
        },
      )

      // each card swings in from its side when it enters
      gsap.utils.toArray<HTMLElement>('[data-step]', root.current!).forEach((el, i) => {
        const fromLeft = i % 2 === 0
        gsap.fromTo(
          el,
          {
            xPercent: fromLeft ? (innerWidth < 768 ? -22 : -60) : (innerWidth < 768 ? 22 : 60),
            rotation: fromLeft ? -7 : 7,
            opacity: 0,
          },
          {
            xPercent: 0,
            rotation: fromLeft ? -1.2 : 1.2,
            opacity: 1,
            duration: 0.7,
            ease: 'back.out(1.5)',
            scrollTrigger: { trigger: el, start: 'top 82%' },
          },
        )
        // number badge pops after the card lands
        gsap.fromTo(
          el.querySelector('[data-badge]'),
          { scale: 0, rotation: 45 },
          {
            scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(3)',
            scrollTrigger: { trigger: el, start: 'top 70%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative px-4 md:px-8 pt-20 md:pt-28 pb-20 md:pb-28 overflow-hidden">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <h2 data-wipe className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
          <span aria-hidden className="num-ghost mega absolute -top-6 md:-top-10 left-0 text-[clamp(1.6rem,4vw,3rem)]">/03</span>
          HOW<span className="text-[#00ffa3]">*</span>I*WORK
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase hidden md:block">
          the assembly line ↓
        </span>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* center spine — draws downward with scroll */}
        <div className="absolute left-3 md:left-1/2 top-0 bottom-0 w-[5px] md:w-[6px] -translate-x-1/2 bg-current opacity-10" />
        <div
          ref={spine}
          className="absolute left-3 md:left-1/2 top-0 bottom-0 w-[5px] md:w-[6px] -translate-x-1/2 bg-[#ff4d00] origin-top will-change-transform"
        />

        <div className="space-y-16 md:space-y-28">
          {STEPS.map((s, i) => {
            const left = i % 2 === 0
            return (
              <div
                key={s.n}
                data-step
                className={`relative w-[calc(100%-1.75rem)] ml-7 md:w-[calc(50%-3rem)] min-w-0 will-change-transform ${
                  left ? 'md:ml-0' : 'md:ml-auto'
                }`}
              >
                {/* connector nub to the spine */}
                <span
                  className={`hidden md:block absolute top-10 h-[6px] w-12 bg-[#ff4d00] ${
                    left ? '-right-12' : '-left-12'
                  }`}
                />
                <span className="md:hidden absolute top-10 -left-4 h-[5px] w-4 bg-[#ff4d00]" />

                <div className={`slab shadow-pop-blue ${s.c} p-4 md:p-7 overflow-hidden`} data-noclick>
                  <div className="flex items-start justify-between gap-4">
                    <span
                      data-badge
                      className="inline-grid place-items-center w-10 h-10 md:w-16 md:h-16 border-[3px] border-current font-black text-base md:text-2xl bg-[#0a0a0a] text-white will-change-transform shrink-0"
                    >
                      {s.n}
                    </span>
                    <span className="font-bold text-[8px] md:text-[11px] uppercase border-[2px] md:border-[2.5px] border-current px-1.5 py-1 text-right shrink min-w-0">
                      {s.chip}
                    </span>
                  </div>
                  <p className="mega text-[clamp(1.3rem,6.5vw,3.4rem)] mt-4 break-words">{s.t}</p>
                  <p className="font-bold text-[10px] md:text-sm uppercase mt-2 leading-relaxed break-words">
                    {s.d}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* end cap */}
        <div className="relative mt-16 md:mt-24 text-center">
          <span className="inline-block slab pop font-black uppercase text-sm md:text-lg px-6 py-3 rotate-[-1.5deg]" data-noclick>
            RESULT: WORK THAT SLAPS ✓
          </span>
        </div>
      </div>
    </section>
  )
}
