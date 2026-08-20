import { TextReveal } from '../ui/TextReveal'
import { useCursorLabel } from '../ui/CustomCursor'

const SOCIALS = ['INSTAGRAM', 'BEHANCE', 'GITHUB', 'X']

export function Footer() {
  const cursor = useCursorLabel('SAY HI')
  const linkCursor = useCursorLabel('OPEN')

  return (
    <footer id="contact" className="relative z-10 pt-20 md:pt-32 pb-10 px-5 md:px-12 border-t border-white/10 bg-gradient-to-b from-transparent to-black/60">
      {/* marquee */}
      <div className="overflow-hidden mb-20 -mx-5 md:-mx-12">
        <div className="animate-marquee flex whitespace-nowrap font-display font-extrabold text-[clamp(3rem,9vw,9rem)] leading-none text-white/8 uppercase">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="mx-6">Let's build something — </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-end">
        <div>
          <TextReveal
            className="font-display font-bold text-[clamp(2rem,5vw,4.5rem)] leading-none"
            lines={['GOT A', <>PROJECT<span className="text-[#4488ff]">?</span></>]}
          />
          <a
            href="mailto:hello@prathvi.design"
            {...cursor}
            className="inline-block mt-10 border border-white/30 px-8 py-4 font-mono text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-colors duration-300"
          >
            HELLO@PRATHVI.DESIGN ↗
          </a>
        </div>

        <div className="flex flex-col md:items-end gap-6">
          <nav className="flex gap-6 font-mono text-[11px] tracking-[0.25em] text-white/50">
            {SOCIALS.map((s) => (
              <a key={s} href="#" {...linkCursor} className="hover:text-white transition-colors relative group">
                {s}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#ffaa33] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>
          <p className="font-mono text-[10px] tracking-[0.25em] text-white/25">
            ©2026 PRATHVI — MADE WITH R3F + GSAP + OBSESSION
          </p>
        </div>
      </div>
    </footer>
  )
}
