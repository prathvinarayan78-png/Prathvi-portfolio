import { useEffect, useState } from 'react'

/* Click anywhere on empty space → spray a rotating rubber stamp.
   The page becomes the visitor's canvas. */

const WORDS = ['NICE.', 'BRUTAL', 'WOW', 'CLICK', 'MORE', 'YES!!', 'LOUD', 'RAW*', 'OK???', 'SHIP IT']
const COLORS = ['#ff4d00', '#00ffa3', '#2f49ff', '#ffffff']

interface Stamp { id: number; x: number; y: number; word: string; color: string; rot: number }

export function StampLayer() {
  const [stamps, setStamps] = useState<Stamp[]>([])

  useEffect(() => {
    let id = 0
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      // only on non-interactive surfaces
      if (t.closest('a,button,input,textarea,[data-noclick]')) return
      const day = document.body.classList.contains('day') && !document.body.classList.contains('inv')
      const palette = day ? COLORS.map((c) => (c === '#ffffff' ? '#0a0a0a' : c)) : COLORS
      const stamp: Stamp = {
        id: id++,
        x: e.pageX,
        y: e.pageY,
        word: WORDS[Math.floor(Math.random() * WORDS.length)],
        color: palette[Math.floor(Math.random() * palette.length)],
        rot: (Math.random() - 0.5) * 30,
      }
      setStamps((s) => [...s.slice(-24), stamp]) // cap at 25
    }
    addEventListener('click', onClick)
    return () => removeEventListener('click', onClick)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {stamps.map((s) => (
        <span
          key={s.id}
          className="stamp"
          style={{
            left: s.x, top: s.y,
            color: s.color,
            ['--rot' as string]: `${s.rot}deg`,
            transform: `translate(-50%,-50%) rotate(${s.rot}deg)`,
          }}
        >
          {s.word}
        </span>
      ))}
    </div>
  )
}
