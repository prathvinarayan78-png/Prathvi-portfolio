/* Sticky brutal nav — thick border, hard links. */

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-[3px] border-current bg-inherit">
      <div className="flex items-stretch justify-between">
        <a href="#top" className="font-black uppercase text-lg md:text-xl px-4 md:px-8 py-3 md:py-4" data-noclick>
          PRATHVI<span className="text-[#ff2f2f]">***</span>
        </a>
        <nav className="flex items-stretch font-bold text-[11px] md:text-sm uppercase">
          <a href="#work" data-noclick className="hidden sm:flex items-center px-4 md:px-6 border-l-[3px] border-current hover:bg-[#eaff00] hover:text-[#0a0a0a] transition-colors">
            Work
          </a>
          <a href="#contact" data-noclick className="flex items-center px-4 md:px-6 border-l-[3px] border-current bg-[#eaff00] text-[#0a0a0a] hover:bg-[#ff2f2f] hover:text-white transition-colors">
            Hire me
          </a>
        </nav>
      </div>
    </header>
  )
}
