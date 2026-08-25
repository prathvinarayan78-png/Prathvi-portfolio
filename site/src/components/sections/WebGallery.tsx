import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextReveal } from '../ui/TextReveal'
import { useCursorLabel } from '../ui/CustomCursor'
import { WEB_WORK } from '../../data/work'

gsap.registerPlugin(ScrollTrigger)

/* ACT II — WEBSITES: browser-framed screens tilted in 3D space,
   flattening as they scroll into view. */

export function WebGallery() {
  const root = useRef<HTMLElement>(null)
  const cursor = useCursorLabel('VISIT')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-browser]', root.current!).forEach((el, i) => {
        gsap.fromTo(
          el,
          { rotateX: 24, y: 120, opacity: 0, transformPerspective: 1000 },
          {
            rotateX: 0, y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 82%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="web" className="relative z-10 py-24 md:py-36 px-5 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-4">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#ffaa33]">ACT II — WEBSITES</p>
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/30">({String(WEB_WORK.length).padStart(2, '0')})</span>
      </div>
      <TextReveal
        className="font-display font-extrabold text-[clamp(2.4rem,7vw,6rem)] leading-none mb-14 md:mb-20"
        lines={[<>BUILT TO <span className="text-[#ffaa33]">MOVE</span></>]}
      />

      <div className="space-y-16 md:space-y-24">
        {WEB_WORK.map((p, i) => (
          <div key={p.title} className={`md:flex gap-10 items-center ${i % 2 ? 'md:flex-row-reverse' : ''}`}>
            {/* browser frame */}
            <a
              href={p.url || '#'}
              {...cursor}
              data-browser
              className="block md:w-2/3 will-change-transform group"
            >
              <div className="border border-white/15 bg-[#131313] overflow-hidden">
                {/* chrome bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-[#0d0d0d]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-3 flex-1 h-5 bg-white/5 rounded-sm flex items-center px-3 font-mono text-[9px] tracking-[0.2em] text-white/35">
                    {p.title.toLowerCase().replace(/\s/g, '')}.com
                  </span>
                </div>
                <div className="overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="w-full aspect-[16/10] object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
              </div>
            </a>

            <div className="md:w-1/3 mt-6 md:mt-0">
              <h3 className="font-display font-bold text-2xl md:text-3xl">{p.title}</h3>
              <p className="font-mono text-[10px] tracking-[0.3em] text-white/50 mt-3">{p.stack}</p>
              <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 mt-1">{p.year}</p>
              <span className="inline-block mt-6 font-mono text-[10px] tracking-[0.3em] text-[#ffaa33] border-b border-[#ffaa33]/40 pb-1">
                LIVE SITE ↗
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
