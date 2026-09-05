import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* CASE*FILE — the deep-dive case study clients look for:
   PROBLEM → MOVE → RESULT with hard numbers. Placeholder content
   marked clearly; swaps for a real project via this one array. */

const STEPS = [
  {
    k: 'THE PROBLEM',
    c: 'pop',
    t: 'DEAD ON ARRIVAL',
    d: 'A creator’s channel: strong ideas, 40-minute raw rambles, viewers gone by 0:19. Brand looked like a default template.',
  },
  {
    k: 'THE MOVE',
    c: 'acid',
    t: 'FULL STACK ATTACK',
    d: 'Rebranded the identity, rebuilt thumbnails as a poster system, recut episodes to 8-minute story arcs with pattern interrupts every 30s.',
  },
  {
    k: 'THE RESULT',
    c: 'blue',
    t: 'NUMBERS WENT LOUD',
    d: 'Watch time up, subs up, sponsor DMs in. One brain across design + edit meant zero weeks lost in handoffs.',
  },
]

const METRICS = [
  { n: '+212%', l: 'AVG WATCH TIME' },
  { n: '3.4×', l: 'CTR ON THUMBNAILS' },
  { n: '14', l: 'DAYS BRIEF → LIVE' },
]

export function CaseFile() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-cs]', root.current!).forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 70, opacity: 0, rotation: i % 2 ? 2 : -2 },
          {
            y: 0, opacity: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.4)', delay: i * 0.12,
            scrollTrigger: { trigger: root.current, start: 'top 70%' },
          },
        )
      })
      gsap.utils.toArray<HTMLElement>('[data-metric]', root.current!).forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 0.4, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.2)', delay: 0.4 + i * 0.12,
            scrollTrigger: { trigger: '[data-metrics]', start: 'top 80%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="case" className="px-4 md:px-8 py-20 md:py-28 overflow-hidden">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <h2 data-wipe className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
          <span aria-hidden className="num-ghost mega absolute -top-6 md:-top-10 left-0 text-[clamp(1.6rem,4vw,3rem)]">/02</span>
          CASE<span className="text-[#ff4d00]">*</span>FILE
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase hidden md:block">problem → move → result</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto">
        {STEPS.map((s, i) => (
          <article key={s.k} data-cs className={`slab ${s.c} p-6 md:p-8 will-change-transform`} data-noclick>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[10px] md:text-xs uppercase border-[2.5px] border-current px-2 py-1">{s.k}</span>
              <span className="font-black text-2xl md:text-3xl">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <p className="mega text-[clamp(1.5rem,3vw,2.4rem)] mt-5">{s.t}</p>
            <p className="font-bold text-[11px] md:text-sm uppercase mt-3 leading-relaxed">{s.d}</p>
          </article>
        ))}
      </div>

      {/* hard numbers strip */}
      <div data-metrics className="grid grid-cols-3 max-w-4xl mx-auto mt-10 md:mt-14 border-[3px] border-current">
        {METRICS.map((m, i) => (
          <div key={m.l} data-metric className={`text-center py-6 md:py-10 will-change-transform ${i > 0 ? 'border-l-[3px] border-current' : ''}`}>
            <p className="mega text-[clamp(1.8rem,5vw,4rem)] text-[#ff4d00]">{m.n}</p>
            <p className="font-bold text-[9px] md:text-xs uppercase mt-2 opacity-70">{m.l}</p>
          </div>
        ))}
      </div>

      <p className="text-center font-bold text-[10px] md:text-xs uppercase mt-6 opacity-50">
        *demo case — your project becomes the next file. numbers are the goal, not the promise.
      </p>
    </section>
  )
}
