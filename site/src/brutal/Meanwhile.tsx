import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* MEANWHILE v2 — rebuilt, ZERO pinning. Normal page flow.
   The terminal types itself automatically once it enters the
   viewport (time-based, not scrub-based), with a blinking caret.
   Ghost text drifts with scroll behind it. Blackout impossible. */

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
  const started = useRef(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ghost banner drifts with scroll — plain scrub, no pin
      gsap.fromTo(
        '[data-ghost]',
        { xPercent: 6 },
        {
          xPercent: -30,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        },
      )

      // terminal slab slams in when it arrives
      gsap.fromTo(
        term.current,
        { y: 70, opacity: 0, rotation: -1.5 },
        {
          y: 0, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.6)',
          scrollTrigger: { trigger: term.current, start: 'top 85%' },
        },
      )

      // typing starts once, when the terminal is properly on screen
      ScrollTrigger.create({
        trigger: term.current,
        start: 'top 70%',
        onEnter: () => {
          if (started.current) return
          started.current = true
          const rows = term.current!.querySelectorAll<HTMLElement>('[data-t]')
          let delay = 0
          rows.forEach((row, ri) => {
            const text = row.dataset.text!
            const dur = Math.max(0.5, text.length * 0.028)
            const state = { n: 0 }
            gsap.to(state, {
              n: text.length,
              duration: dur,
              delay,
              ease: 'none',
              onUpdate: () => {
                row.textContent = text.slice(0, Math.round(state.n))
                // caret on the row currently typing
                row.classList.add('caret')
              },
              onComplete: () => {
                row.textContent = text
                if (ri < rows.length - 1) row.classList.remove('caret')
              },
            })
            delay += dur + 0.25
          })
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden border-t-[3px] border-current py-20 md:py-28">
      <span
        data-ghost
        aria-hidden
        className="absolute top-1/2 -translate-y-1/2 left-0 mega text-[clamp(6rem,24vw,20rem)] opacity-[0.05] whitespace-nowrap select-none pointer-events-none"
      >
        MEANWHILE IN DELHI MEANWHILE IN DELHI
      </span>

      <div className="relative w-full px-4 md:px-8">
        <div ref={term} className="slab max-w-2xl mx-auto p-5 md:p-8 bg-page will-change-transform" data-noclick>
          <div className="flex gap-2 mb-5">
            <span className="w-3.5 h-3.5 rounded-full pop border-[2.5px] border-current" />
            <span className="w-3.5 h-3.5 rounded-full acid border-[2.5px] border-current" />
            <span className="w-3.5 h-3.5 rounded-full blue border-[2.5px] border-current" />
          </div>
          {LINES.map((l, i) => (
            <p key={i} data-t data-text={l} className="font-bold text-xs md:text-base uppercase leading-loose min-h-[1.9em]" />
          ))}
        </div>
      </div>
    </section>
  )
}
