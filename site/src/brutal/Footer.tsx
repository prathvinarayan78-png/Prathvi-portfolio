import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Marquee } from './Marquee'

gsap.registerPlugin(ScrollTrigger)

/* FOOTER v2 — THE FINALE.
   · giant TALK letters rise from below the fold, each hover-poppable
   · smash-to-email now erupts confetti squares on every hit
   · live footer status strip + big signature stamp
   · social slabs with per-letter hover jump */

const CONFETTI = ['#ff4d00', '#00ffa3', '#2f49ff', '#ffffff']

export function Footer() {
  const root = useRef<HTMLElement>(null)
  const btnWrap = useRef<HTMLDivElement>(null)
  const [smashes, setSmashes] = useState(0)
  const [time, setTime] = useState('')

  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })
    const clock = () => setTime(f.format(new Date()))
    clock()
    const id = setInterval(clock, 30000)
    return () => clearInterval(id)
  }, [])

  // giant letters rise like buildings as the footer enters
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-big]',
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '[data-bigwrap]', start: 'top 85%' },
        },
      )
      gsap.fromTo(
        '[data-stamp]',
        { scale: 0, rotation: -30 },
        {
          scale: 1, rotation: -8, duration: 0.5, ease: 'back.out(2.5)', delay: 0.6,
          scrollTrigger: { trigger: '[data-bigwrap]', start: 'top 85%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  const pop = (e: React.MouseEvent<HTMLSpanElement>) => {
    gsap.fromTo(
      e.currentTarget,
      { yPercent: -12, rotation: (Math.random() - 0.5) * 8, color: '#ff4d00' },
      { yPercent: 0, rotation: 0, color: 'inherit', duration: 0.6, ease: 'elastic.out(1,0.35)' },
    )
  }

  const confetti = (x: number, y: number) => {
    for (let i = 0; i < 16; i++) {
      const bit = document.createElement('span')
      bit.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;background:${CONFETTI[i % 4]};z-index:99;pointer-events:none;`
      document.body.appendChild(bit)
      gsap.to(bit, {
        x: (Math.random() - 0.5) * 360,
        y: -(80 + Math.random() * 260),
        rotation: Math.random() * 540,
        duration: 0.9 + Math.random() * 0.5,
        ease: 'power2.out',
        onComplete: () => bit.remove(),
      })
      gsap.to(bit, { opacity: 0, delay: 0.7, duration: 0.4 })
    }
  }

  const smash = (e: React.MouseEvent<HTMLButtonElement>) => {
    confetti(e.clientX, e.clientY)
    gsap.fromTo(btnWrap.current, { scale: 0.94 }, { scale: 1, duration: 0.35, ease: 'elastic.out(1,0.4)' })
    setSmashes((s) => s + 1)
    if (smashes + 1 >= 5) {
      window.location.href = 'mailto:hello@prathvi.design?subject=OK OK I SMASHED THE BUTTON'
    }
  }

  return (
    <footer ref={root} id="contact" className="relative z-10">
      <Marquee items={['HIRE ME', 'OR REGRET IT', 'HELLO@PRATHVI.DESIGN', 'DELHI IN']} speed={14} />

      {/* live status strip */}
      <div className="border-b-[3px] border-current grid grid-cols-2 md:grid-cols-4 font-bold text-[10px] md:text-xs uppercase">
        {[
          ['LOCAL TIME', `${time} IST`],
          ['STATUS', 'OPEN FOR WORK'],
          ['NEXT SLOT', 'THIS WEEK'],
          ['MOOD', 'DANGEROUSLY CAFFEINATED'],
        ].map(([k, v], i) => (
          <div key={k} className={`px-4 md:px-6 py-4 flex flex-col gap-1 ${i > 0 ? 'border-l-[3px] border-current' : ''} ${i > 1 ? 'border-t-[3px] md:border-t-0' : ''}`}>
            <span className="opacity-50">{k}</span>
            <span className={`font-black text-xs md:text-sm ${i === 1 ? 'text-[#00ffa3]' : ''}`}>{v}</span>
          </div>
        ))}
      </div>

      {/* THE BIG WORD */}
      <div data-bigwrap className="relative px-4 md:px-8 pt-20 md:pt-32 pb-10 text-center overflow-hidden">
        <p className="font-bold text-xs md:text-sm uppercase mb-8">got a project? prove it ↓</p>

        <div className="relative inline-block">
          <h2 className="mega text-[clamp(4.5rem,21vw,20rem)] leading-[0.85] select-none cursor-default">
            {'TALK'.split('').map((c, i) => (
              <span
                key={i}
                data-big
                onMouseEnter={pop}
                className="inline-block will-change-transform"
              >
                {c}
              </span>
            ))}
          </h2>
          {/* signature stamp overlapping the word */}
          <span
            data-stamp
            className="absolute -top-4 -right-6 md:-right-16 slab case-card acid font-black uppercase text-[10px] md:text-sm px-3 md:px-5 py-1.5 md:py-2.5 will-change-transform"
          >
            TO ME ★ NOW
          </span>
        </div>

        <div ref={btnWrap} className="mt-12 will-change-transform inline-block">
          <button
            data-noclick
            onClick={smash}
            className="slab case-card pop glow-mint font-black uppercase text-base md:text-2xl px-8 md:px-14 py-4 md:py-6 jitter"
          >
            {smashes === 0 && 'SMASH TO EMAIL'}
            {smashes === 1 && 'HARDER.'}
            {smashes === 2 && 'HARDER!!'}
            {smashes === 3 && 'ALMOST...'}
            {smashes === 4 && 'ONE MORE!!!'}
            {smashes >= 5 && 'OPENING... ✉'}
          </button>
        </div>

        <p className="font-bold text-[10px] md:text-xs uppercase mt-6 opacity-60">
          {5 - Math.min(smashes, 5)} smashes to contact. confetti is free.
        </p>

        {/* socials */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-14 font-bold text-[11px] md:text-xs uppercase">
          {['INSTAGRAM', 'BEHANCE', 'GITHUB', 'X/TWITTER'].map((s) => (
            <a key={s} href="#" className="slab shadow-pop-orange px-4 py-2 bg-page" data-noclick>
              {s} ↗
            </a>
          ))}
        </div>
      </div>

      {/* base plate */}
      <div className="border-t-[3px] border-current px-4 md:px-8 py-5 flex flex-wrap items-center justify-between gap-3 font-bold text-[10px] md:text-[11px] uppercase">
        <span>© 2026 PRATHVI — NO TEMPLATES WERE HARMED</span>
        <button
          data-noclick
          onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
          className="slab bg-page px-3 py-1.5 font-black"
        >
          ↑ BACK TO THE TOP
        </button>
        <span>MADE LOUD IN DELHI</span>
      </div>
    </footer>
  )
}
