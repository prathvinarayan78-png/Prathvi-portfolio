/* Chunky bordered marquee strip — speeds up 4x on hover. */

export function Marquee({
  items,
  className = '',
  speed = 18,
  reverse = false,
}: {
  items: string[]
  className?: string
  speed?: number
  reverse?: boolean
}) {
  const row = items.flatMap((s) => [s, '★'])
  return (
    <div className={`marq-wrap overflow-hidden border-y-[3px] border-current py-3 md:py-4 ${className}`}>
      <div
        className="marq flex whitespace-nowrap items-center gap-6 font-black text-lg md:text-2xl uppercase"
        style={{ ['--spd' as string]: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {[...row, ...row, ...row, ...row].map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
    </div>
  )
}
