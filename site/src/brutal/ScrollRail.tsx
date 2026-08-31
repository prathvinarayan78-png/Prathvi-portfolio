import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Pinned rail — a giant sentence scrubs horizontally as you scroll,
   with alternating filled/outlined words. */

const WORDS = ['DESIGN', '★', 'BUILD', '★', 'EDIT', '★', 'REPEAT', '★', 'LOUDER', '★']

export function ScrollRail() {
  const root = useRef<HTMLElement>(null)
  const rail = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const w = rail.current!.scrollWidth - innerWidth
      gsap.to(rail.current, {
        x: -w,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 0.6,
          end: () => `+=${w}`,
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="overflow-hidden border-y-[3px] border-current h-[100svh] flex flex-col justify-center relative">
      <p className="absolute top-5 left-4 md:left-8 font-bold text-[10px] md:text-xs uppercase opacity-60">
        the loop
      </p>
      <div ref={rail} className="flex items-center gap-10 md:gap-16 py-10 md:py-16 px-8 w-max will-change-transform">

        {WORDS.map((w, i) =>
          w === '★' ? (
            <span key={i} className="mega text-[clamp(2rem,6vw,5rem)] text-[#ff4d00]">★</span>
          ) : (
            <span
              key={i}
              className="mega text-[clamp(4rem,16vw,15rem)] whitespace-nowrap"
              style={
                i % 4 === 2
                  ? { WebkitTextStroke: '2.5px currentColor', color: 'transparent' }
                  : undefined
              }
            >
              {w}
            </span>
          ),
        )}
      </div>
      <p className="absolute bottom-5 right-4 md:right-8 font-bold text-[10px] md:text-xs uppercase opacity-60">
        scroll drives it →
      </p>
    </section>
  )
}
