import { useEffect, useRef, useState } from 'react'

/* Top scroll progress bar + % readout, brutal style. */

export function Progress() {
  const bar = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? scrollY / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
      setPct(Math.round(p * 100))
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
      <span className="fixed bottom-3 right-3 z-[60] font-black text-[11px] md:text-sm tabular-nums border-[3px] border-current px-2 py-1 bg-page pointer-events-none">
        {String(pct).padStart(3, '0')}%
      </span>
    </>
  )
}
