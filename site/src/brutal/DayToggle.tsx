import { useEffect, useState } from 'react'
import { initTheme, isDay, toggleDay, onThemeChange } from './theme'

/* DAY/NIGHT toggle — always in sync with the body class, no matter
   which button (this or FLIP THE LIGHTS) changed the theme. */

export function DayToggle() {
  const [day, setDayState] = useState(false)

  useEffect(() => {
    initTheme()
    setDayState(isDay())
    return onThemeChange(setDayState)
  }, [])

  return (
    <button
      data-noclick
      onClick={toggleDay}
      aria-label={day ? 'Switch to dark mode' : 'Switch to light mode'}
      className="fixed bottom-3 left-3 z-[60] slab bg-page font-black text-lg md:text-xl w-12 h-12 md:w-14 md:h-14 grid place-items-center"
      title={day ? 'DARK MODE' : 'LIGHT MODE'}
    >
      {day ? '☾' : '☀'}
    </button>
  )
}
