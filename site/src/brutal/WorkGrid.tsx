import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import { DESIGN_WORK, WEB_WORK, EDIT_WORK } from '../data/work'

/* THE WORK — one massive brutal table/grid. Rows expand on click,
   cells invert on hover, numbers everywhere. */

type Row = {
  id: string
  n: string
  title: string
  kind: string
  year: string
  img: string
  meta: string
}

const ROWS: Row[] = [
  ...DESIGN_WORK.map((w, i) => ({
    id: `d${i}`, n: String(i + 1).padStart(2, '0'),
    title: w.title, kind: w.kind, year: w.year, img: w.img, meta: 'GRAPHIC DESIGN',
  })),
  ...WEB_WORK.map((w, i) => ({
    id: `w${i}`, n: String(DESIGN_WORK.length + i + 1).padStart(2, '0'),
    title: w.title, kind: w.stack, year: w.year, img: w.img, meta: 'WEBSITE',
  })),
  ...EDIT_WORK.map((w, i) => ({
    id: `e${i}`, n: String(DESIGN_WORK.length + WEB_WORK.length + i + 1).padStart(2, '0'),
    title: w.title, kind: `${w.kind} — ${w.duration}`, year: w.year, img: w.img, meta: 'VIDEO EDIT',
  })),
]

export function WorkGrid() {
  const [open, setOpen] = useState<string | null>(null)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-row]', root.current!).forEach((el, i) => {
        gsap.fromTo(
          el,
          { xPercent: i % 2 ? 14 : -14, opacity: 0 },
          {
            xPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 92%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="work" className="px-4 md:px-8 py-28 md:py-44 overflow-hidden">
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <h2 className="mega text-[clamp(2.6rem,9vw,8rem)]">
          THE<span className="text-[#00ffa3]">*</span>WORK
        </h2>
        <span className="font-bold text-xs md:text-sm">({ROWS.length}) PIECES</span>
      </div>

      <div className="border-t-[3px] border-current">
        {ROWS.map((r) => {
          const isOpen = open === r.id
          return (
            <div key={r.id} data-row className="border-b-[3px] border-current will-change-transform">
              <button
                data-noclick
                onClick={() => setOpen(isOpen ? null : r.id)}
                className="w-full grid grid-cols-[auto_1fr_auto] md:grid-cols-[80px_1fr_auto_auto] items-center gap-4 md:gap-8 py-4 md:py-5 text-left group hover:bg-[#ff4d00] hover:text-[#0a0a0a] transition-colors px-2 md:px-4"
              >
                <span className="font-black text-lg md:text-2xl">{r.n}</span>
                <span className="mega text-[clamp(1.3rem,4.2vw,3.4rem)] group-hover:translate-x-3 transition-transform duration-150">
                  {r.title}
                </span>
                <span className="hidden md:inline font-bold text-[11px] uppercase border-[2.5px] border-current px-3 py-1">
                  {r.meta}
                </span>
                <span className="font-black text-xl md:text-3xl">{isOpen ? '−' : '+'}</span>
              </button>

              {/* expanded panel */}
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6 px-2 md:px-4 pb-6 pt-2">
                    <div className="slab overflow-hidden" data-noclick>
                      <img src={r.img} alt={r.title} loading="lazy" className="img-brut w-full aspect-video object-cover" />
                    </div>
                    <div className="flex flex-col justify-between gap-4">
                      <div>
                        <p className="font-bold text-xs md:text-sm uppercase mb-2">↳ {r.kind}</p>
                        <p className="font-bold text-xs md:text-sm uppercase opacity-60">YEAR: {r.year}</p>
                      </div>
                      <a
                        href="#contact"
                        className="slab acid inline-block self-start font-black uppercase text-xs md:text-sm px-5 py-2.5"
                        data-noclick
                      >
                        WANT THIS? →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="font-bold text-[11px] md:text-xs uppercase mt-4 opacity-60">
        * click a row. real projects drop in soon — this is the shelf.
      </p>
    </section>
  )
}
