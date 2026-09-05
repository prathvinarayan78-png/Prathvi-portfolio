import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* THE*MENU — productized packages with transparent "starts at"
   framing. Research says: clear tiers + investment framing filters
   serious clients and builds instant trust. */

const TIERS = [
  {
    name: 'THE POSTER',
    tag: 'DESIGN HIT',
    c: 'acid',
    for: 'One loud deliverable',
    items: ['Poster / cover / key visual', '3 concepts, 2 revision rounds', 'Print + social-ready exports'],
    price: 'STARTS LIGHT',
    eta: '48H FIRST DRAFT',
  },
  {
    name: 'THE SITE',
    tag: 'MOST PICKED',
    c: 'pop',
    for: 'A web presence that slaps',
    items: ['Design + build (like this site)', 'Animations & interactions included', 'Deployed, responsive, yours'],
    price: 'STARTS SERIOUS',
    eta: '2–4 WEEKS',
    hot: true,
  },
  {
    name: 'THE MACHINE',
    tag: 'FULL STACK',
    c: 'blue',
    for: 'Brand + site + content engine',
    items: ['Identity system + website', 'Video edit templates & first cuts', 'AI agent workflows for content ops'],
    price: 'LET’S TALK',
    eta: 'ONGOING',
  },
]

export function Packages() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-tier]', root.current!).forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 90, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: i * 0.12,
            scrollTrigger: { trigger: root.current, start: 'top 70%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="menu" className="px-4 md:px-8 py-20 md:py-28">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <h2 data-wipe className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
          <span aria-hidden className="num-ghost mega absolute -top-6 md:-top-10 left-0 text-[clamp(1.6rem,4vw,3rem)]">/15</span>
          THE<span className="text-[#00ffa3]">*</span>MENU
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase hidden md:block">clear scope. no mystery invoices.</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto items-stretch">
        {TIERS.map((t) => (
          <article
            key={t.name}
            data-tier
            className={`relative slab ${t.hot ? 'shadow-pop-orange' : ''} bg-page p-6 md:p-8 flex flex-col will-change-transform ${
              t.hot ? 'md:-translate-y-4' : ''
            }`}
            data-noclick
          >
            {t.hot && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 pop slab font-black text-[10px] md:text-xs uppercase px-3 py-1 rotate-[-2deg]">
                ★ {t.tag} ★
              </span>
            )}
            {!t.hot && (
              <span className="font-bold text-[9px] md:text-[10px] uppercase opacity-50">{t.tag}</span>
            )}

            <p className={`mega text-[clamp(1.7rem,3.4vw,2.6rem)] ${t.hot ? 'mt-3' : 'mt-2'}`}>{t.name}</p>
            <p className="font-bold text-[10px] md:text-xs uppercase mt-1 text-[#ff4d00]">{t.for}</p>

            <ul className="mt-6 space-y-3 flex-1">
              {t.items.map((it) => (
                <li key={it} className="flex gap-3 font-bold text-[11px] md:text-sm uppercase leading-snug">
                  <span className="text-[#00ffa3] font-black">■</span> {it}
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-5 border-t-[3px] border-current flex items-end justify-between">
              <div>
                <p className="font-black uppercase text-sm md:text-lg">{t.price}</p>
                <p className="font-bold text-[9px] md:text-[10px] uppercase opacity-60 mt-1">{t.eta}</p>
              </div>
              <a
                href="#contact"
                data-noclick
                className={`slab ${t.c} font-black uppercase text-[10px] md:text-xs px-4 py-2.5`}
              >
                PICK ▸
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="text-center font-bold text-[10px] md:text-xs uppercase mt-8 opacity-60">
        exact quote after one call — scope first, number second, no surprises ever.
      </p>
    </section>
  )
}
