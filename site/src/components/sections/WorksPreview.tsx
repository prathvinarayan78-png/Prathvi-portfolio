import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextReveal } from '../ui/TextReveal'
import { useCursorLabel } from '../ui/CustomCursor'

gsap.registerPlugin(ScrollTrigger)

/* Home teaser — a staggered parallax strip of work frames drifting
   at different speeds, linking to /works. */

const ITEMS = [
  { img: '/works/work-1.jpg', title: 'CHROME FLOW', speed: -60 },
  { img: '/works/work-2.jpg', title: 'MONOLITH', speed: 40 },
  { img: '/works/work-3.jpg', title: 'GLASS SYSTEM', speed: -30 },
  { img: '/works/work-4.jpg', title: 'SIGNAL LOST', speed: 70 },
]

export function WorksPreview() {
  const root = useRef<HTMLElement>(null)
  const cursor = useCursorLabel('EXPLORE')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-plx-card]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: Number(el.dataset.speed) },
          {
            y: -Number(el.dataset.speed),
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative z-10 py-24 md:py-40 px-5 md:px-12 overflow-hidden">
      <div className="flex items-end justify-between mb-14 md:mb-20">
        <TextReveal
          className="font-display font-bold text-[clamp(2rem,5.5vw,5rem)] leading-none"
          lines={['FIELD', 'NOTES®']}
        />
        <Link
          to="/works"
          {...cursor}
          className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] text-white/50 hover:text-white border-b border-white/20 pb-1 transition-colors mb-1"
        >
          ALL WORKS ↗
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {ITEMS.map((it) => (
          <Link
            key={it.title}
            to="/works"
            {...cursor}
            data-plx-card
            data-speed={it.speed}
            className="group block will-change-transform"
          >
            <div className="relative overflow-hidden border border-white/10 bg-[#101010]">
              <img
                src={it.img}
                alt={it.title}
                loading="lazy"
                className="w-full aspect-[3/4] object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <span className="absolute inset-x-0 bottom-0 p-3 font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-white/70 bg-gradient-to-t from-black/80 to-transparent">
                {it.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
