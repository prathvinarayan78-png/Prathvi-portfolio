import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextReveal } from '../ui/TextReveal'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  'BRAND IDENTITY', 'POSTER / PRINT', 'VIDEO EDITING', 'MOTION DESIGN',
  'AI AGENTS', 'AUTOMATION PIPELINES', 'CREATIVE CODING',
]

const STATS = [
  { n: 3, suffix: '+', label: 'DISCIPLINES' },
  { n: 100, suffix: '%', label: 'OBSESSION' },
  { n: 24, suffix: 'H', label: 'RESPONSE TIME' },
]

export function Studio() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // stat counters
      document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count)
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: target,
            duration: 1.6,
            snap: { innerText: 1 },
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
      })
      // list items
      gsap.fromTo(
        '[data-skill]',
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, stagger: 0.07, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '[data-skill]', start: 'top 85%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="studio" className="relative z-10 py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <p className="font-mono text-[11px] tracking-[0.35em] text-[#4488ff] mb-6">// THE STUDIO</p>
          <TextReveal
            className="font-display font-bold text-[clamp(1.6rem,3.2vw,2.8rem)] leading-tight"
            lines={[
              'One person. Three crafts.',
              'I design the visual, edit the',
              'story, and build the agents',
              'that scale both.',
            ]}
          />

          <div className="grid grid-cols-3 gap-6 mt-16">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display font-bold text-4xl md:text-5xl">
                  <span data-count={s.n}>0</span>
                  <span className="text-[#ffaa33]">{s.suffix}</span>
                </p>
                <p className="font-mono text-[10px] tracking-[0.25em] text-white/40 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <ul className="self-center">
          {SKILLS.map((s, i) => (
            <li
              key={s}
              data-skill
              className="flex items-center gap-4 py-4 border-b border-white/10 font-mono text-sm tracking-[0.2em] text-white/70 hover:text-white hover:pl-3 transition-all duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4488ff]" />
              {s}
              <span className="ml-auto text-[10px] text-white/30">{String(i + 1).padStart(2, '0')}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
