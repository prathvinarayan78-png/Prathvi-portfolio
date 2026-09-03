import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* CONTROL*ROOM — a fake live status board. Rows flicker in like an
   airport departures board; some values tick live. */

export function Status() {
  const root = useRef<HTMLElement>(null)
  const [coffee, setCoffee] = useState(2)
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    const t0 = Date.now()
    const id = setInterval(() => {
      setUptime(Math.floor((Date.now() - t0) / 1000))
      if (Math.random() < 0.02) setCoffee((c) => c + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-row]', root.current!).forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -14 },
          {
            opacity: 1, x: 0, duration: 0.08, delay: i * 0.09,
            repeat: 3, yoyo: true, repeatDelay: 0.04,       // flicker
            onComplete: () => gsap.set(el, { opacity: 1, x: 0 }),
            scrollTrigger: { trigger: root.current, start: 'top 75%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const hh = String(Math.floor(uptime / 3600)).padStart(2, '0')
  const mm = String(Math.floor((uptime % 3600) / 60)).padStart(2, '0')
  const ss = String(uptime % 60).padStart(2, '0')

  const ROWS = [
    { k: 'AVAILABILITY', v: 'OPEN FOR PROJECTS', c: '#00ffa3', blink: true },
    { k: 'LOCATION', v: 'DELHI, IN — GMT+5:30', c: '' },
    { k: 'CURRENT OBSESSION', v: 'AGENTIC WORKFLOWS', c: '#ff4d00' },
    { k: 'COFFEE COUNTER', v: `${String(coffee).padStart(2, '0')} CUPS`, c: '' },
    { k: 'SESSION UPTIME', v: `${hh}:${mm}:${ss}`, c: '#2f49ff', mono: true },
    { k: 'TEMPLATES USED', v: 'STILL ZERO', c: '' },
    { k: 'RESPONSE TIME', v: '< 24 HRS OR IT’S FREE*', c: '#ff4d00' },
  ]

  return (
    <section ref={root} className="px-4 md:px-8 py-36 md:py-60 border-t-[3px] border-current">
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <h2 className="mega text-[clamp(2.6rem,9vw,8rem)]">
          CONTROL<span className="text-[#2f49ff]">*</span>ROOM
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase">live status. allegedly.</span>
      </div>

      <div className="max-w-4xl border-[3px] border-current">
        {ROWS.map((r) => (
          <div
            key={r.k}
            data-row
            className="flex items-center justify-between gap-4 px-3 md:px-6 py-3.5 md:py-5 border-b-[3px] border-current last:border-b-0 hover:bg-[#ff4d00] hover:text-[#0a0a0a] transition-colors"
          >
            <span className="font-bold text-[10px] md:text-sm uppercase opacity-70">{r.k}</span>
            <span
              className={`font-black uppercase text-xs md:text-lg text-right tabular-nums ${r.blink ? 'blink' : ''}`}
              style={r.c ? { color: r.c } : undefined}
            >
              {r.v}
            </span>
          </div>
        ))}
      </div>
      <p className="font-bold text-[9px] md:text-[10px] uppercase mt-4 opacity-50">*not legally binding. but morally, yes.</p>
    </section>
  )
}
