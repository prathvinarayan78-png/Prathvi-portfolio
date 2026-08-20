import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useAppStore } from '../../stores/useAppStore'

/* Giant display typography over the 3D canvas, clip-path reveals. */

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const loaded = useAppStore((s) => s.loaded)

  useEffect(() => {
    if (!loaded) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-line]',
        { clipPath: 'inset(0 0 100% 0)', y: 60 },
        {
          clipPath: 'inset(0 0 0% 0)',
          y: 0,
          duration: 1.3,
          ease: 'power4.out',
          stagger: 0.14,
          delay: 0.25,
        },
      )
      gsap.fromTo(
        '[data-hero-meta]',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, delay: 1.1 },
      )
    }, root)
    return () => ctx.revert()
  }, [loaded])

  return (
    <section ref={root} id="top" className="relative z-10 min-h-[100svh] flex flex-col justify-end px-5 md:px-12 pb-12 md:pb-16 pointer-events-none">
      <p data-hero-meta className="font-mono text-[10px] md:text-[11px] tracking-[0.35em] text-white/50 mb-5 md:mb-6">
        GRAPHIC DESIGN — EDIT — AGENTIC ENGINEERING
      </p>

      <h1 className="font-display font-extrabold text-giant text-white uppercase">
        <span data-hero-line className="block">Making</span>
        <span data-hero-line className="block text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.85)' }}>
          Nothing
        </span>
        <span data-hero-line className="block">Ordinary<span className="text-[#4488ff]">.</span></span>
      </h1>

      <div data-hero-meta className="mt-6 md:mt-8 flex items-center justify-between font-mono text-[9px] md:text-[11px] tracking-[0.25em] text-white/40">
        <span>©2026 — DELHI, IN</span>
        <span className="hidden md:inline">SCROLL TO EXPLORE ↓</span>
        <span className="hidden sm:inline">28.6139° N, 77.2090° E</span>
      </div>
    </section>
  )
}
