import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* HEARSAY — testimonial cards taped up like flyers, stamped in on scroll. */

const REVIEWS = [
  { q: '“Sent a napkin sketch. Got back a brand. Still confused. Five stars.”', who: 'FUTURE CLIENT #1', rot: -2 },
  { q: '“The edit made my dog cry. My DOG.”', who: 'FUTURE CLIENT #2', rot: 1.5 },
  { q: '“Asked for minor changes. He shipped them before I finished the sentence.”', who: 'FUTURE CLIENT #3', rot: -1 },
  { q: '“Website so fast it loaded yesterday.”', who: 'FUTURE CLIENT #4', rot: 2.5 },
  { q: '“10/10 would panic-call at 2AM again.”', who: 'FUTURE CLIENT #5', rot: -2.5 },
  { q: '“He said no templates. He meant it. Nothing lines up. I love it.”', who: 'FUTURE CLIENT #6', rot: 1 },
]

export function Reviews() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-rev]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 1.6, opacity: 0, rotation: Number(el.dataset.rot) * 4 },
          {
            scale: 1, opacity: 1, rotation: Number(el.dataset.rot),
            duration: 0.35, ease: 'power4.in', delay: (i % 3) * 0.08,
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="px-4 md:px-8 py-16 md:py-24 border-t-[3px] border-current">
      <div className="flex items-end justify-between mb-10">
        <h2 className="mega text-[clamp(2.6rem,9vw,8rem)]">
          HEAR<span className="text-[#00ffa3]">*</span>SAY
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase">reviews from the future*</span>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
        {REVIEWS.map((r) => (
          <figure
            key={r.who}
            data-rev
            data-rot={r.rot}
            className="slab p-5 md:p-6 will-change-transform bg-page"
            style={{ rotate: `${r.rot}deg` }}
          >
            {/* tape */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 acid border-[3px] border-current rotate-[-3deg]" />
            <blockquote className="font-bold text-sm md:text-base uppercase leading-snug">{r.q}</blockquote>
            <figcaption className="font-black text-[10px] md:text-xs mt-4 text-[#ff4d00]">— {r.who}</figcaption>
          </figure>
        ))}
      </div>

      <p className="font-bold text-[10px] md:text-xs uppercase mt-6 opacity-60">
        *your review could be here. that's the whole point of the contact button below.
      </p>
    </section>
  )
}
