import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* HIRE*ME v2 — rebuilt, ZERO pinning. The word inflates from small
   to screen-bursting as the section passes naturally through the
   viewport, punching to full size right when it's centered.
   Bonus: click it to make it explode-shake. */

export function ZoomPunch() {
  const root = useRef<HTMLElement>(null)
  const word = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // inflate on the way in, deflate slightly on the way out — all scrubbed
      // to the section's natural travel. no pin, no hostage screen.
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.4,
        },
      })
        .fromTo(word.current, { scale: 0.25, rotation: -6 }, { scale: 1.6, rotation: 2, ease: 'power2.in' })
        .to(word.current, { scale: 2.2, rotation: 0, ease: 'power1.out' })

      // hint fades as the word grows
      gsap.fromTo(
        '[data-zp-hint]',
        { opacity: 1 },
        {
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'top 20%', scrub: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  const punch = () => {
    gsap.fromTo(word.current, { scale: '+=0.35' }, { scale: '-=0.35', duration: 0.5, ease: 'elastic.out(1,0.3)' })
    gsap.fromTo(root.current, { x: 8 }, { x: 0, duration: 0.3, ease: 'elastic.out(1,0.3)' })
  }

  return (
    <section
      ref={root}
      className="relative h-[110svh] overflow-hidden border-t-[3px] border-current grid place-items-center"
    >
      <p
        data-zp-hint
        className="absolute top-14 left-1/2 -translate-x-1/2 font-bold text-xs md:text-sm uppercase whitespace-nowrap"
      >
        scroll inflates my ego ↓
      </p>

      <div
        ref={word}
        onClick={punch}
        data-noclick
        className="mega text-[clamp(4rem,14vw,13rem)] text-[#ff4d00] will-change-transform select-none cursor-pointer leading-none"
      >
        HIRE*ME
      </div>

      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-bold text-[10px] md:text-xs uppercase opacity-60 whitespace-nowrap">
        (click it. it can take the hit.)
      </p>
    </section>
  )
}
