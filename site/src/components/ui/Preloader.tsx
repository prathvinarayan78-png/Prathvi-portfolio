import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../stores/useAppStore'

/* Animated counter 000 → 100 with floating objects, glitch-out on exit. */

const OBJECTS = ['◆', '●', '▲', '◼', '○', '◇']

export function Preloader() {
  const { loaded, setLoaded } = useAppStore()
  const [count, setCount] = useState(0)

  useEffect(() => {
    let n = 0
    const id = setInterval(() => {
      // ease-out counting like noth.in
      n += Math.max(1, Math.round((100 - n) * 0.06))
      if (n >= 100) {
        n = 100
        clearInterval(id)
        setTimeout(() => setLoaded(true), 450)
      }
      setCount(n)
    }, 40)
    return () => clearInterval(id)
  }, [setLoaded])

  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
          exit={{
            clipPath: 'inset(0 0 100% 0)',
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* floating glyph objects */}
          {OBJECTS.map((o, i) => (
            <motion.span
              key={i}
              className="absolute text-white/20 text-3xl"
              style={{
                left: `${15 + i * 14}%`,
                top: `${25 + (i % 3) * 22}%`,
              }}
              animate={{
                y: [0, -26, 0],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.35, 0.1],
              }}
              transition={{ duration: 3.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {o}
            </motion.span>
          ))}

          <div className="text-center select-none">
            <motion.p
              className="font-mono text-xs tracking-[0.4em] text-white/40 mb-6"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              LOADING EXPERIENCE
            </motion.p>
            <p className="font-display font-bold text-[16vw] leading-none text-white tabular-nums">
              {String(count).padStart(3, '0')}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
