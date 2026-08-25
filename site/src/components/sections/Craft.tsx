import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* THE CRAFT — pinned section; scrolling scrubs horizontally through
   the three disciplines like chapters of one continuous shot. */

const CRAFTS = [
  {
    num: '01',
    title: 'DESIGN',
    accent: '#4488ff',
    copy: 'Identities, posters and systems that stop the scroll. Color, type and grid — weaponized.',
    tags: ['BRANDING', 'POSTERS', 'ART DIRECTION'],
  },
  {
    num: '02',
    title: 'BUILD',
    accent: '#ffaa33',
    copy: 'Websites that feel alive — 3D, motion and interaction engineered to make people stay.',
    tags: ['WEBSITES', 'THREE.JS', 'INTERACTION'],
  },
  {
    num: '03',
    title: 'EDIT',
    accent: '#c0c0c0',
    copy: 'Cutting raw footage until only the pulse is left. Pacing is the invisible art — you feel it or you don’t.',
    tags: ['VIDEO EDIT', 'MOTION', 'SOUND SYNC'],
  },
]

export function Craft() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', track.current!)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 1,
          end: () => `+=${window.innerHeight * 2.4}`,
          anticipatePin: 1,
        },
      })
      tl.to(track.current, { xPercent: -100 * (panels.length - 1) / panels.length, ease: 'none' })

      // giant numbers drift slower for depth
      panels.forEach((p) => {
        tl.fromTo(
          p.querySelector('[data-num]'),
          { xPercent: 30 },
          { xPercent: -30, ease: 'none' },
          0,
        )
      })
      return () => tl.scrollTrigger?.kill()
    })

    // mobile: simple vertical reveals
    mm.add('(max-width: 767px)', () => {
      gsap.utils.toArray<HTMLElement>('[data-panel]', track.current!).forEach((p) => {
        gsap.fromTo(
          p,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: p, start: 'top 80%' },
          },
        )
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={root} className="relative z-10 overflow-hidden">
      <div className="px-5 md:px-12 pt-20 md:pt-28 pb-6 flex items-end justify-between">
        <h2 className="font-display font-bold text-[clamp(1.6rem,3.4vw,3rem)]">THE CRAFT</h2>
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">SCROLL → THREE ACTS</span>
      </div>

      <div
        ref={track}
        className="flex flex-col md:flex-row md:w-[300%] will-change-transform"
      >
        {CRAFTS.map((c) => (
          <article
            key={c.num}
            data-panel
            className="relative w-full md:w-1/3 min-h-[70vh] md:h-[78vh] flex items-center px-5 md:px-16 shrink-0"
          >
            {/* ghost number */}
            <span
              data-num
              aria-hidden
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 font-display font-extrabold leading-none select-none pointer-events-none"
              style={{
                fontSize: 'clamp(9rem, 26vw, 24rem)',
                color: 'transparent',
                WebkitTextStroke: `1.5px ${c.accent}44`,
              }}
            >
              {c.num}
            </span>

            <div className="relative max-w-md">
              <p className="font-mono text-[10px] tracking-[0.4em] mb-4" style={{ color: c.accent }}>
                ACT {c.num}
              </p>
              <h3 className="font-display font-extrabold text-[clamp(3rem,7vw,6.5rem)] leading-none mb-6">
                {c.title}
                <span style={{ color: c.accent }}>.</span>
              </h3>
              <p className="font-mono text-sm md:text-[15px] leading-relaxed text-white/70 mb-8">
                {c.copy}
              </p>
              <div className="flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-white/15 px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] text-white/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
