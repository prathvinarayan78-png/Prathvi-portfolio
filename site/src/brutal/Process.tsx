import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* HOW*I*WORK v3 — THE FACTORY LINE.
   Desktop: a 300vh section with a CSS-sticky viewport (native sticky,
   zero GSAP pinning → blackout impossible). Scrolling drives a
   conveyor: cards ride the belt through a stamping station; each one
   gets a verdict stamp as it passes center. Belt dashes, station
   lights and a step counter all run off the same scroll progress.
   Mobile: clean vertical cards, scroll-revealed. */

const STEPS = [
  {
    n: '01', t: 'YOU TALK', c: 'acid', stamp: 'RECEIVED',
    d: 'Brief me. Voice note, doc, napkin sketch — anything human.',
    chip: 'INPUT: CHAOS',
  },
  {
    n: '02', t: 'I DIG', c: 'pop', stamp: 'RESEARCHED',
    d: 'References, rabbit holes, moodboards. The ugly phase nobody posts.',
    chip: 'MODE: OBSESSED',
  },
  {
    n: '03', t: 'I MAKE', c: 'blue', stamp: 'COOKED',
    d: 'Design. Build. Cut. First drafts in 48 hours, not 48 days.',
    chip: 'STATUS: COOKING',
  },
  {
    n: '04', t: 'WE SHIP', c: 'acid', stamp: 'SHIPPED ✓',
    d: 'Revisions until it slaps. Then it goes live and we brag.',
    chip: 'OUTPUT: LOUD',
  },
]

export function Process() {
  const root = useRef<HTMLElement>(null)
  const belt = useRef<HTMLDivElement>(null)
  const dashes = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const bulb = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    // ---------- desktop: conveyor scrub ----------
    mm.add('(min-width: 768px)', () => {
      const track = belt.current!
      const travel = () => {
        const last = track.lastElementChild as HTMLElement
        // distance that puts the last card's center on the screen center
        return last.offsetLeft + last.offsetWidth / 2 - innerWidth / 2
      }

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress
          gsap.set(track, { x: -travel() * p })
          // belt dashes crawl with progress
          if (dashes.current) gsap.set(dashes.current, { backgroundPositionX: `${-p * 900}px` })
          // step counter
          const step = Math.min(STEPS.length, Math.max(1, Math.round(p * (STEPS.length - 1)) + 1))
          if (counter.current) counter.current.textContent = `STEP ${String(step).padStart(2, '0')} / ${String(STEPS.length).padStart(2, '0')}`
          // station bulb blinks faster near each card center
          if (bulb.current) bulb.current.style.opacity = String(0.35 + Math.abs(Math.sin(p * Math.PI * STEPS.length)) * 0.65)

          // stamps: reveal once its card passes the center of the screen
          document.querySelectorAll<HTMLElement>('[data-stamp-mark]').forEach((el, i) => {
            const hit = i / (STEPS.length - 1)
            const show = p > hit - 0.04
            el.style.opacity = show ? '1' : '0'
            el.style.transform = show ? 'rotate(-12deg) scale(1)' : 'rotate(-12deg) scale(2.4)'
          })
        },
      })
      return () => st.kill()
    })

    // ---------- mobile: simple reveals ----------
    mm.add('(max-width: 767px)', () => {
      gsap.utils.toArray<HTMLElement>('[data-mstep]', root.current!).forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: (i % 2) * 0.06,
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={root} className="relative md:h-[300vh]">
      {/* ================= DESKTOP FACTORY (sticky viewport) ================= */}
      <div className="hidden md:flex sticky top-0 h-screen flex-col justify-center overflow-hidden">
        {/* header row */}
        <div className="flex items-end justify-between px-8 mb-14">
          <h2 data-wipe className="mega text-[clamp(2rem,5.5vw,4.6rem)] relative">
            <span aria-hidden className="num-ghost mega absolute -top-5 left-0 text-[clamp(1.2rem,2.6vw,2rem)]">/03</span>
            HOW<span className="text-[#00ffa3]">*</span>I*WORK
          </h2>
          <div className="flex items-center gap-4 font-bold text-xs uppercase">
            <span ref={bulb} className="w-3.5 h-3.5 rounded-full bg-[#ff4d00]" />
            <span ref={counter} className="tabular-nums border-[2.5px] border-current px-3 py-1.5">STEP 01 / 04</span>
          </div>
        </div>

        {/* the conveyor */}
        <div className="relative">
          {/* belt track */}
          <div ref={belt} className="flex items-stretch gap-14 pl-[38vw] pr-[30vw] w-max will-change-transform">
            {STEPS.map((s) => (
              <article
                key={s.n}
                className={`relative slab case-card ${s.c} w-[32vw] max-w-[480px] p-7 flex flex-col`}
                data-noclick
              >
                <div className="flex items-start justify-between">
                  <span className="inline-grid place-items-center w-14 h-14 border-[3px] border-current font-black text-xl bg-[#0a0a0a] text-white">
                    {s.n}
                  </span>
                  <span className="font-bold text-[10px] uppercase border-[2.5px] border-current px-2 py-1">
                    {s.chip}
                  </span>
                </div>
                <p className="mega text-[clamp(2rem,3.6vw,3.2rem)] mt-5">{s.t}</p>
                <p className="font-bold text-sm uppercase mt-3 leading-relaxed flex-1">{s.d}</p>

                {/* verdict stamp — punched on as the card passes the station */}
                <span
                  data-stamp-mark
                  className="absolute top-3 right-3 border-[4px] border-[#ff4d00] text-[#ff4d00] font-black uppercase text-base px-3 py-1 bg-page transition-all duration-300 pointer-events-none"
                  style={{ opacity: 0, transform: 'rotate(-12deg) scale(2.4)' }}
                >
                  {s.stamp}
                </span>
              </article>
            ))}
          </div>

          {/* belt line + rolling dashes */}
          <div className="mt-8 mx-8 border-t-[3px] border-current relative">
            <div
              ref={dashes}
              className="h-4 opacity-40"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0 26px, transparent 26px 52px)',
                backgroundSize: '52px 4px',
                backgroundRepeat: 'repeat-x',
                backgroundPosition: 'left center',
              }}
            />
            {/* rollers */}
            <div className="absolute -top-2 left-0 right-0 flex justify-between px-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="w-4 h-4 rounded-full border-[3px] border-current bg-page" />
              ))}
            </div>
          </div>

          {/* stamping station marker at screen center */}
          <div aria-hidden className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            <span className="font-bold text-[10px] uppercase tracking-[0.3em] text-[#ff4d00] bg-page border-[2.5px] border-[#ff4d00] px-3 py-1">▼ STATION</span>
          </div>
        </div>

        <p className="px-8 mt-8 font-bold text-xs uppercase opacity-60">
          scroll drives the belt — every step gets stamped before it leaves the station
        </p>
      </div>

      {/* ================= MOBILE: vertical steps ================= */}
      <div className="md:hidden px-4 py-20">
        <div className="flex items-end justify-between mb-14">
          <h2 className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
            <span aria-hidden className="num-ghost mega absolute -top-6 left-0 text-[clamp(1.6rem,4vw,3rem)]">/03</span>
            HOW<span className="text-[#00ffa3]">*</span>I*WORK
          </h2>
        </div>
        <div className="space-y-10">
          {STEPS.map((s) => (
            <article key={s.n} data-mstep className={`relative slab case-card ${s.c} p-5 will-change-transform`} data-noclick>
              <div className="flex items-start justify-between">
                <span className="inline-grid place-items-center w-10 h-10 border-[3px] border-current font-black text-base bg-[#0a0a0a] text-white shrink-0">
                  {s.n}
                </span>
                <span className="font-bold text-[8px] uppercase border-[2px] border-current px-1.5 py-1">{s.chip}</span>
              </div>
              <p className="mega text-[clamp(1.3rem,6.5vw,2.2rem)] mt-4 break-words">{s.t}</p>
              <p className="font-bold text-[10px] uppercase mt-2 leading-relaxed break-words">{s.d}</p>
              <span className="absolute -top-3 -right-2 border-[3px] border-[#ff4d00] text-[#ff4d00] font-black uppercase text-[10px] px-2 py-0.5 bg-page rotate-[-10deg]">
                {s.stamp}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
