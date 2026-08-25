import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextReveal } from '../ui/TextReveal'
import { useCursorLabel } from '../ui/CustomCursor'
import { EDIT_WORK } from '../../data/work'

gsap.registerPlugin(ScrollTrigger)

/* ACT III — EDITING: cinematic 16:9 frames with letterbox bars that
   open like a shutter, timecode ticker, optional hover-play video. */

export function EditGallery() {
  const root = useRef<HTMLElement>(null)
  const cursor = useCursorLabel('PLAY')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-shot]', root.current!).forEach((el) => {
        const bars = el.querySelectorAll('[data-bar]')
        gsap.fromTo(
          bars,
          { scaleY: 1 },
          {
            scaleY: 0, duration: 1.1, ease: 'power4.inOut',
            scrollTrigger: { trigger: el, start: 'top 75%' },
          },
        )
        gsap.fromTo(
          el.querySelector('img'),
          { scale: 1.18 },
          {
            scale: 1, duration: 1.6, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 75%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="edit" className="relative z-10 py-24 md:py-36 px-5 md:px-12 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-4">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#c0c0c0]">ACT III — EDITING</p>
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/30">({String(EDIT_WORK.length).padStart(2, '0')})</span>
      </div>
      <TextReveal
        className="font-display font-extrabold text-[clamp(2.4rem,7vw,6rem)] leading-none mb-14 md:mb-20"
        lines={[<>CUT TO <span className="text-[#c0c0c0]">FEELING</span></>]}
      />

      <div className="space-y-16 md:space-y-28">
        {EDIT_WORK.map((p) => (
          <figure key={p.title} data-shot {...cursor} className="group relative">
            <div className="relative overflow-hidden border border-white/10 bg-black">
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                className="w-full aspect-video object-cover will-change-transform"
              />
              {p.video && (
                <video
                  src={p.video}
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                />
              )}

              {/* shutter letterbox bars */}
              <span data-bar className="absolute inset-x-0 top-0 h-1/2 bg-[#0a0a0a] origin-top" />
              <span data-bar className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0a0a0a] origin-bottom" />

              {/* HUD */}
              <span className="absolute top-3 left-4 font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-white/60">
                ● REC — {p.kind}
              </span>
              <span className="absolute bottom-3 right-4 font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-white/60 tabular-nums">
                00:00 / {p.duration}
              </span>
              {/* center play glyph */}
              <span className="absolute inset-0 m-auto w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-400">
                <span className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-white ml-1" />
              </span>
            </div>

            <figcaption className="flex items-baseline justify-between mt-4">
              <p className="font-display font-bold text-xl md:text-2xl">{p.title}</p>
              <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-white/40">{p.year}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
