import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* NUMBERS — scroll-scrubbed counters; digits roll up as you scroll,
   roll back down when you scroll away. */

const STATS = [
  { n: 3, suf: '', label: 'CRAFTS, ONE BRAIN' },
  { n: 48, suf: 'HR', label: 'FIRST DRAFT SPEED' },
  { n: 100, suf: '%', label: 'HANDMADE, NO TEMPLATES' },
  { n: 0, suf: '', label: 'BORING PROJECTS ACCEPTED' },
]

export function Stats() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-n]').forEach((el) => {
        const target = Number(el.dataset.n)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 40%', scrub: 0.5 },
          onUpdate: () => { el.textContent = String(Math.round(obj.v)) },
        })
      })
      // giant bg word drifts sideways with scroll
      gsap.fromTo(
        '[data-drift]',
        { xPercent: 12 },
        {
          xPercent: -12, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden border-y-[3px] border-current py-20 md:py-28">
      <span
        data-drift
        aria-hidden
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 mega text-[clamp(6rem,22vw,20rem)] opacity-[0.06] whitespace-nowrap pointer-events-none select-none"
      >
        PROOF PROOF PROOF
      </span>

      <div className="flex items-end justify-between mb-16 md:mb-24 px-4 md:px-8">
        <h2 data-wipe className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
          <span aria-hidden className="num-ghost mega absolute -top-6 md:-top-10 left-0 text-[clamp(1.6rem,4vw,3rem)]">/07</span>
          PROOF<span className="text-[#ff4d00]">*</span>
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase hidden md:block">numbers don't lie</span>
      </div>

      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-y-12 px-4 md:px-8">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="mega text-[clamp(3rem,8vw,7rem)] tabular-nums">
              <span data-n={s.n}>0</span>
              <span className="text-[#ff4d00]">{s.suf}</span>
            </p>
            <p className="font-bold text-[10px] md:text-xs uppercase mt-2 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
