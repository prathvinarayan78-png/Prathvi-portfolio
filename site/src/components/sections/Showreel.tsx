import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextReveal } from '../ui/TextReveal'
import { useCursorLabel } from '../ui/CustomCursor'

gsap.registerPlugin(ScrollTrigger)

/* Museum-style frame that scales up as you scroll, flip-text overlay. */

export function Showreel() {
  const root = useRef<HTMLElement>(null)
  const cursor = useCursorLabel('PLAY')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-frame]',
        { scale: 0.72, rotateX: 8 },
        {
          scale: 1,
          rotateX: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: 1 },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative z-10 py-32 px-6 md:px-12" style={{ perspective: '1200px' }}>
      <TextReveal
        className="font-display font-bold text-[clamp(1.8rem,4.5vw,4rem)] leading-tight mb-16 max-w-4xl"
        lines={[
          'A reel of motion, pixels',
          <>and <span className="text-[#ffaa33]">agents</span> doing the work.</>,
        ]}
      />

      <div
        data-frame
        {...cursor}
        className="relative aspect-video max-w-5xl mx-auto border border-white/15 bg-[#111] overflow-hidden group"
      >
        {/* abstract animated 'reel' placeholder — pure CSS/gradients, no humans */}
        <div className="absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(ellipse at 30% 40%, rgba(68,136,255,0.35), transparent 50%), radial-gradient(ellipse at 70% 65%, rgba(255,170,51,0.28), transparent 55%), linear-gradient(160deg, #101318, #0a0a0a)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[14px] border-l-white ml-1" />
          </div>
        </div>
        {/* frame marks */}
        <span className="absolute top-3 left-4 font-mono text-[10px] tracking-[0.3em] text-white/40">SHOWREEL_2026.MP4</span>
        <span className="absolute bottom-3 right-4 font-mono text-[10px] tracking-[0.3em] text-white/40">00:00 / 01:24</span>
      </div>

      {/* reflection */}
      <div className="max-w-5xl mx-auto h-24 overflow-hidden opacity-20 [transform:scaleY(-1)]"
        style={{
          background: 'linear-gradient(160deg, #101318, transparent)',
          maskImage: 'linear-gradient(to top, transparent, black)',
        }}
      />
    </section>
  )
}
