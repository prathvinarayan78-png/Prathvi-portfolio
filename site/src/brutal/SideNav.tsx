import { useEffect, useState } from 'react'

/* Sticky side rail — tracks which section you're in, click to jump. */

const SECTIONS = [
  { id: 'top', label: 'TOP' },
  { id: 'work', label: 'WORK' },
  { id: 'process', label: 'HOW' },
  { id: 'services', label: 'I DO' },
  { id: 'road', label: 'ROAD' },
  { id: 'lab', label: 'LAB' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'TALK' },
]

export function SideNav() {
  const [active, setActive] = useState('top')

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <nav className="fixed left-3 top-1/2 -translate-y-1/2 z-[55] hidden lg:flex flex-col gap-1.5" data-noclick>
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`font-black text-[9px] tracking-[0.1em] border-[2.5px] border-current px-2 py-1 transition-all duration-150 ${
            active === s.id
              ? 'bg-[#ff4d00] text-[#0a0a0a] translate-x-1'
              : 'opacity-40 hover:opacity-100'
          }`}
        >
          {s.label}
        </a>
      ))}
    </nav>
  )
}
