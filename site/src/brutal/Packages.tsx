import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* THE*MENU v2 — diner board redesign.
   Three full-width horizontal boards instead of cramped columns:
   [ color name-plate | spec list | price rail + PICK ]
   Boards slide in from alternating sides; hover shifts the whole
   board like a pulled menu card. */

const TIERS = [
  {
    no: 'A',
    name: 'THE POSTER',
    c: 'acid',
    for: 'ONE LOUD DELIVERABLE',
    items: ['POSTER / COVER / KEY VISUAL', '3 CONCEPTS · 2 REVISION ROUNDS', 'PRINT + SOCIAL EXPORTS'],
    price: 'STARTS LIGHT',
    eta: '48H FIRST DRAFT',
    hot: false,
  },
  {
    no: 'B',
    name: 'THE SITE',
    c: 'pop',
    for: 'A WEB PRESENCE THAT SLAPS',
    items: ['DESIGN + BUILD (LIKE THIS SITE)', 'ANIMATIONS & INTERACTIONS IN', 'DEPLOYED · RESPONSIVE · YOURS'],
    price: 'STARTS SERIOUS',
    eta: '2–4 WEEKS',
    hot: true,
  },
  {
    no: 'C',
    name: 'THE MACHINE',
    c: 'blue',
    for: 'BRAND + SITE + CONTENT ENGINE',
    items: ['IDENTITY SYSTEM + WEBSITE', 'VIDEO EDIT TEMPLATES + FIRST CUTS', 'AI AGENT WORKFLOWS FOR CONTENT'],
    price: 'LET’S TALK',
    eta: 'ONGOING',
    hot: false,
  },
]

export function Packages() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-board]', root.current!).forEach((el, i) => {
        gsap.fromTo(
          el,
          { xPercent: i % 2 ? 8 : -8, opacity: 0 },
          {
            xPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="menu" className="px-4 md:px-8 py-20 md:py-28 overflow-hidden">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <h2 data-wipe className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
          <span aria-hidden className="num-ghost mega absolute -top-6 md:-top-10 left-0 text-[clamp(1.6rem,4vw,3rem)]">/15</span>
          THE<span className="text-[#00ffa3]">*</span>MENU
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase hidden md:block">clear scope. no mystery invoices.</span>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
        {TIERS.map((t) => (
          <article
            key={t.no}
            data-board
            className={`group relative slab case-card bg-page will-change-transform transition-transform duration-200 hover:-translate-y-1 ${
              t.hot ? 'shadow-pop-orange' : ''
            }`}
            data-noclick
          >
            {t.hot && (
              <span className="absolute -top-4 right-6 md:right-10 pop slab case-card font-black text-[10px] md:text-xs uppercase px-3 py-1 rotate-[2deg] z-10">
                ★ MOST PICKED
              </span>
            )}

            <div className="grid md:grid-cols-[240px_1fr_220px] lg:grid-cols-[300px_1fr_260px] items-stretch">
              {/* name plate */}
              <div className={`${t.c} p-5 md:p-7 flex flex-col justify-between border-b-[3px] md:border-b-0 md:border-r-[3px] border-current`}>
                <span className="font-black text-3xl md:text-5xl opacity-80">{t.no}/</span>
                <div className="mt-6 md:mt-0">
                  <p className="mega text-[clamp(1.5rem,3vw,2.2rem)] leading-none break-words">{t.name}</p>
                  <p className="font-bold text-[9px] md:text-[10px] uppercase mt-2 leading-snug">{t.for}</p>
                </div>
              </div>

              {/* spec list */}
              <ul className="p-5 md:p-7 space-y-3 md:space-y-4 border-b-[3px] md:border-b-0 md:border-r-[3px] border-current self-center w-full">
                {t.items.map((it) => (
                  <li key={it} className="flex gap-3 items-baseline font-bold text-[11px] md:text-sm uppercase leading-snug">
                    <span className="text-[#ff4d00] font-black shrink-0">▸</span>
                    <span className="min-w-0">{it}</span>
                  </li>
                ))}
              </ul>

              {/* price rail */}
              <div className="p-5 md:p-7 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 text-right">
                <div>
                  <p className="font-black uppercase text-base md:text-xl leading-tight">{t.price}</p>
                  <p className="font-bold text-[9px] md:text-[10px] uppercase opacity-60 mt-1">{t.eta}</p>
                </div>
                <a
                  href="#contact"
                  data-noclick
                  className={`slab ${t.c} font-black uppercase text-[11px] md:text-sm px-6 py-3 shrink-0 group-hover:translate-x-1 transition-transform`}
                >
                  PICK ▸
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="text-center font-bold text-[10px] md:text-xs uppercase mt-10 opacity-60">
        exact quote after one call — scope first, number second, no surprises ever.
      </p>
    </section>
  )
}
