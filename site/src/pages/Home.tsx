import { Link } from 'react-router-dom'
import { PageTransition } from '../components/ui/PageTransition'
import { Hero } from '../components/sections/Hero'
import { Showreel } from '../components/sections/Showreel'
import { TextReveal } from '../components/ui/TextReveal'
import { useCursorLabel } from '../components/ui/CustomCursor'

export default function Home() {
  const cursor = useCursorLabel('VIEW')

  return (
    <PageTransition>
      <Hero />
      <Showreel />

      {/* teaser link to works page */}
      <section className="relative z-10 py-24 md:py-32 px-5 md:px-12 text-center">
        <TextReveal
          className="font-display font-bold text-[clamp(1.8rem,5vw,4.5rem)] leading-tight"
          lines={['The work speaks', 'in three languages.']}
        />
        <Link
          to="/works"
          {...cursor}
          className="inline-block mt-10 border border-white/30 px-8 py-4 font-mono text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-colors duration-300"
        >
          SELECTED WORKS ↗
        </Link>
      </section>
    </PageTransition>
  )
}
