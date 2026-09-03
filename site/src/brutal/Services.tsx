import { useState } from 'react'

/* SERVICES — giant hover-invert cells with a live counter game. */

const CELLS = [
  { t: 'POSTERS', d: 'Loud ones.' },
  { t: 'BRANDS', d: 'Unforgettable ones.' },
  { t: 'WEBSITES', d: 'Like this one.' },
  { t: '3D/MOTION', d: 'Things that move.' },
  { t: 'VIDEO EDITS', d: 'Cuts that hit.' },
  { t: 'AI AGENTS', d: 'Work while I sleep.' },
]

export function Services() {
  const [hits, setHits] = useState(0)

  return (
    <section className="px-4 md:px-8 py-36 md:py-60">
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <h2 className="mega text-[clamp(2.6rem,9vw,8rem)]">
          I<span className="text-[#2f49ff]">*</span>DO
        </h2>
        <span className="font-bold text-xs md:text-sm tabular-nums">
          CELLS TOUCHED: {String(hits).padStart(3, '0')}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 -m-[1.5px]">
        {CELLS.map((c) => (
          <div
            key={c.t}
            className="cell aspect-[4/3] md:aspect-[16/9] flex flex-col justify-between p-4 md:p-6 -m-[1.5px] cursor-crosshair"
            onMouseEnter={() => setHits((h) => h + 1)}
          >
            <span className="font-bold text-[10px] md:text-xs uppercase opacity-60">SVC/{c.t}</span>
            <div>
              <p className="mega text-[clamp(1.2rem,3.4vw,2.6rem)]">{c.t}</p>
              <p className="font-bold text-[11px] md:text-sm uppercase mt-1 opacity-70">{c.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
