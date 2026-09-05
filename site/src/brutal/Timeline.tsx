import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* THE*ROAD v2 — single-rail timeline. One spine on the left, every
   card branches off it with its own connector + node. No alternating
   margins (that layout broke three times) — geometry that cannot
   misalign. Scroll still draws the line; cards punch in as reached. */

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
      // spine draws downward with scroll
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-rail]', start: 'top 62%', end: 'bottom 75%', scrub: 0.4 },
        },
      )
      // cards slide in from the right as the line reaches them
      gsap.utils.toArray<HTMLElement>('[data-ev]').forEach((el) => {
        gsap.fromTo(
          el,
          { x: 60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: el, start: 'top 74%' },
          },
        )
        // node pops right after
        gsap.fromTo(
          el.querySelector('[data-node]'),
          { scale: 0 },
          {
            scale: 1, duration: 0.35, ease: 'back.out(3)',
            scrollTrigger: { trigger: el, start: 'top 72%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative px-4 md:px-8 py-20 md:py-28 border-t-[3px] border-current overflow-hidden">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <h2 data-wipe className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
          <span aria-hidden className="num-ghost mega absolute -top-6 md:-top-10 left-0 text-[clamp(1.6rem,4vw,3rem)]">/08</span>
          THE<span className="text-[#ff4d00]">*</span>ROAD
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase">scroll draws the line</span>
      </div>

      <div data-rail className="relative max-w-5xl mx-auto pl-10 md:pl-16">
        {/* the single spine — hugs the left edge of the rail */}
        <div className="absolute left-2.5 md:left-4 top-0 bottom-0 w-[5px] md:w-[6px] bg-current opacity-15" />
        <div
          ref={line}
          className="absolute left-2.5 md:left-4 top-0 bottom-0 w-[5px] md:w-[6px] bg-[#ff4d00] origin-top will-change-transform"
        />

        <div className="space-y-10 md:space-y-14">
          {EVENTS.map((e) => (
            <div key={e.y} data-ev className="relative will-change-transform">
              {/* node + connector, anchored to THIS card — cannot detach */}
              <span
                data-node
                className="absolute top-7 -left-[34px] md:-left-[54px] w-5 h-5 md:w-6 md:h-6 border-[3px] border-current bg-[#ff4d00] will-change-transform"
              />
              <span className="absolute top-9 md:top-[38px] -left-[14px] md:-left-[30px] h-[4px] w-[14px] md:w-[30px] bg-[#ff4d00]" />

              <div className="slab bg-page p-5 md:p-6" data-noclick>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-black text-[10px] md:text-xs text-[#ff4d00] border-[2.5px] border-[#ff4d00] px-2 py-0.5">
                    {e.y}
                  </span>
                </div>
                <p className="mega text-[clamp(1.2rem,3.4vw,2rem)] mt-3 break-words">{e.t}</p>
                <p className="font-bold text-[10px] md:text-xs uppercase mt-2 opacity-70 leading-relaxed break-words">{e.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* terminus flag */}
        <div className="relative mt-10 md:mt-14 -left-[6px]">
          <span className="inline-block slab case-card acid font-black uppercase text-xs md:text-sm px-4 py-2 rotate-[-2deg]" data-noclick>
            NEXT STOP: YOUR PROJECT →
          </span>
        </div>
      </div>
    </section>
  )
}
