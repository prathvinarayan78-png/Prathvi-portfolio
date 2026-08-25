/* Full-bleed marquee divider between sections. */

export function Ticker({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const row = items.flatMap((s) => [s, '✦'])
  return (
    <div className="relative z-10 overflow-hidden border-y border-white/10 py-4 md:py-5 bg-black/30 backdrop-blur-sm">
      <div
        className="animate-marquee flex whitespace-nowrap items-center gap-8 font-mono text-[11px] md:text-xs tracking-[0.35em] text-white/60"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {[...row, ...row, ...row, ...row].map((s, i) =>
          s === '✦' ? (
            <span key={i} className="text-[#4488ff]">✦</span>
          ) : (
            <span key={i}>{s}</span>
          ),
        )}
      </div>
    </div>
  )
}
