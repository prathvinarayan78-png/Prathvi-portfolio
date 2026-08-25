import { Link } from 'react-router-dom'
import { TextReveal } from '../ui/TextReveal'
import { useCursorLabel } from '../ui/CustomCursor'
import { Magnetic } from '../ui/Magnetic'

export function HomeCta() {
  const cursor = useCursorLabel('LET’S GO')

  return (
    <section className="relative z-10 py-28 md:py-40 px-5 md:px-12 text-center">
      <p className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-8">
        NEXT MISSION
      </p>
      <TextReveal
        className="font-display font-extrabold text-[clamp(2.4rem,8vw,7rem)] leading-[0.95] uppercase"
        lines={['Your project', <>starts <span className="text-[#4488ff]">here</span>.</>]}
      />
      <div className="mt-12">
        <Magnetic>
          <Link
            to="/contact"
            {...cursor}
            className="inline-block border border-white/30 px-10 py-5 font-mono text-xs tracking-[0.35em] hover:bg-white hover:text-black transition-colors duration-300"
          >
            START A PROJECT ↗
          </Link>
        </Magnetic>
      </div>
    </section>
  )
}
