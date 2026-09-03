import { useEffect, useRef, useState } from 'react'

/* BACKDROP — fixed layer behind everything. Fills the voids:
   1. giant outlined watermark word that swaps as you pass zones
   2. drifting blueprint grid (moves with scroll)
   3. huge rotating star + floating coordinates readout
   All driven directly by scrollY in one rAF loop — cheap & smooth. */

const ZONES: { at: number; word: string }[] = [
  { at: 0.0, word: 'LOUD' },
  { at: 0.12, word: 'WORK' },
  { at: 0.24, word: 'PROCESS' },
  { at: 0.38, word: 'RULES' },
  { at: 0.5, word: 'PROOF' },
  { at: 0.62, word: 'TOOLS' },
  { at: 0.74, word: 'PLAY' },
  { at: 0.86, word: 'TALK' },
]

export function Backdrop() {
  const grid = useRef<HTMLDivElement>(null)
  const star = useRef<HTMLDivElement>(null)
  const wordEl = useRef<HTMLDivElement>(null)
  const coords = useRef<HTMLSpanElement>(null)
  const [word, setWord] = useState('LOUD')
  const current = useRef('LOUD')

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? scrollY / max : 0

      // grid drifts up + slight sideways with scroll
      if (grid.current) {
        grid.current.style.transform = `translate3d(${-(scrollY * 0.03) % 80}px, ${-(scrollY * 0.12) % 80}px, 0)`
      }
      // star spins with scroll
      if (star.current) {
        star.current.style.transform = `rotate(${scrollY * 0.08}deg)`
      }
      // watermark drifts horizontally through the page
      if (wordEl.current) {
        wordEl.current.style.transform = `translate(-50%, -50%) translateX(${(p - 0.5) * 22}vw)`
      }
      // zone word swap
      let w = ZONES[0].word
      for (const z of ZONES) if (p >= z.at) w = z.word
      if (w !== current.current) {
        current.current = w
        setWord(w)
      }
      // coords readout
      if (coords.current) {
        coords.current.textContent = `Y:${String(Math.round(scrollY)).padStart(5, '0')} — ${Math.round(p * 100)}%`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* blueprint grid */}
      <div
        ref={grid}
        className="absolute -inset-[80px] opacity-[0.05] will-change-transform"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 80px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 80px)',
        }}
      />

      {/* giant rotating star, off to the side */}
      <div
        ref={star}
        className="absolute -right-[14vmin] top-1/2 -translate-y-1/2 text-[42vmin] leading-none opacity-[0.06] will-change-transform select-none"
      >
        ★
      </div>

      {/* giant outlined watermark word */}
      <div
        ref={wordEl}
        key={word}
        className="absolute left-1/2 top-1/2 mega whitespace-nowrap will-change-transform select-none"
        style={{
          fontSize: 'clamp(6rem, 24vw, 22rem)',
          color: 'transparent',
          WebkitTextStroke: '2px currentColor',
          opacity: 0.07,
          animation: 'wmIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >
        {word}
      </div>

      {/* live scroll coordinates, bottom-left above day toggle */}
      <span
        ref={coords}
        className="absolute bottom-20 left-3 font-bold text-[9px] md:text-[10px] uppercase opacity-25 tabular-nums"
      />
    </div>
  )
}
