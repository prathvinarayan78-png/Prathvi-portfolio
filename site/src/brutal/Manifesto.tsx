import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Word-slam manifesto — words punch in one by one as you scroll. */

const WORDS =
  'MOST PORTFOLIOS WHISPER. THIS ONE SHOUTS. I MAKE POSTERS THAT PUNCH, SITES THAT SLAP AND CUTS THAT LAND.'.split(' ')

export function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-w]',
        { scale: 0, rotation: () => (Math.random() - 0.5) * 30 },
        {
          scale: 1, rotation: 0,
          ease: 'back.out(2.5)',
          stagger: 0.05,
          duration: 0.4,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="acid border-y-[3px] border-[#0a0a0a] px-4 md:px-8 py-16 md:py-24">
      <p className="mega text-[clamp(1.6rem,5vw,4.4rem)] max-w-6xl leading-[1.02]">
        {WORDS.map((w, i) => (
          <span key={i} data-w className="inline-block mr-[0.3em] will-change-transform">
            {['SHOUTS.', 'PUNCH,', 'SLAP', 'LAND.'].includes(w) ? (
              <span className="pop px-2 inline-block -rotate-1">{w}</span>
            ) : (
              w
            )}
          </span>
        ))}
      </p>
    </section>
  )
}
