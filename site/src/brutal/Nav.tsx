import { useEffect, useRef, useState } from 'react'

/* HEADER v2 — an outstanding one.
   · logo: letters split-flap shuffle on hover, star spins on scroll
   · center: live ticker cell (time / availability / scroll %)
   · links: glitch-shift hover with layered color copies
   · bar: solid slab that compresses + grows a bottom progress edge */

const GLYPHS = '!<>-_\\/[]{}—=+*^?#'

function FlapLogo() {
  const ref = useRef<HTMLSpanElement>(null)
  const busy = useRef(false)
  const NAME = 'PRATHVI'

  const shuffle = () => {
    if (busy.current || !ref.current) return
    busy.current = true
    const spans = ref.current.querySelectorAll('[data-l]')
    spans.forEach((sp, i) => {
      const target = NAME[i]
      let n = 0
      const max = 6 + i * 2
      const id = setInterval(() => {
        n++
        sp.textContent = n >= max ? target : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        if (n >= max) {
          clearInterval(id)
          if (i === spans.length - 1) busy.current = false
        }
      }, 34)
    })
  }

  return (
    <span ref={ref} onMouseEnter={shuffle} className="inline-flex">
      {NAME.split('').map((c, i) => (
        <span key={i} data-l className="inline-block w-[1ch] text-center">
          {c}
        </span>
      ))}
    </span>
  )
}

function GlitchLink({ href, children, className = '' }: { href: string; children: string; className?: string }) {
  return (
    <a href={href} data-noclick className={`relative group overflow-hidden ${className}`}>
      <span className="relative z-10 group-hover:animate-[glitchShift_0.25s_steps(2)_infinite]">{children}</span>
      {/* layered color ghosts appear on hover */}
      <span aria-hidden className="absolute inset-0 z-0 flex items-center px-4 md:px-6 text-[#ff4d00] opacity-0 group-hover:opacity-100 translate-x-[2px]">
        {children}
      </span>
      <span aria-hidden className="absolute inset-0 z-0 flex items-center px-4 md:px-6 text-[#00ffa3] opacity-0 group-hover:opacity-100 -translate-x-[2px]">
        {children}
      </span>
    </a>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [tick, setTick] = useState(0)
  const bar = useRef<HTMLDivElement>(null)
  const star = useRef<HTMLSpanElement>(null)

  // ticker cell cycles through 3 readouts
  const [time, setTime] = useState('')
  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })
    const clock = () => setTime(f.format(new Date()))
    clock()
    const t1 = setInterval(clock, 30000)
    const t2 = setInterval(() => setTick((t) => (t + 1) % 3), 3000)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  const [pct, setPct] = useState(0)
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      setPct(Math.round((max > 0 ? scrollY / max : 0) * 100))
      setScrolled(scrollY > 40)
      if (star.current) star.current.style.transform = `rotate(${scrollY * 0.15}deg)`
      if (bar.current) bar.current.style.setProperty('--p', `${max > 0 ? (scrollY / max) * 100 : 0}%`)
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])

  const READOUTS = [
    `DEL ${time} IST`,
    'STATUS: OPEN FOR WORK',
    `${String(pct).padStart(3, '0')}% EXPLORED`,
  ]

  return (
    <header
      ref={bar}
      className={`fixed top-0 left-0 right-0 z-50 border-b-[3px] border-current bg-page transition-all duration-300 ${
        scrolled ? 'shadow-[0_6px_0_0_rgba(255,77,0,0.9)]' : ''
      }`}
      style={{
        // progress edge painted along the bottom border
        backgroundImage: 'linear-gradient(to right, #ff4d00 var(--p, 0%), transparent var(--p, 0%))',
        backgroundSize: '100% 4px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
      }}
    >
      <div className="flex items-stretch justify-between">
        {/* logo cell */}
        <a
          href="#top"
          data-noclick
          className={`font-black uppercase px-4 md:px-8 flex items-center gap-1 transition-all duration-300 ${
            scrolled ? 'py-2 md:py-2.5 text-base md:text-lg' : 'py-3 md:py-4 text-lg md:text-xl'
          }`}
        >
          <FlapLogo />
          <span ref={star} className="inline-block text-[#ff4d00] will-change-transform">✱</span>
        </a>

        {/* center live ticker — hidden on small screens */}
        <div className="hidden lg:flex items-center border-l-[3px] border-current px-6 min-w-[240px] justify-center overflow-hidden">
          <span key={tick} className="font-bold text-[11px] tracking-[0.22em] uppercase animate-[tickerIn_0.3s_ease_both] tabular-nums">
            {READOUTS[tick]}
          </span>
        </div>

        {/* links */}
        <nav className="flex items-stretch font-bold text-[11px] md:text-sm uppercase">
          <GlitchLink href="#work" className="hidden sm:flex items-center px-4 md:px-6 border-l-[3px] border-current hover:bg-[#0a0a0a] hover:text-white transition-colors">
            Work
          </GlitchLink>
          <GlitchLink href="#lab" className="hidden md:flex items-center px-4 md:px-6 border-l-[3px] border-current hover:bg-[#0a0a0a] hover:text-white transition-colors">
            Lab
          </GlitchLink>
          <a
            href="#contact"
            data-noclick
            className="flex items-center gap-2 px-4 md:px-6 border-l-[3px] border-current bg-[#ff4d00] text-[#0a0a0a] hover:bg-[#00ffa3] transition-colors relative overflow-hidden group glow-orange"
          >
            <span className="w-2 h-2 rounded-full bg-[#0a0a0a] blink" />
            Hire me
            {/* sweep shine */}
            <span aria-hidden className="absolute inset-y-0 -left-full w-1/2 bg-white/30 skew-x-[-20deg] group-hover:left-[130%] transition-all duration-500" />
          </a>
        </nav>
      </div>
    </header>
  )
}
