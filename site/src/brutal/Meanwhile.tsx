import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* MEANWHILE — pinned interlude; a fake terminal types itself out
   while giant ghost text scrolls behind. Pure vibes. */

const LINES = [
  '> initializing prathvi.exe ...',
  '> loading taste ............ OK',
  '> loading speed ............ OK',
  '> loading humility ......... 404',
  '> deploying portfolio ...... DONE',
  '> hire while stocks last_',
]

export function Meanwhile() {
  const root = useRef<HTMLElement>(null)
  const term = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = term.current!.querySelectorAll('[data-t]')
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 0.5,
          end: () => `+=${innerHeight * (innerWidth < 768 ? 1.0 : 1.6)}`,
        },
      })
      rows.forEach((row, i) => {
        const text = row.getAttribute('data-text')!
        tl.to(row, {
          text,
          duration: 1,
          ease: 'none',
          onUpdate() {
            const p = this.progress()
            row.textContent = text.slice(0, Math.ceil(p * text.length))
          },
        }, i * 0.8)
      })
      gsap.to('[data-ghost]', {
        xPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative min-h-[90svh] overflow-hidden border-t-[3px] border-current flex items-center">
      <span
        data-ghost
        aria-hidden
        className="absolute top-1/2 -translate-y-1/2 left-0 mega text-[clamp(8rem,30vw,26rem)] opacity-[0.05] whitespace-nowrap select-none pointer-events-none"
      >
        MEANWHILE IN DELHI MEANWHILE IN DELHI
      </span>

      <div className="relative w-full px-4 md:px-8">
        <div ref={term} className="slab max-w-2xl mx-auto p-5 md:p-8 bg-page" data-noclick>
          <div className="flex gap-2 mb-4">
            <span className="w-3.5 h-3.5 rounded-full pop border-[2.5px] border-current" />
            <span className="w-3.5 h-3.5 rounded-full acid border-[2.5px] border-current" />
            <span className="w-3.5 h-3.5 rounded-full blue border-[2.5px] border-current" />
          </div>
          {LINES.map((l, i) => (
            <p key={i} data-t data-text={l} className="font-bold text-xs md:text-base uppercase leading-loose min-h-[1.8em]" />
          ))}
        </div>
      </div>
    </section>
  )
}
