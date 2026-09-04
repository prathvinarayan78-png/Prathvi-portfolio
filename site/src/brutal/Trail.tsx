import { useEffect } from 'react'
import gsap from 'gsap'

/* CURSOR TRAIL — tiny squares peel off the cursor as it moves,
   tumble and fade. Cheap: throttled spawn, GSAP-driven, desktop only. */

const COLORS = ['#ff4d00', '#00ffa3', '#2f49ff', '#ffffff']

export function Trail() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let last = 0
    let i = 0
    const move = (e: MouseEvent) => {
      const now = performance.now()
      if (now - last < 40) return // throttle ~25/s max
      last = now
      const bit = document.createElement('span')
      bit.className = 'trail-bit'
      bit.style.left = `${e.clientX}px`
      bit.style.top = `${e.clientY}px`
      bit.style.background = COLORS[i++ % COLORS.length]
      document.body.appendChild(bit)
      gsap.to(bit, {
        x: (Math.random() - 0.5) * 44,
        y: 20 + Math.random() * 34,
        rotation: (Math.random() - 0.5) * 240,
        scale: 0,
        duration: 0.55 + Math.random() * 0.3,
        ease: 'power2.out',
        onComplete: () => bit.remove(),
      })
    }
    addEventListener('mousemove', move, { passive: true })
    return () => removeEventListener('mousemove', move)
  }, [])

  return null
}
