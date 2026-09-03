/* GAP — deliberate emptiness between sections so each one gets the
   screen to itself. The pause between the punches. */

export function Gap({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const h = { sm: 'h-[18svh]', md: 'h-[30svh]', lg: 'h-[45svh]' }[size]
  return <div aria-hidden className={h} />
}
