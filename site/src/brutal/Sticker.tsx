import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/* Draggable, throwable stickers with momentum — grab and fling. */

export function Sticker({
  children,
  x,
  y,
  rot = 0,
  className = '',
}: {
  children: React.ReactNode
  x: string
  y: string
  rot?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current!
    let dragging = false
    let px = 0, py = 0, vx = 0, vy = 0
    let cx = 0, cy = 0
    let raf = 0

    const down = (e: PointerEvent) => {
      dragging = true
      px = e.clientX; py = e.clientY
      el.setPointerCapture(e.pointerId)
      gsap.to(el, { scale: 1.15, rotation: rot + (Math.random() - 0.5) * 14, duration: 0.15 })
      cancelAnimationFrame(raf)
      e.preventDefault()
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      vx = e.clientX - px; vy = e.clientY - py
      px = e.clientX; py = e.clientY
      cx += vx; cy += vy
      gsap.set(el, { x: cx, y: cy })
    }
    const up = () => {
      if (!dragging) return
      dragging = false
      gsap.to(el, { scale: 1, duration: 0.2 })
      // fling with momentum + friction
      const fling = () => {
        vx *= 0.94; vy *= 0.94
        cx += vx; cy += vy
        gsap.set(el, { x: cx, y: cy })
        if (Math.abs(vx) > 0.3 || Math.abs(vy) > 0.3) raf = requestAnimationFrame(fling)
      }
      fling()
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      cancelAnimationFrame(raf)
    }
  }, [rot])

  return (
    <div
      ref={ref}
      data-noclick
      className={`absolute z-20 cursor-grab active:cursor-grabbing select-none touch-none will-change-transform ${className}`}
      style={{ left: x, top: y, rotate: `${rot}deg` }}
    >
      {children}
    </div>
  )
}
