import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* THE*ROAD — vertical timeline; a thick line draws itself down as you
   scroll and events pop in when the line reaches them. */

const EVENTS = [
  { y: 'DAY 0', t: 'FIRST PIRATED PHOTOSHOP*', d: '*statute of limitations applies. fell in love with layers.' },
  { y: 'YEAR 1', t: 'POSTERS FOR FRIENDS', d: 'birthday cards, mixtape covers, gig flyers. all terrible. all loved.' },
  { y: 'YEAR 2', t: 'FIRST PAID EDIT', d: 'a wedding video. cried twice. once from the couple, once from the render time.' },
  { y: 'YEAR 3', t: 'LEARNED TO CODE', d: 'because designers who ship their own sites are unstoppable.' },
  { y: 'YEAR 4', t: 'AI AGENTS ENTERED', d: 'taught robots to do the boring parts. kept the fun parts.' },
  { y: 'NOW', t: 'YOU ARE HERE', d: 'reading my timeline. the next event could have your name in it.' },
]

export function Timeline() {
  const root = useRef<HTMLElement>(null)
  const line = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'bottom 70%', scrub: 0.4 },
        },
      )
      gsap.utils.toArray<HTMLElement>('[data-ev]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { xPercent: i % 2 ? 24 : -24, opacity: 0, scale: 0.8 },
          {
            xPercent: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)',
            scrollTrigger: { trigger: el, start: 'top 72%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative px-4 md:px-8 py-20 md:py-28 border-t-[3px] border-current overflow-hidden">
      <div className="flex items-end justify-between mb-12">
        <h2 data-wipe className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
          <span aria-hidden className="num-ghost mega absolute -top-6 md:-top-10 left-0 text-[clamp(1.6rem,4vw,3rem)]">/08</span>
          THE<span className="text-[#ff4d00]">*</span>ROAD
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase">scroll draws the line</span>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* the line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[6px] -translate-x-1/2 bg-current opacity-15" />
        <div ref={line} className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[6px] -translate-x-1/2 bg-[#ff4d00] origin-top will-change-transform" />

        <div className="space-y-14 md:space-y-24">
          {EVENTS.map((e, i) => (
            <div
              key={e.y}
              data-ev
              className={`relative pl-12 md:pl-0 md:w-[calc(50%-2.5rem)] will-change-transform ${
                i % 2 ? 'md:ml-auto' : ''
              }`}
            >
              {/* node */}
              <span
                className={`absolute top-2 left-4 md:left-auto w-5 h-5 border-[3px] border-current bg-[#ff4d00] -translate-x-1/2 ${
                  i % 2 ? 'md:-left-[2.6rem]' : 'md:-right-[3.2rem] md:left-auto md:translate-x-1/2'
                }`}
              />
              <div className="slab p-4 md:p-5 bg-page" data-noclick>
                <span className="font-black text-[10px] md:text-xs text-[#ff4d00]">{e.y}</span>
                <p className="mega text-[clamp(1.1rem,2.6vw,1.9rem)] mt-1">{e.t}</p>
                <p className="font-bold text-[10px] md:text-xs uppercase mt-2 opacity-70 leading-relaxed">{e.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
