import { useCursorLabel } from './CustomCursor'

export function Navigation() {
  const cursor = useCursorLabel('GO')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 mix-blend-difference text-white">
      <a href="#top" className="font-display font-bold tracking-tight text-lg" {...cursor}>
        PRATHVI<sup className="font-mono text-[9px] align-super">®</sup>
      </a>
      <nav className="flex items-center gap-8 font-mono text-[11px] tracking-[0.25em]">
        <a href="#works" className="hidden md:inline opacity-70 hover:opacity-100 transition-opacity" {...cursor}>WORKS</a>
        <a href="#studio" className="hidden md:inline opacity-70 hover:opacity-100 transition-opacity" {...cursor}>STUDIO</a>
        <a href="#contact" className="border border-white/40 px-4 py-2 hover:bg-white hover:text-black transition-colors" {...cursor}>
          START A PROJECT
        </a>
      </nav>
    </header>
  )
}
