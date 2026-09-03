import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* THE LAB — playable experiments. Tiny toys inside slabs. */

function Wobble() {
  const ref = useRef<HTMLDivElement>(null)
  const poke = () => {
    gsap.fromTo(ref.current, { scale: 0.7, rotation: (Math.random() - 0.5) * 60 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'elastic.out(1,0.25)' })
  }
  return (
    <div className="h-full flex items-center justify-center" onMouseEnter={poke} onClick={poke} data-noclick>
      <div ref={ref} className="w-16 h-16 md:w-24 md:h-24 pop border-[3px] border-current will-change-transform" />
    </div>
  )
}

function Counter() {
  const [n, setN] = useState(0)
  return (
    <button data-noclick onClick={() => setN((v) => v + 1)} className="h-full w-full flex flex-col items-center justify-center gap-2">
      <span className="mega text-[clamp(2rem,5vw,4rem)] tabular-nums">{String(n).padStart(4, '0')}</span>
      <span className="font-bold text-[10px] uppercase opacity-60">clicks wasted here</span>
    </button>
  )
}

function Eyes() {
  const l = useRef<HTMLDivElement>(null)
  const r = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      ;[l, r].forEach((eye) => {
        const el = eye.current!
        const rect = el.parentElement!.getBoundingClientRect()
        const a = Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2))
        el.style.transform = `translate(${Math.cos(a) * 10}px, ${Math.sin(a) * 10}px)`
      })
    }
    const touch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) move({ clientX: t.clientX, clientY: t.clientY } as MouseEvent)
    }
    addEventListener('mousemove', move, { passive: true })
    addEventListener('touchmove', touch, { passive: true })
    return () => { removeEventListener('mousemove', move); removeEventListener('touchmove', touch) }
  }, [])
  return (
    <div className="h-full flex items-center justify-center gap-4">
      {[l, r].map((ref, i) => (
        <div key={i} className="w-14 h-14 md:w-20 md:h-20 rounded-full border-[3px] border-current bg-white flex items-center justify-center">
          <div ref={ref} className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#0a0a0a]" />
        </div>
      ))}
    </div>
  )
}

function Slider() {
  const [v, setV] = useState(50)
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 px-6" data-noclick>
      <span className="mega text-[clamp(1.4rem,3vw,2.4rem)]" style={{ transform: `rotate(${(v - 50) / 3}deg)` }}>
        {v < 20 ? 'MEH' : v < 50 ? 'OK.' : v < 80 ? 'NICE' : 'LOUD!!'}
      </span>
      <input
        type="range" min={0} max={100} value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className="w-full accent-[#ff4d00] cursor-ew-resize"
      />
      <span className="font-bold text-[10px] uppercase opacity-60">volume of this website</span>
    </div>
  )
}

export function Lab() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-lab]',
        { y: 80, opacity: 0, rotation: () => (Math.random() - 0.5) * 8 },
        {
          y: 0, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: 'top 78%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="px-4 md:px-8 py-20 md:py-28">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <h2 className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
          <span aria-hidden className="num-ghost mega absolute -top-6 md:-top-10 left-0 text-[clamp(1.6rem,4vw,3rem)]">/11</span>
          THE<span className="text-[#2f49ff]">*</span>LAB
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase">useless toys. play anyway.</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        <div data-lab className="slab aspect-square" ><Wobble /></div>
        <div data-lab className="slab aspect-square"><Counter /></div>
        <div data-lab className="slab aspect-square"><Eyes /></div>
        <div data-lab className="slab aspect-square"><Slider /></div>
      </div>
    </section>
  )
}
