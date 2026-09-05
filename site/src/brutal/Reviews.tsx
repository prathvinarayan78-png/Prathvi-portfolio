import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* HEAR*SAY v2 — THE RECEIPTS.
   Reviews redesigned as printed till receipts: perforated tops,
   order numbers, star ratings, item lines and barcodes. Straight
   grid, zero rotation — the taped-flyer chaos is retired.
   Receipts "print" downward as you scroll (clip reveal, ink flash). */

const RECEIPTS = [
  { q: 'SENT A NAPKIN SKETCH. GOT BACK A BRAND. STILL CONFUSED. FIVE STARS.', who: 'FUTURE CLIENT #1', item: 'BRAND IDENTITY', stars: 5 },
  { q: 'THE EDIT MADE MY DOG CRY. MY DOG.', who: 'FUTURE CLIENT #2', item: 'VIDEO EDIT', stars: 5 },
  { q: 'ASKED FOR MINOR CHANGES. HE SHIPPED THEM BEFORE I FINISHED THE SENTENCE.', who: 'FUTURE CLIENT #3', item: 'REVISIONS', stars: 5 },
  { q: 'WEBSITE SO FAST IT LOADED YESTERDAY.', who: 'FUTURE CLIENT #4', item: 'WEB BUILD', stars: 5 },
  { q: '10/10 WOULD PANIC-CALL AT 2AM AGAIN.', who: 'FUTURE CLIENT #5', item: 'SUPPORT', stars: 5 },
  { q: 'HE SAID NO TEMPLATES. HE MEANT IT. NOTHING LINES UP. I LOVE IT.', who: 'FUTURE CLIENT #6', item: 'EVERYTHING', stars: 5 },
]

function Barcode() {
  return (
    <div className="flex items-end gap-[2px] h-6" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className="bg-current"
          style={{ width: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1, height: `${60 + ((i * 37) % 40)}%` }}
        />
      ))}
    </div>
  )
}

export function Reviews() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-receipt]').forEach((el, i) => {
        // receipt "prints": clips open downward like paper feeding out
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 0 100% 0)', y: -16 },
          {
            clipPath: 'inset(0 0 0% 0)', y: 0,
            duration: 0.7, ease: 'power3.inOut', delay: (i % 3) * 0.12,
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="px-4 md:px-8 py-20 md:py-28 border-t-[3px] border-current">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <h2 data-wipe className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
          <span aria-hidden className="num-ghost mega absolute -top-6 md:-top-10 left-0 text-[clamp(1.6rem,4vw,3rem)]">/12</span>
          HEAR<span className="text-[#00ffa3]">*</span>SAY
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase">receipts from the future*</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto items-start">
        {RECEIPTS.map((r, i) => (
          <article
            key={r.who}
            data-receipt
            className="slab case-card bg-page will-change-transform"
            data-noclick
          >
            {/* perforated top edge */}
            <div
              className="h-3 border-b-[3px] border-current"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0 8px, transparent 8px 16px)',
                backgroundSize: '16px 3px',
                backgroundRepeat: 'repeat-x',
                backgroundPosition: 'top',
                opacity: 0.35,
              }}
            />

            <div className="p-5 md:p-6">
              {/* header row */}
              <div className="flex items-center justify-between font-bold text-[9px] md:text-[10px] uppercase opacity-60">
                <span>PRATHVI*** STUDIO</span>
                <span className="tabular-nums">NO. {String(i + 1).padStart(4, '0')}</span>
              </div>
              <div className="my-3 border-t-[2px] border-dashed border-current opacity-40" />

              {/* the quote */}
              <blockquote className="font-bold text-sm md:text-base uppercase leading-snug min-h-[76px]">
                “{r.q}”
              </blockquote>

              <div className="my-3 border-t-[2px] border-dashed border-current opacity-40" />

              {/* item + rating line */}
              <div className="flex items-center justify-between font-bold text-[10px] md:text-xs uppercase">
                <span className="opacity-70">{r.item}</span>
                <span className="text-[#ff4d00] tracking-[0.1em]">{'★'.repeat(r.stars)}</span>
              </div>

              {/* customer */}
              <p className="font-black text-[10px] md:text-xs uppercase mt-2 text-[#ff4d00]">— {r.who}</p>

              <div className="my-3 border-t-[2px] border-dashed border-current opacity-40" />

              {/* footer: barcode + total */}
              <div className="flex items-end justify-between gap-4">
                <Barcode />
                <div className="text-right font-bold text-[9px] md:text-[10px] uppercase">
                  <p className="opacity-60">TOTAL</p>
                  <p className="font-black text-sm md:text-base">WORTH IT</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="text-center font-bold text-[10px] md:text-xs uppercase mt-12 md:mt-16 opacity-60">
        *your receipt could be here. that's the whole point of the contact button below.
      </p>
    </section>
  )
}
