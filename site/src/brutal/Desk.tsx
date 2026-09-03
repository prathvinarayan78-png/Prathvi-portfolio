import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* THE*DESK — work snapshots scattered like prints on a desk.
   They fly in from random directions; drag them around like the
   hero stickers. */

const PRINTS = [
  { img: '/work/design-1.jpg', label: 'POSTER_FINAL_v9.jpg', rot: -5, x: '2%', y: '4%' },
  { img: '/work/web-1.jpg', label: 'HERO_CONCEPT.png', rot: 3, x: '38%', y: '0%' },
  { img: '/work/edit-1.jpg', label: 'FRAME_0412.jpg', rot: -2, x: '66%', y: '8%' },
  { img: '/work/design-3.jpg', label: 'COVER_LOUD.tif', rot: 6, x: '18%', y: '44%' },
  { img: '/work/edit-2.jpg', label: 'DRONE_GRADE.jpg', rot: -4, x: '52%', y: '48%' },
]

function Print({ p }: { p: (typeof PRINTS)[0] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current!
    let drag = false, px = 0, py = 0, cx = 0, cy = 0

    const down = (e: PointerEvent) => {
      drag = true; px = e.clientX; py = e.clientY
      el.setPointerCapture(e.pointerId)
      gsap.to(el, { scale: 1.08, zIndex: 30, duration: 0.15 })
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      cx += e.clientX - px; cy += e.clientY - py
      px = e.clientX; py = e.clientY
      gsap.set(el, { x: cx, y: cy })
    }
    const up = () => { drag = false; gsap.to(el, { scale: 1, duration: 0.2 }) }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [])

  return (
    <div
      ref={ref}
      data-print
      data-noclick
      className="absolute w-[44%] sm:w-[30%] md:w-[24%] cursor-grab active:cursor-grabbing touch-none will-change-transform"
      style={{ left: p.x, top: p.y, rotate: `${p.rot}deg` }}
    >
      <div className="slab bg-page p-2">
        <img src={p.img} alt={p.label} loading="lazy" className="img-brut w-full aspect-[4/3] object-cover pointer-events-none" />
        <p className="font-bold text-[8px] md:text-[10px] uppercase mt-2 opacity-70 truncate">{p.label}</p>
      </div>
    </div>
  )
}

export function Desk() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-print]').forEach((el, i) => {
        const ang = (i / PRINTS.length) * Math.PI * 2
        gsap.fromTo(
          el,
          { x: Math.cos(ang) * 500, y: Math.sin(ang) * 380, opacity: 0, rotation: (Math.random() - 0.5) * 50 },
          {
            x: 0, y: 0, opacity: 1, rotation: Number(el.style.rotate.replace('deg', '')) || 0,
            duration: 0.9, ease: 'power3.out', delay: i * 0.08,
            scrollTrigger: { trigger: root.current, start: 'top 70%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="px-4 md:px-8 py-20 md:py-28 border-t-[3px] border-current overflow-hidden">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <h2 className="mega text-[clamp(2.6rem,9vw,8rem)] relative">
          <span aria-hidden className="num-ghost mega absolute -top-6 md:-top-10 left-0 text-[clamp(1.6rem,4vw,3rem)]">/02</span>
          THE<span className="text-[#ff4d00]">*</span>DESK
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase">messy on purpose. drag the prints.</span>
      </div>

      <div className="relative h-[70vh] md:h-[80vh] border-[3px] border-current bg-page overflow-hidden">
        {/* desk grid texture */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 40px)' }}
        />
        {PRINTS.map((p) => <Print key={p.label} p={p} />)}
        <span className="absolute bottom-3 right-4 font-bold text-[9px] md:text-[10px] uppercase opacity-50">
          workspace_v3 — nothing is aligned, everything is intentional
        </span>
      </div>
    </section>
  )
}
