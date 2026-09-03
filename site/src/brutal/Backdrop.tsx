import { useEffect, useRef, useState } from 'react'

/* BACKDROP v2 — the blueprint comes alive. Fixed layer behind all:
   grid, watermark zone words, rotating star, plus drafting furniture:
   rulers with ticks, crosshair markers, registration circles,
   floating spec annotations, a scroll scanline and live coords.
   One rAF loop, transforms only — cheap everywhere. */

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

const NOTES = [
  { x: '12%', y: 18, t: 'FIG.01 — ATTITUDE', speed: 0.05 },
  { x: '78%', y: 26, t: 'REV.9 // APPROVED', speed: 0.09 },
  { x: '8%', y: 64, t: 'SCALE 1:LOUD', speed: 0.07 },
  { x: '70%', y: 74, t: 'DO NOT SOFTEN', speed: 0.04 },
  { x: '30%', y: 86, t: 'TOLERANCE ±0MM', speed: 0.1 },
]

const MARKS = [
  { x: '22%', y: 34, speed: 0.06 },
  { x: '58%', y: 14, speed: 0.1 },
  { x: '84%', y: 52, speed: 0.05 },
  { x: '40%', y: 70, speed: 0.08 },
]

export function Backdrop() {
  const grid = useRef<HTMLDivElement>(null)
  const star = useRef<HTMLDivElement>(null)
  const wordEl = useRef<HTMLDivElement>(null)
  const coords = useRef<HTMLSpanElement>(null)
  const scan = useRef<HTMLDivElement>(null)
  const rulerV = useRef<HTMLDivElement>(null)
  const parallax = useRef<HTMLDivElement>(null)
  const [word, setWord] = useState('LOUD')
  const current = useRef('LOUD')

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? scrollY / max : 0

      if (grid.current)
        grid.current.style.transform = `translate3d(${-(scrollY * 0.03) % 80}px, ${-(scrollY * 0.12) % 80}px, 0)`
      if (star.current)
        star.current.style.transform = `rotate(${scrollY * 0.08}deg)`
      if (wordEl.current)
        wordEl.current.style.transform = `translate(-50%, -50%) translateX(${(p - 0.5) * 22}vw)`
      // vertical ruler slides its ticks with scroll
      if (rulerV.current)
        rulerV.current.style.transform = `translate3d(0, ${-(scrollY * 0.25) % 120}px, 0)`
      // scanline sweeps down the screen tied to overall progress
      if (scan.current)
        scan.current.style.transform = `translate3d(0, ${p * 100}vh, 0)`
      // furniture: absolute y computed from data-y (viewport %), drifts up
      // with scroll and wraps through a -10%..110% band — always on screen
      if (parallax.current) {
        const H = innerHeight
        const cycle = H * 1.2
        for (const el of Array.from(parallax.current.children) as HTMLElement[]) {
          const sp = Number(el.dataset.speed || 0.05)
          const y0 = (Number(el.dataset.y) / 100) * H + 0.1 * H
          const y = ((((y0 - scrollY * sp) % cycle) + cycle) % cycle) - 0.1 * H
          el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`
        }
      }

      let w = ZONES[0].word
      for (const z of ZONES) if (p >= z.at) w = z.word
      if (w !== current.current) {
        current.current = w
        setWord(w)
      }
      if (coords.current)
        coords.current.textContent = `Y:${String(Math.round(scrollY)).padStart(5, '0')} — ${Math.round(p * 100)}%`

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

      {/* left vertical ruler with scrolling ticks */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-10 border-r border-current opacity-[0.12] overflow-hidden">
        <div ref={rulerV} className="absolute inset-x-0 -top-[120px] h-[calc(100%+240px)] will-change-transform">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="relative" style={{ height: 30 }}>
              <span
                className="absolute right-0 bg-current"
                style={{ height: 1, width: i % 4 === 0 ? '100%' : '35%', top: 0 }}
              />
              {i % 4 === 0 && (
                <span className="absolute left-0.5 top-0.5 font-bold text-[7px] tabular-nums">
                  {String(i * 10).padStart(3, '0')}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* top horizontal ruler */}
      <div
        className="absolute top-0 left-8 md:left-10 right-0 h-6 border-b border-current opacity-[0.1]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 30px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 120px)',
          backgroundSize: '30px 35%, 120px 100%',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom, bottom',
        }}
      />

      {/* giant rotating star */}
      <div
        ref={star}
        className="absolute -right-[14vmin] top-1/2 -translate-y-1/2 text-[42vmin] leading-none opacity-[0.06] will-change-transform select-none"
      >
        ★
      </div>

      {/* zone watermark */}
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

      {/* parallax furniture: annotations, crosshairs, registration circles */}
      <div ref={parallax} className="absolute inset-0">
        {NOTES.map((n) => (
          <span
            key={n.t}
            data-speed={n.speed}
            data-y={n.y}
            className="absolute font-bold text-[9px] md:text-[11px] uppercase tracking-[0.2em] opacity-[0.14] border border-current px-2 py-1 will-change-transform"
            style={{ left: n.x, top: 0 }}
          >
            {n.t}
          </span>
        ))}

        {MARKS.map((m, i) => (
          <span
            key={i}
            data-speed={m.speed}
            data-y={m.y}
            className="absolute opacity-[0.14] will-change-transform"
            style={{ left: m.x, top: 0 }}
          >
            {/* crosshair */}
            <span className="block relative w-8 h-8 md:w-10 md:h-10">
              <span className="absolute left-1/2 top-0 bottom-0 w-px bg-current" />
              <span className="absolute top-1/2 left-0 right-0 h-px bg-current" />
              <span className="absolute inset-[22%] border border-current rounded-full" />
            </span>
          </span>
        ))}

        {/* registration circles */}
        <span data-speed={0.06} data-y={12} className="absolute left-[88%] top-0 w-14 h-14 border border-current rounded-full opacity-[0.1] will-change-transform">
          <span className="absolute inset-[30%] border border-current rounded-full" />
        </span>
        <span data-speed={0.09} data-y={40} className="absolute left-[5%] top-0 w-20 h-20 border border-current rounded-full opacity-[0.08] will-change-transform">
          <span className="absolute inset-[25%] border border-current rounded-full" />
          <span className="absolute inset-[45%] bg-current rounded-full" />
        </span>

        {/* dimension line */}
        <span data-speed={0.07} data-y={8} className="absolute left-[35%] top-0 w-40 opacity-[0.12] will-change-transform">
          <span className="block h-px bg-current relative">
            <span className="absolute -left-0.5 -top-1 h-2 w-px bg-current" />
            <span className="absolute -right-0.5 -top-1 h-2 w-px bg-current" />
          </span>
          <span className="block text-center font-bold text-[8px] mt-1 tracking-[0.3em]">1440PX</span>
        </span>
      </div>

      {/* scanline sweeping with progress */}
      <div
        ref={scan}
        className="absolute -top-px left-0 right-0 will-change-transform"
        style={{ height: 1, background: 'currentColor', opacity: 0.1, boxShadow: '0 0 14px 1px currentColor' }}
      />

      {/* live coords */}
      <span
        ref={coords}
        className="absolute bottom-20 left-3 font-bold text-[9px] md:text-[10px] uppercase opacity-25 tabular-nums"
      />
    </div>
  )
}
