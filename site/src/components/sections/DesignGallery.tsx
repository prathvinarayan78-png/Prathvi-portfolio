import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextReveal } from '../ui/TextReveal'
import { useCursorLabel } from '../ui/CustomCursor'
import { DESIGN_WORK } from '../../data/work'
import { TiltCard } from '../ui/TiltCard'

gsap.registerPlugin(ScrollTrigger)

/* ACT I — GRAPHIC DESIGN: asymmetric editorial mosaic.
   Pieces rise with clip-path wipes and drift at parallax speeds. */

const SPAN: Record<string, string> = {
  tall: 'md:col-span-5 md:row-span-2 aspect-[3/4]',
  wide: 'md:col-span-7 aspect-[16/10]',
  square: 'md:col-span-4 aspect-square',
}

export function DesignGallery() {
  const root = useRef<HTMLElement>(null)
  const cursor = useCursorLabel('VIEW')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-piece]', root.current!).forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(100% 0 0 0)', y: 60 },
          {
            clipPath: 'inset(0% 0 0 0)', y: 0, duration: 1.1, ease: 'power4.out', delay: (i % 3) * 0.1,
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
        // gentle parallax drift
        gsap.fromTo(
          el.querySelector('img'),
          { yPercent: -8 },
          {
            yPercent: 8, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="design" className="relative z-10 py-24 md:py-36 px-5 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-4">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#4488ff]">ACT I — GRAPHIC DESIGN</p>
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/30">({String(DESIGN_WORK.length).padStart(2, '0')})</span>
      </div>
      <TextReveal
        className="font-display font-extrabold text-[clamp(2.4rem,7vw,6rem)] leading-none mb-14 md:mb-20"
        lines={[<>PRINT &amp; <span className="text-[#4488ff]">PIXELS</span></>]}
      />

      <div className="grid md:grid-cols-12 gap-4 md:gap-6 auto-rows-auto">
        {DESIGN_WORK.map((p) => (
          <TiltCard key={p.title} max={7} className={SPAN[p.span]}>
          <figure
            data-piece
            {...cursor}
            className="group absolute inset-0 overflow-hidden border border-white/10 bg-[#101010]"
          >
            <img
              src={p.img}
              alt={p.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover scale-[1.16] opacity-85 group-hover:opacity-100 transition-opacity duration-500"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-black/85 via-black/30 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <p className="font-display font-bold text-lg md:text-xl">{p.title}</p>
              <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-white/50 mt-1">
                {p.kind} — {p.year}
              </p>
            </figcaption>
          </figure>
          </TiltCard>
        ))}
      </div>
    </section>
  )
}
