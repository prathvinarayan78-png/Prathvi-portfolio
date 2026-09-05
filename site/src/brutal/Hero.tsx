import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import { Sticker } from './Sticker'
import { toggleDay } from './theme'

/* HERO — words slam in like stamps; every letter is hover-reactive;
   giant invert switch; draggable stickers scattered around. */

const LINES = ['GRAPHIC', 'DESIGNER', '+WEB', '+EDITOR']

function SlamLine({ text, delay, accent, go }: { text: string; delay: number; accent?: string; go: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!go) return
    const chars = ref.current!.querySelectorAll('[data-c]')
    gsap.fromTo(
      chars,
      { scale: 3, opacity: 0, rotation: () => (Math.random() - 0.5) * 40 },
      {
        scale: 1, opacity: 1, rotation: 0,
        duration: 0.36,
        ease: 'power4.in',
        stagger: 0.045,
        delay,
        onComplete: () => {
          // impact shake on the whole page
          gsap.fromTo('body', { x: 6 }, { x: 0, duration: 0.3, ease: 'elastic.out(1,0.3)' })
        },
      },
    )
  }, [delay, go])

  const hover = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement
    if (!t.hasAttribute('data-c')) return
    gsap.to(t, {
      y: -14, scale: 1.12, rotation: (Math.random() - 0.5) * 16, color: '#ff4d00',
      duration: 0.14,
      onComplete: () => gsap.to(t, { y: 0, scale: 1, rotation: 0, color: 'inherit', duration: 0.4, ease: 'bounce.out' }),
    })
  }

  return (
    <div ref={ref} className={`mega text-[clamp(2.8rem,min(11.5vw,17vh),13rem)] ${accent ?? ''}`} style={{ opacity: go ? undefined : 0 }} onMouseOver={hover}>
      {text.split('').map((c, i) => (
        <span key={i} data-c className="inline-block will-change-transform cursor-default">
          {c}
        </span>
      ))}
    </div>
  )
}

export function Hero({ ready = true }: { ready?: boolean }) {
  const [time, setTime] = useState('')
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.mega', root.current!).forEach((el, i) => {
        gsap.to(el, {
          yPercent: -(14 + i * 10),
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' })
    const tick = () => setTime(f.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const invert = () => toggleDay()

  return (
    <section ref={root} className="relative min-h-[100svh] flex flex-col justify-between px-4 md:px-8 pt-24 pb-14 md:pb-20 overflow-hidden">
      {/* corner meta */}
      <div className="flex justify-between font-bold text-[11px] md:text-xs uppercase">
        <span className="border-[2.5px] border-current px-2 py-1 bg-page">Portfolio v3.0 — RAW</span>
        <span className="tabular-nums border-[2.5px] border-current px-2 py-1 bg-page">DEL {time} IST</span>
      </div>

      {/* corner frame marks */}
      <span data-corner className="pointer-events-none absolute top-20 left-4 w-7 h-7 border-l-[3px] border-t-[3px] border-[#ff4d00]" />
      <span data-corner className="pointer-events-none absolute top-20 right-4 w-7 h-7 border-r-[3px] border-t-[3px] border-[#ff4d00]" />
      <span data-corner className="pointer-events-none absolute bottom-4 left-4 w-7 h-7 border-l-[3px] border-b-[3px] border-[#ff4d00]" />
      <span data-corner className="pointer-events-none absolute bottom-4 right-4 w-7 h-7 border-r-[3px] border-b-[3px] border-[#ff4d00]" />

      <div className="relative">
        <SlamLine text={LINES[0]} delay={0.2} go={ready} />
        <SlamLine text={LINES[1]} delay={0.65} accent="text-[#ff4d00]" go={ready} />
        <div className="flex flex-wrap items-end gap-x-8">
          <SlamLine text={LINES[2]} delay={1.15} go={ready} />
          <SlamLine text={LINES[3]} delay={1.5} go={ready} />
        </div>

        {/* draggable stickers */}
        <Sticker x="68%" y="4%" rot={-8}>
          <span className="block acid slab case-card font-black text-sm md:text-base px-4 py-2">DRAG ME ★</span>
        </Sticker>
        <Sticker x="8%" y="58%" rot={6}>
          <span className="block pop slab case-card font-black text-sm md:text-base px-4 py-2">100% HANDMADE</span>
        </Sticker>
        <Sticker x="80%" y="66%" rot={-4} className="hidden md:block">
          <span className="block blue slab case-card font-black text-sm md:text-base px-4 py-2">EST. 2026</span>
        </Sticker>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-bold text-[11px] md:text-sm uppercase max-w-xs">
          I design loud, build fast &amp; cut sharp. Click anywhere. Break stuff.
        </p>

        {/* the big invert switch */}
        <button
          onClick={invert}
          className="slab acid font-black uppercase text-sm md:text-lg px-6 py-3 jitter"
          data-noclick
        >
          ⚡ FLIP THE LIGHTS
        </button>

        <span className="font-bold text-[11px] md:text-sm uppercase blink">▼ scroll or else</span>
      </div>
    </section>
  )
}
