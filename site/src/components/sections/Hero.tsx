import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useAppStore } from '../../stores/useAppStore'

/* Giant interactive typography — letters wave-lift on hover,
   clip-path reveals on load. */

function WaveWord({ word, className = '', stroke = false }: { word: string; className?: string; stroke?: boolean }) {
  const onEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const chars = e.currentTarget.querySelectorAll('[data-ch]')
    const idx = Array.from(chars).indexOf(e.target as HTMLElement)
    chars.forEach((ch, i) => {
      const dist = Math.abs(i - (idx < 0 ? 0 : idx))
      gsap.to(ch, {
        y: -Math.max(0, 26 - dist * 8),
        duration: 0.35,
        ease: 'power2.out',
        delay: dist * 0.02,
        onComplete: () => gsap.to(ch, { y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' }),
      })
    })
  }

  return (
    <span
      data-hero-line
      className={`block pointer-events-auto select-none ${className}`}
      style={stroke ? { WebkitTextStroke: '1.5px rgba(255,255,255,0.85)', color: 'transparent' } : undefined}
      onMouseEnter={onEnter}
    >
      {word.split('').map((c, i) => (
        <span key={i} data-ch className="inline-block will-change-transform">
          {c}
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const loaded = useAppStore((s) => s.loaded)

  useEffect(() => {
    if (!loaded) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-line]',
        { clipPath: 'inset(0 0 100% 0)', y: 60 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.3, ease: 'power4.out', stagger: 0.14, delay: 0.25 },
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
        GRAPHIC DESIGN — WEBSITES — VIDEO EDITING
      </p>

      <h1 className="font-display font-extrabold text-giant text-white uppercase">
        <WaveWord word="Making" />
        <WaveWord word="Nothing" stroke />
        <span data-hero-line className="block pointer-events-auto">
          <WaveWordInline word="Ordinary" />
          <span className="text-[#4488ff]">.</span>
        </span>
      </h1>

      <div data-hero-meta className="mt-6 md:mt-8 flex items-center justify-between font-mono text-[9px] md:text-[11px] tracking-[0.25em] text-white/40">
        <span>©2026 — DELHI, IN</span>
        <span className="hidden md:inline animate-pulse">SCROLL TO EXPLORE ↓</span>
        <span className="hidden sm:inline">28.6139° N, 77.2090° E</span>
      </div>
    </section>
  )
}

/* inline variant (keeps the dot on the same line) */
function WaveWordInline({ word }: { word: string }) {
  const onEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const chars = e.currentTarget.querySelectorAll('[data-ch]')
    chars.forEach((ch, i) => {
      gsap.to(ch, {
        y: -20,
        duration: 0.3,
        delay: i * 0.025,
        ease: 'power2.out',
        onComplete: () => gsap.to(ch, { y: 0, duration: 0.65, ease: 'elastic.out(1,0.4)' }),
      })
    })
  }
  return (
    <span className="inline-block" onMouseEnter={onEnter}>
      {word.split('').map((c, i) => (
        <span key={i} data-ch className="inline-block will-change-transform">
          {c}
        </span>
      ))}
    </span>
  )
}
