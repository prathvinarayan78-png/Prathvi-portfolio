import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextReveal } from '../ui/TextReveal'
import { useCursorLabel } from '../ui/CustomCursor'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  { img: '/works/work-1.jpg', title: 'CHROME FLOW', tag: 'BRAND / 3D', year: '2026' },
  { img: '/works/work-2.jpg', title: 'MONOLITH', tag: 'ART DIRECTION', year: '2026' },
  { img: '/works/work-3.jpg', title: 'GLASS SYSTEM', tag: 'DESIGN SYSTEM', year: '2025' },
  { img: '/works/work-4.jpg', title: 'SIGNAL LOST', tag: 'MOTION / EDIT', year: '2025' },
]

function Card({ p, i }: { p: (typeof PROJECTS)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const cursor = useCursorLabel('EXPLORE')

  // 3D tilt + inner image parallax — quickTo setters, zero tween churn
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const el = ref.current!
    const img = el.querySelector('img')!

    const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
    const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
    const imgX = gsap.quickTo(img, 'x', { duration: 0.6, ease: 'power3.out' })
    const imgY = gsap.quickTo(img, 'y', { duration: 0.6, ease: 'power3.out' })

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      rotY(px * 10); rotX(-py * 8)
      imgX(px * -18); imgY(py * -14)
    }
    const leave = () => { rotY(0); rotX(0); imgX(0); imgY(0) }
    el.addEventListener('mousemove', move, { passive: true })
    el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) }
  }, [])

  return (
    <div
      data-card
      className={`group ${i % 2 === 1 ? 'sm:mt-24' : ''}`}
      style={{ perspective: '900px' }}
    >
      <div ref={ref} {...cursor} className="relative overflow-hidden bg-[#111] border border-white/10 will-change-transform">
        <img
          src={p.img}
          alt={p.title}
          className="w-full aspect-[4/3] object-cover scale-110 opacity-90 group-hover:opacity-100 transition-opacity duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 right-4 font-mono text-[10px] tracking-[0.3em] text-white/50">{p.year}</span>
      </div>
      <div className="flex items-baseline justify-between mt-4">
        <h3 className="font-display font-bold text-xl md:text-2xl">{p.title}</h3>
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">{p.tag}</span>
      </div>
    </div>
  )
}

export function Works() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-card]',
        { y: 90, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="works" className="relative z-10 py-20 md:py-32 px-5 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-16">
        <TextReveal
          className="font-display font-bold text-[clamp(2.2rem,6vw,5.5rem)] leading-none"
          lines={['SELECTED', 'WORKS®']}
        />
        <span className="font-mono text-[11px] tracking-[0.3em] text-white/40 mb-2 hidden md:block">(004)</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
        {PROJECTS.map((p, i) => (
          <Card key={p.title} p={p} i={i} />
        ))}
      </div>
    </section>
  )
}
