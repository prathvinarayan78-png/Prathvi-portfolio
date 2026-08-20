import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCursorLabel } from './CustomCursor'

const LINKS = [
  { to: '/works', label: 'WORKS' },
  { to: '/studio', label: 'STUDIO' },
  { to: '/contact', label: 'CONTACT' },
]

export function Navigation() {
  const cursor = useCursorLabel('GO')
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // close menu on navigation + lock scroll while open
  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-12 py-5 md:py-6 mix-blend-difference text-white">
        <Link to="/" className="font-display font-bold tracking-tight text-lg" {...cursor}>
          PRATHVI<sup className="font-mono text-[9px] align-super">®</sup>
        </Link>

        {/* desktop */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-[0.25em]">
          {LINKS.slice(0, 2).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              {...cursor}
              className={({ isActive }) =>
                `transition-opacity ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            {...cursor}
            className="border border-white/40 px-4 py-2 hover:bg-white hover:text-black transition-colors"
          >
            START A PROJECT
          </NavLink>
        </nav>

        {/* mobile burger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden relative z-[86] w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className={`block w-6 h-px bg-white transition-transform duration-300 ${open ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`block w-6 h-px bg-white transition-transform duration-300 ${open ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </header>

      {/* mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] bg-[#0a0a0a]/96 backdrop-blur-md flex flex-col justify-center px-8 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}
            exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } }}
          >
            <p className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-8">NAVIGATION</p>
            {[{ to: '/', label: 'HOME' }, ...LINKS].map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.15 + i * 0.07 } }}
              >
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `block py-3 font-display font-bold text-4xl ${isActive ? 'text-[#4488ff]' : 'text-white'}`
                  }
                >
                  {l.label}
                </NavLink>
              </motion.div>
            ))}
            <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 mt-12">
              ©2026 — DELHI, IN
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
