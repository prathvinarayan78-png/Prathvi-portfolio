import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* HOW I WORK — pinned section; steps stack in like thrown cards
   as you scroll through. */

const STEPS = [
  { n: '01', t: 'YOU TALK', d: 'Brief me. Voice note, doc, napkin sketch — anything.', c: 'acid' },
  { n: '02', t: 'I DIG', d: 'References, rabbit holes, moodboards. The ugly research phase.', c: 'pop' },
  { n: '03', t: 'I MAKE', d: 'Design. Build. Cut. You get drafts fast — no month-long silence.', c: 'blue' },
  { n: '04', t: 'WE SHIP', d: 'Revisions until it slaps. Then it goes live and we brag.', c: 'acid' },
]

export function Process() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-step]')
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 0.7,
          end: () => `+=${innerHeight * 2.2}`,
        },
      })
      cards.forEach((c, i) => {
        tl.fromTo(
          c,
          { yPercent: 130, rotation: i % 2 ? 10 : -10 },
          { yPercent: 0, rotation: i % 2 ? 2.5 : -2.5, ease: 'power2.out' },
          i * 0.24,
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden px-4 md:px-8 py-16 flex flex-col">
      <div className="flex items-end justify-between mb-6">
        <h2 className="mega text-[clamp(2.6rem,9vw,8rem)]">
          HOW<span className="text-[#00ffa3]">*</span>I*WORK
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase hidden md:block">keep scrolling — cards drop in</span>
      </div>

      <div className="relative flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-center content-center">
        {STEPS.map((s) => (
          <div
            key={s.n}
            data-step
            className={`slab ${s.c} p-5 md:p-6 min-h-[220px] md:min-h-[300px] flex flex-col justify-between will-change-transform`}
            data-noclick
          >
            <span className="font-black text-3xl md:text-5xl">{s.n}</span>
            <div>
              <p className="mega text-[clamp(1.4rem,2.6vw,2.2rem)]">{s.t}</p>
              <p className="font-bold text-[11px] md:text-sm uppercase mt-2 leading-snug">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
