import { useState } from 'react'
import { Marquee } from './Marquee'

/* FOOTER — smash-the-button contact + giant type. */

export function Footer() {
  const [smashes, setSmashes] = useState(0)

  const smash = () => {
    setSmashes((s) => s + 1)
    if (smashes + 1 >= 5) {
      window.location.href = 'mailto:hello@prathvi.design?subject=OK OK I SMASHED THE BUTTON'
    }
  }

  return (
    <footer id="contact" className="pt-8">
      <Marquee items={['HIRE ME', 'OR REGRET IT', 'HELLO@PRATHVI.DESIGN', 'DELHI IN']} speed={14} />

      <div className="px-4 md:px-8 py-16 md:py-24 text-center">
        <p className="font-bold text-xs md:text-sm uppercase mb-6">Got a project? Prove it.</p>
        <h2 className="mega text-[clamp(3rem,12vw,12rem)]">
          LET'S<span className="text-[#ff4d00]">*</span>TALK
        </h2>

        <button
          data-noclick
          onClick={smash}
          className="slab pop font-black uppercase text-base md:text-2xl px-8 md:px-14 py-4 md:py-6 mt-10 jitter"
        >
          {smashes === 0 && 'SMASH TO EMAIL'}
          {smashes === 1 && 'HARDER.'}
          {smashes === 2 && 'HARDER!!'}
          {smashes === 3 && 'ALMOST...'}
          {smashes === 4 && 'ONE MORE!!!'}
          {smashes >= 5 && 'OPENING... ✉'}
        </button>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-12 font-bold text-[11px] md:text-xs uppercase">
          {['INSTAGRAM', 'BEHANCE', 'GITHUB', 'X/TWITTER'].map((s) => (
            <a key={s} href="#" className="slab px-4 py-2" data-noclick>
              {s} ↗
            </a>
          ))}
        </div>
      </div>

      <div className="border-t-[3px] border-current px-4 md:px-8 py-4 flex flex-wrap justify-between gap-2 font-bold text-[10px] md:text-[11px] uppercase">
        <span>© 2026 PRATHVI — NO TEMPLATES WERE HARMED</span>
        <span>MADE LOUD IN DELHI</span>
      </div>
    </footer>
  )
}
