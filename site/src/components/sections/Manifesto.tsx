import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Word-by-word illumination as you scroll — the manifesto reads itself. */

const TEXT =
  'Most designers can’t build. Most developers can’t design. Most editors do neither. I live in the overlap — work that looks sharp, moves right and cuts deep.'

export function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 0.8,
          },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative z-10 py-28 md:py-44 px-5 md:px-12">
      <p className="font-mono text-[10px] tracking-[0.4em] text-[#4488ff] mb-8 max-w-5xl mx-auto">
        // MANIFESTO
      </p>
      <p className="max-w-5xl mx-auto font-display font-bold text-[clamp(1.7rem,4.2vw,3.8rem)] leading-[1.25]">
        {TEXT.split(' ').map((w, i) => (
          <span key={i} data-word className="inline-block mr-[0.28em]">
            {w === 'overlap' ? <span className="text-[#ffaa33]">{w}</span> : w}
          </span>
        ))}
      </p>
    </section>
  )
}
