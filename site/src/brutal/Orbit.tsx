import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* TOOL*BELT — a ring of tool chips that rotates with scroll velocity;
   the whole wheel spins as you travel past it. */

const TOOLS = ['PS', 'AI', 'AE', 'PR', 'DV', 'FIGMA', 'REACT', 'THREE', 'GSAP', 'TS', 'NODE', 'BLENDER']

export function Orbit() {
  const root = useRef<HTMLElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ring.current,
        { rotation: -70 },
        {
          rotation: 200,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  const R = 42 // vw-ish radius in %

  return (
    <section ref={root} className="relative overflow-hidden border-t-[3px] border-current py-40 md:py-64 grid place-items-center min-h-[110svh]">
      <div className="text-center relative z-10 px-4" data-noclick>
        <p className="font-bold text-xs md:text-sm uppercase mb-3">the arsenal</p>
        <h2 className="mega text-[clamp(2.6rem,9vw,8rem)]">
          TOOL<span className="text-[#2f49ff]">*</span>BELT
        </h2>
        <p className="font-bold text-[10px] md:text-xs uppercase mt-3 opacity-60">scroll spins the wheel</p>
      </div>

      {/* rotating ring */}
      <div
        ref={ring}
        className="absolute w-[150vmin] h-[150vmin] will-change-transform"
        aria-hidden
      >
        {TOOLS.map((t, i) => {
          const a = (i / TOOLS.length) * 360
          return (
            <span
              key={t}
              className="absolute left-1/2 top-1/2 slab bg-page font-black text-xs md:text-lg px-3 md:px-5 py-1.5 md:py-2.5"
              style={{
                transform: `rotate(${a}deg) translateY(-${R}vmin) rotate(${-a}deg) translate(-50%,-50%)`,
              }}
            >
              {t}
            </span>
          )
        })}
      </div>
    </section>
  )
}
