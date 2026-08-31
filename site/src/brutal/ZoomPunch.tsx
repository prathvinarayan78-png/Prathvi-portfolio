import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* HIRE — pinned zoom-punch: the word starts microscopic and scroll
   scales it until it fills (and overflows) the screen, then releases. */

export function ZoomPunch() {
  const root = useRef<HTMLElement>(null)
  const word = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        word.current,
        { scale: 0.04, rotation: -8 },
        {
          scale: 34,
          rotation: 0,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 0.5,
            end: () => `+=${innerHeight * 1.8}`,
          },
        },
      )
      gsap.fromTo(
        '[data-zp-hint]',
        { opacity: 1 },
        {
          opacity: 0,
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=30%', scrub: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden border-t-[3px] border-current grid place-items-center">
      <p data-zp-hint className="absolute top-24 left-1/2 -translate-x-1/2 font-bold text-xs md:text-sm uppercase whitespace-nowrap">
        scroll to inflate my ego ↓
      </p>
      <div ref={word} className="mega text-[12vw] text-[#ff4d00] will-change-transform select-none">
        HIRE*ME
      </div>
    </section>
  )
}
