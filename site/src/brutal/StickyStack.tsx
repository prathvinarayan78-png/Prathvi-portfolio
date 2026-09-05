import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* THE*RULES — sticky stacking cards: each rule card scrolls up and
   pins over the previous one, shrinking the pile behind it. */

const RULES = [
  { n: 'RULE 01', t: 'LOUD ≠ MESSY', d: 'Brutalism is a grid wearing a leather jacket. Everything here is aligned — it just refuses to whisper about it.', c: 'acid' },
  { n: 'RULE 02', t: 'FAST ≠ SLOPPY', d: '48-hour drafts because momentum beats perfection. Polish happens in revisions, not in silence.', c: 'pop' },
  { n: 'RULE 03', t: 'FUN ≠ UNSERIOUS', d: 'The googly eyes are load-bearing. Play makes people stay, and staying makes people buy.', c: 'blue' },
  { n: 'RULE 04', t: 'DONE > PERFECT', d: 'Shipped work compounds. Unshipped work rots in a folder named FINAL_final_v3.', c: 'acid' },
]

export function StickyStack() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-rule]')
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return
        // as the NEXT card approaches, this one shrinks + dims
        gsap.to(card, {
          scale: 0.9 - (cards.length - 2 - i) * 0.02,
          opacity: 0.55,
          ease: 'none',
          scrollTrigger: {
            trigger: cards[i + 1],
            start: 'top bottom',
            end: 'top top+=120',
            scrub: 0.4,
          },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative px-4 md:px-8 py-20 md:py-28 border-t-[3px] border-current">
      <div className="flex items-end justify-between mb-12">
        <h2 data-wipe className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
          <span aria-hidden className="num-ghost mega absolute -top-6 md:-top-10 left-0 text-[clamp(1.6rem,4vw,3rem)]">/04</span>
          THE<span className="text-[#00ffa3]">*</span>RULES
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase">cards stack. keep scrolling.</span>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {RULES.map((r) => (
          <div
            key={r.n}
            data-rule
            className={`slab case-card ${r.c} sticky top-[84px] md:top-[96px] p-6 md:p-10 will-change-transform`}
            data-noclick
          >
            <span className="font-black text-[10px] md:text-xs">{r.n}</span>
            <p className="mega text-[clamp(1.8rem,5vw,3.6rem)] mt-2">{r.t}</p>
            <p className="font-bold text-[11px] md:text-sm uppercase mt-4 leading-relaxed max-w-2xl">{r.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
