import { useEffect, useState } from 'react'
import gsap from 'gsap'

/* DAY/NIGHT toggle — fixed switch, saves preference, page wobbles on flip. */

export function DayToggle() {
  const [day, setDay] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('prathvi-day') === '1'
    setDay(saved)
    document.body.classList.toggle('day', saved)
  }, [])

  const flip = () => {
    const next = !day
    setDay(next)
    document.body.classList.toggle('day', next)
    localStorage.setItem('prathvi-day', next ? '1' : '0')
    gsap.fromTo('body', { rotate: next ? -0.5 : 0.5 }, { rotate: 0, duration: 0.45, ease: 'elastic.out(1,0.3)' })
  }

  return (
    <button
      data-noclick
      onClick={flip}
      aria-label={day ? 'Switch to night mode' : 'Switch to day mode'}
      className="fixed bottom-3 left-3 z-[60] slab bg-page font-black text-lg md:text-xl w-12 h-12 md:w-14 md:h-14 grid place-items-center"
      title={day ? 'NIGHT MODE' : 'DAY MODE'}
    >
      {day ? '☾' : '☀'}
    </button>
  )
}
