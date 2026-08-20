import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Line-by-line reveal — each child string becomes a masked line. */

export function TextReveal({
  lines,
  className = '',
  stagger = 0.09,
}: {
  lines: ReactNode[]
  className?: string
  stagger?: number
}) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const spans = root.current!.querySelectorAll('[data-line] > span')
    const ctx = gsap.context(() => {
      gsap.to(spans, {
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger,
        scrollTrigger: {
          trigger: root.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    }, root)
    return () => ctx.revert()
  }, [stagger])

  return (
    <div ref={root} className={className}>
      {lines.map((l, i) => (
        <span data-line key={i}>
          <span>{l}</span>
        </span>
      ))}
    </div>
  )
}
