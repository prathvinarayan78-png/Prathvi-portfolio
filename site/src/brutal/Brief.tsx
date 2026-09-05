import { useState } from 'react'

/* THE*BRIEF — pre-qualifying mini-form (research: forms that scope
   the project convert better than bare mailto). Builds a mailto with
   everything pre-filled, so it works with zero backend. */

const TYPES = ['POSTER / BRAND', 'WEBSITE', 'VIDEO EDIT', 'THE WHOLE MACHINE']
const BUDGETS = ['STARTER', 'SERIOUS', 'BIG SWING', 'TELL ME']

export function Brief() {
  const [type, setType] = useState('')
  const [budget, setBudget] = useState('')
  const [msg, setMsg] = useState('')

  const ready = type && budget
  const href = `mailto:hello@prathvi.design?subject=${encodeURIComponent(
    `[BRIEF] ${type} — budget: ${budget}`,
  )}&body=${encodeURIComponent(`Project type: ${type}\nBudget zone: ${budget}\n\nThe mission:\n${msg || '(tell me everything)'}`)}`

  return (
    <section className="px-4 md:px-8 py-20 md:py-28">
      <div className="max-w-3xl mx-auto slab bg-page p-6 md:p-10" data-noclick>
        <p className="font-bold text-[10px] md:text-xs uppercase text-[#ff4d00] mb-2">// 30-second brief</p>
        <p className="mega text-[clamp(1.6rem,4vw,2.8rem)] mb-8">SCOPE IT RIGHT NOW.</p>

        <p className="font-bold text-[10px] md:text-xs uppercase opacity-60 mb-3">01 — what are we making?</p>
        <div className="flex flex-wrap gap-2.5 mb-8">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`slab font-black uppercase text-[10px] md:text-xs px-4 py-2.5 transition-colors ${
                type === t ? 'acid' : 'bg-page'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <p className="font-bold text-[10px] md:text-xs uppercase opacity-60 mb-3">02 — budget zone?</p>
        <div className="flex flex-wrap gap-2.5 mb-8">
          {BUDGETS.map((b) => (
            <button
              key={b}
              onClick={() => setBudget(b)}
              className={`slab font-black uppercase text-[10px] md:text-xs px-4 py-2.5 transition-colors ${
                budget === b ? 'pop' : 'bg-page'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <p className="font-bold text-[10px] md:text-xs uppercase opacity-60 mb-3">03 — the mission (optional)</p>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={3}
          placeholder="WHAT ARE WE BREAKING INTO A MILLION BEAUTIFUL PIECES?"
          className="w-full border-[3px] border-current bg-transparent font-bold text-xs md:text-sm uppercase p-4 placeholder:opacity-40 focus:outline-none focus:border-[#ff4d00] mb-8 resize-none"
        />

        <a
          href={ready ? href : undefined}
          aria-disabled={!ready}
          className={`slab inline-block font-black uppercase text-sm md:text-lg px-8 py-4 transition-opacity ${
            ready ? 'blue glow-orange' : 'bg-page opacity-40 pointer-events-none'
          }`}
        >
          {ready ? 'FIRE THE BRIEF ▸' : 'PICK 01 + 02 FIRST'}
        </a>
        <p className="font-bold text-[9px] md:text-[10px] uppercase opacity-50 mt-4">
          opens your email with everything pre-filled. reply &lt; 24h.
        </p>
      </div>
    </section>
  )
}
