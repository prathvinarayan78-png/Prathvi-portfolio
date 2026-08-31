import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/* LOADING = A GAME. Mash the button to charge 0→100%.
   It drains while you slack. At 100% the screen rips open.
   ENTER key or the tiny skip link bails you out. */

const TAUNTS = [
  'MASH IT.', 'FASTER.', 'PUT SOME ARM INTO IT.', 'MY GRANDMA CLICKS HARDER.',
  'OK NOT BAD.', 'KEEP GOING!!', 'ALMOST THERE.', 'YESSS.',
]

export function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [gone, setGone] = useState(false)
  const pctRef = useRef(0)
  const root = useRef<HTMLDivElement>(null)
  const topHalf = useRef<HTMLDivElement>(null)
  const botHalf = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const opened = useRef(false)

  // drain loop
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      if (!opened.current && pctRef.current > 0) {
        pctRef.current = Math.max(0, pctRef.current - dt * 6) // drains 6%/s
        setPct(Math.round(pctRef.current))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); document.body.style.overflow = '' }
  }, [])

  const open = () => {
    if (opened.current) return
    opened.current = true
    pctRef.current = 100
    setPct(100)
    // rip the screen apart
    const tl = gsap.timeline({
      onComplete: () => { setGone(true); onDone() },
    })
    tl.to(btn.current, { scale: 1.4, rotation: 6, duration: 0.12, ease: 'power2.in' })
      .to(btn.current, { scale: 0, rotation: -20, duration: 0.2, ease: 'back.in(2)' })
      .to(topHalf.current, { yPercent: -100, duration: 0.55, ease: 'power4.inOut' }, '-=0.05')
      .to(botHalf.current, { yPercent: 100, duration: 0.55, ease: 'power4.inOut' }, '<')
  }

  const mash = () => {
    if (opened.current) return
    pctRef.current = Math.min(100, pctRef.current + 9)
    setPct(Math.round(pctRef.current))
    // feedback: button jolt + screen shake scaled by progress
    gsap.fromTo(btn.current, { scale: 0.92, rotation: (Math.random() - 0.5) * 10 }, { scale: 1, rotation: 0, duration: 0.25, ease: 'elastic.out(1,0.4)' })
    gsap.fromTo(root.current, { x: (Math.random() - 0.5) * (4 + pctRef.current / 8) }, { x: 0, duration: 0.2 })
    if (pctRef.current >= 100) open()
  }

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') open()
      if (e.key === ' ') { e.preventDefault(); mash() }
    }
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null

  const taunt = TAUNTS[Math.min(TAUNTS.length - 1, Math.floor(pct / (100 / TAUNTS.length)))]

  return (
    <div ref={root} className="fixed inset-0 z-[200]" data-noclick>
      {/* two halves that rip apart */}
      <div ref={topHalf} className="absolute inset-x-0 top-0 h-1/2 bg-[#0a0a0a] border-b-[6px] border-[#ff4d00] overflow-hidden">
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <span className="mega text-[clamp(2.4rem,9vw,8rem)] leading-none select-none">
            PRATHVI<span className="text-[#ff4d00]">***</span>
          </span>
          <span className="mega text-[clamp(2.4rem,9vw,8rem)] tabular-nums text-[#ff4d00] select-none">
            {String(pct).padStart(3, '0')}
          </span>
        </div>
      </div>
      <div ref={botHalf} className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute top-5 left-4 right-4 flex flex-col items-center gap-5 text-white">
          {/* progress slab */}
          <div className="w-full max-w-xl h-6 border-[3px] border-white">
            <div className="h-full bg-[#ff4d00] transition-[width] duration-100" style={{ width: `${pct}%` }} />
          </div>

          <button
            ref={btn}
            onClick={mash}
            className="slab bg-[#ff4d00] text-[#0a0a0a] font-black uppercase text-lg md:text-3xl px-10 md:px-16 py-5 md:py-7 will-change-transform"
            style={{ boxShadow: '6px 6px 0 0 #fff' }}
          >
            {pct === 0 ? 'MASH TO ENTER' : taunt}
          </button>

          <p className="font-bold text-[10px] md:text-xs uppercase opacity-60 text-center">
            it drains if you stop. spacebar works too.<br />
            <button onClick={open} className="underline opacity-70 hover:opacity-100 mt-1">or skip like a coward ⏎</button>
          </p>
        </div>
      </div>
    </div>
  )
}
