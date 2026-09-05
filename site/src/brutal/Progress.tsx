import { useEffect, useRef } from 'react'

/* Top scroll progress bar + % readout — zero React re-renders,
   cached page height (scrollHeight reads can force reflow). */

export function Progress() {
  const bar = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    let frame = 0
    let max = document.documentElement.scrollHeight - innerHeight
    let lastPct = -1
    const tick = () => {
      if (++frame % 120 === 0) max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? scrollY / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
      const pct = Math.round(p * 100)
      if (pct !== lastPct && label.current) {
        lastPct = pct
        label.current.textContent = `${String(pct).padStart(3, '0')}%`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[6px] pointer-events-none">
        <div ref={bar} className="h-full bg-[#ff4d00] origin-left will-change-transform" style={{ transform: 'scaleX(0)' }} />
      </div>
      <span ref={label} className="fixed bottom-3 right-3 z-[60] font-black text-[11px] md:text-sm tabular-nums border-[3px] border-current px-2 py-1 bg-page pointer-events-none">
        000%
      </span>
    </>
  )
}
