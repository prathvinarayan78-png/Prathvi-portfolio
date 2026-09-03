import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* A—Z SKILL WALL — the whole alphabet, each letter mapped to a skill.
   Letters flip in as you scroll; hover flips them to the skill. */

const AZ: Record<string, string> = {
  A: 'AFTER EFFECTS', B: 'BRANDING', C: 'COLOR GRADING', D: 'DAVINCI',
  E: 'EDITING', F: 'FIGMA', G: 'GSAP', H: 'HTML/CSS',
  I: 'ILLUSTRATOR', J: 'JAVASCRIPT', K: 'KEYFRAMES', L: 'LOGOS',
  M: 'MOTION', N: 'NEXT.JS', O: 'OBSESSION', P: 'PHOTOSHOP',
  Q: 'QUICK DRAFTS', R: 'REACT', S: 'SOUND SYNC', T: 'THREE.JS',
  U: 'UI DESIGN', V: 'VIDEO', W: 'WEBFLOW', X: 'X-HEIGHT NERD',
  Y: 'YES ENERGY', Z: 'ZERO TEMPLATES',
}

export function Alphabet() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-az]',
        { rotateX: 90, opacity: 0 },
        {
          rotateX: 0, opacity: 1,
          duration: 0.5, ease: 'back.out(1.8)',
          stagger: { each: 0.03, from: 'random' },
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="px-4 md:px-8 py-36 md:py-60 border-b-[3px] border-current">
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <h2 className="mega text-[clamp(2.6rem,9vw,8rem)]">
          A<span className="text-[#ff4d00]">—</span>Z
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase">26 letters. 26 weapons. hover them.</span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-[3px]" style={{ perspective: '800px' }}>
        {Object.entries(AZ).map(([l, skill]) => (
          <div
            key={l}
            data-az
            onTouchStart={(e) => {
              const el = e.currentTarget
              el.classList.add('tapped')
              setTimeout(() => el.classList.remove('tapped'), 1200)
            }}
            className="group relative aspect-square border-[3px] border-current flex items-center justify-center overflow-hidden cursor-crosshair will-change-transform"
          >
            <span className="mega text-[clamp(1.6rem,4.5vw,3.4rem)] group-hover:opacity-0 transition-opacity duration-100">
              {l}
            </span>
            <span className="absolute inset-0 acid flex items-center justify-center text-center font-black uppercase text-[9px] md:text-[11px] px-1 leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-100">
              {skill}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
