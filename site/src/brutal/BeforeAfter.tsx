import { useRef, useState } from 'react'

/* RAW*VS*DONE — interactive before/after wiper. Drag the handle to
   reveal the graded/finished version. Uses the edit stills. */

export function BeforeAfter() {
  const frame = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)

  const set = (clientX: number) => {
    const r = frame.current!.getBoundingClientRect()
    setPos(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)))
  }

  return (
    <section className="px-4 md:px-8 py-36 md:py-60 border-t-[3px] border-current">
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <h2 className="mega text-[clamp(2.6rem,9vw,8rem)]">
          RAW<span className="text-[#ff4d00]">*</span>VS*DONE
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase">drag the line. feel the grade.</span>
      </div>

      <div
        ref={frame}
        data-noclick
        className="relative max-w-5xl mx-auto aspect-video border-[3px] border-current overflow-hidden cursor-ew-resize select-none touch-none"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); set(e.clientX) }}
        onPointerMove={(e) => { if (e.buttons > 0) set(e.clientX) }}
      >
        {/* AFTER (full color) */}
        <img src="/work/edit-1.jpg" alt="Graded edit" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        {/* BEFORE (raw, desaturated + dark) — clipped to left of the wiper */}
        <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img
            src="/work/edit-1.jpg"
            alt="Raw footage"
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(1) brightness(0.75) contrast(0.85)' }}
          />
        </div>

        {/* wiper handle */}
        <div className="absolute top-0 bottom-0 w-[5px] bg-[#ff4d00] pointer-events-none" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center bg-[#ff4d00] text-[#0a0a0a] border-[3px] border-[#0a0a0a] font-black text-sm">
            ⇄
          </span>
        </div>

        {/* labels */}
        <span className="absolute top-3 left-4 font-black text-[10px] md:text-xs uppercase bg-[#0a0a0a] text-white px-2 py-1 pointer-events-none">RAW</span>
        <span className="absolute top-3 right-4 font-black text-[10px] md:text-xs uppercase bg-[#ff4d00] text-[#0a0a0a] px-2 py-1 pointer-events-none">DONE</span>
      </div>

      <p className="text-center font-bold text-[10px] md:text-xs uppercase mt-6 opacity-60">
        color is 50% of the emotion. the other 50% is also color.
      </p>
    </section>
  )
}
