import { PageTransition } from '../components/ui/PageTransition'
import { TextReveal } from '../components/ui/TextReveal'
import { useCursorLabel } from '../components/ui/CustomCursor'

const CHANNELS = [
  { label: 'EMAIL', value: 'HELLO@PRATHVI.DESIGN', href: 'mailto:hello@prathvi.design' },
  { label: 'INSTAGRAM', value: '@PRATHVI.DESIGN', href: '#' },
  { label: 'GITHUB', value: 'PRATHVINARAYAN', href: '#' },
  { label: 'BEHANCE', value: 'PRATHVI', href: '#' },
]

export default function ContactPage() {
  const cursor = useCursorLabel('SAY HI')

  return (
    <PageTransition>
      <section className="relative z-10 min-h-screen flex flex-col justify-center pt-28 md:pt-32 pb-20 px-5 md:px-12 max-w-7xl mx-auto w-full">
        <p className="font-mono text-[11px] tracking-[0.35em] text-[#4488ff] mb-6">// CO-CREATE</p>
        <TextReveal
          className="font-display font-extrabold text-[clamp(2.6rem,9vw,8rem)] leading-[0.95] uppercase"
          lines={['Got a', <>project<span className="text-[#4488ff]">?</span></>, "Let's talk."]}
        />

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6 mt-16 max-w-2xl">
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              {...cursor}
              className="group border-b border-white/10 pb-4 hover:border-[#ffaa33] transition-colors"
            >
              <p className="font-mono text-[10px] tracking-[0.3em] text-white/40">{c.label}</p>
              <p className="font-mono text-sm md:text-base tracking-[0.12em] mt-2 group-hover:text-[#ffaa33] transition-colors">
                {c.value} ↗
              </p>
            </a>
          ))}
        </div>

        <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 mt-16">
          RESPONSE &lt; 24H — DELHI, IN (GMT+5:30)
        </p>
      </section>
    </PageTransition>
  )
}
