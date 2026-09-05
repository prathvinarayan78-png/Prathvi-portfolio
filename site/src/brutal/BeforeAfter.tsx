import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* RAW*VS*DONE v2 — the grading suite.
   · auto demo sweep when the section enters (then hands you the wheel)
   · springy magnetic handle with elastic release
   · live HUD: exposure/grade % readouts tied to wiper position
   · grade-mode chips (NOIR / TEAL&ORANGE / BLEACH) that actually change the look
   · film sprocket borders + timecode that scrubs with the wiper */

const GRADES = [
  { name: 'TEAL&ORANGE', filter: 'none' },
  { name: 'NOIR', filter: 'grayscale(1) contrast(1.35) brightness(0.9)' },
  { name: 'BLEACH', filter: 'saturate(0.55) contrast(1.25) brightness(1.12)' },
]

export function BeforeAfter() {
  const root = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const handle = useRef<HTMLDivElement>(null)
  const posRef = useRef(50)
  const [pos, setPos] = useState(50)
  const [grade, setGrade] = useState(0)
  const dragging = useRef(false)
  const demoDone = useRef(false)

  const setP = (v: number) => {
    posRef.current = v
    setPos(v)
  }

  // intro: auto sweep 50 → 8 → 92 → 50 when entering, then user takes over
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: frame.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          const state = { v: 50 }
          gsap.timeline({ onComplete: () => { demoDone.current = true } })
            .to(state, { v: 8, duration: 0.7, ease: 'power2.inOut', onUpdate: () => !dragging.current && setP(state.v) })
            .to(state, { v: 92, duration: 0.9, ease: 'power2.inOut', onUpdate: () => !dragging.current && setP(state.v) })
            .to(state, { v: 50, duration: 0.6, ease: 'power3.out', onUpdate: () => !dragging.current && setP(state.v) })
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const fromClientX = (clientX: number) => {
    const r = frame.current!.getBoundingClientRect()
    setP(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)))
  }

  const release = () => {
    dragging.current = false
    // springy settle — tiny elastic overshoot on the handle
    gsap.fromTo(handle.current, { scale: 1.25 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.35)' })
  }

  // fake timecode scrubbing with the wiper
  const tc = `00:00:${String(Math.round((pos / 100) * 24)).padStart(2, '0')}:${String(Math.round((pos % 4.16) * 5)).padStart(2, '0')}`

  return (
    <section ref={root} className="px-4 md:px-8 py-20 md:py-28">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <h2 data-wipe className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
          <span aria-hidden className="num-ghost mega absolute -top-6 md:-top-10 left-0 text-[clamp(1.6rem,4vw,3rem)]">/09</span>
          RAW<span className="text-[#ff4d00]">*</span>VS*DONE
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase hidden md:block">drag the line. feel the grade.</span>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* grade mode chips */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5" data-noclick>
          <span className="font-bold text-[9px] md:text-[10px] uppercase opacity-50 mr-1">GRADE:</span>
          {GRADES.map((g, i) => (
            <button
              key={g.name}
              onClick={() => setGrade(i)}
              className={`slab font-black uppercase text-[9px] md:text-[11px] px-3 py-1.5 transition-colors ${
                grade === i ? 'acid' : 'bg-page'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* film top border */}
        <div className="h-5 border-[3px] border-b-0 border-current bg-page flex items-center justify-between px-2 gap-1 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="w-2.5 h-2 bg-current opacity-30 shrink-0" />
          ))}
        </div>

        <div
          ref={frame}
          data-noclick
          className="relative aspect-video border-[3px] border-current overflow-hidden cursor-ew-resize select-none touch-none"
          onPointerDown={(e) => {
            dragging.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            fromClientX(e.clientX)
            gsap.to(handle.current, { scale: 1.25, duration: 0.15 })
          }}
          onPointerMove={(e) => { if (dragging.current) fromClientX(e.clientX) }}
          onPointerUp={release}
          onPointerCancel={release}
        >
          {/* AFTER (graded) */}
          <img
            src="/work/edit-1.jpg"
            alt="Graded edit"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ filter: GRADES[grade].filter }}
          />
          {/* BEFORE (raw) — clipped left of wiper */}
          <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <img
              src="/work/edit-1.jpg"
              alt="Raw footage"
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(1) brightness(0.72) contrast(0.82)' }}
            />
            {/* raw scanlines */}
            <div
              className="absolute inset-0 opacity-25"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 4px)' }}
            />
          </div>

          {/* wiper */}
          <div className="absolute top-0 bottom-0 w-[5px] bg-[#ff4d00] pointer-events-none" style={{ left: `${pos}%` }}>
            <div
              ref={handle}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 grid place-items-center bg-[#ff4d00] text-[#0a0a0a] border-[3px] border-[#0a0a0a] font-black text-base will-change-transform"
            >
              ⇄
            </div>
          </div>

          {/* HUD labels */}
          <span className="absolute top-3 left-4 font-black text-[10px] md:text-xs uppercase bg-[#0a0a0a] text-white px-2 py-1 pointer-events-none">
            RAW {String(Math.round(100 - pos)).padStart(2, '0')}%
          </span>
          <span className="absolute top-3 right-4 font-black text-[10px] md:text-xs uppercase bg-[#ff4d00] text-[#0a0a0a] px-2 py-1 pointer-events-none">
            DONE {String(Math.round(pos)).padStart(2, '0')}%
          </span>
          {/* timecode + rec */}
          <span className="absolute bottom-3 left-4 font-bold text-[9px] md:text-[10px] uppercase text-white/80 tabular-nums pointer-events-none">
            ● REC — TC {tc}
          </span>
          <span className="absolute bottom-3 right-4 font-bold text-[9px] md:text-[10px] uppercase text-white/80 pointer-events-none">
            {GRADES[grade].name} — LUT 0{grade + 1}
          </span>
        </div>

        {/* film bottom border */}
        <div className="h-5 border-[3px] border-t-0 border-current bg-page flex items-center justify-between px-2 gap-1 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="w-2.5 h-2 bg-current opacity-30 shrink-0" />
          ))}
        </div>

        <p className="text-center font-bold text-[10px] md:text-xs uppercase mt-6 opacity-60">
          color is 50% of the emotion. the other 50% is also color.
        </p>
      </div>
    </section>
  )
}
