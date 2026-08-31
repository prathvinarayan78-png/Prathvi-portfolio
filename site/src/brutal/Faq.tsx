import { useState } from 'react'

/* REAL*TALK — brutal FAQ accordion. */

const QA = [
  { q: 'HOW FAST CAN YOU DELIVER?', a: 'First drafts in 48 hours. Full projects depend on scope — but I don’t do month-long silences. You’ll see progress constantly.' },
  { q: 'WHAT DO YOU CHARGE?', a: 'Depends what we’re making. Posters ≠ full brand ≠ website ≠ edit. Tell me the mission, I’ll quote the ammo. No hidden fees, ever.' },
  { q: 'DO YOU USE TEMPLATES?', a: 'No. Read the footer. NO TEMPLATES WERE HARMED because none were used. Everything is drawn, coded and cut by hand.' },
  { q: 'CAN YOU MATCH MY BRAND STYLE?', a: 'Yes — loud is a choice, not a limitation. I can whisper elegantly too. This site is just me off the leash.' },
  { q: 'REVISIONS?', a: 'Included until it slaps. I’m not precious about drafts — I’m precious about the final thing being right.' },
  { q: 'WHY SHOULD I HIRE A 3-IN-1?', a: 'One brain, zero handoffs. The designer, developer and editor never miscommunicate because they share a skull.' },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="px-4 md:px-8 py-16 md:py-24 border-t-[3px] border-current">
      <div className="flex items-end justify-between mb-8">
        <h2 className="mega text-[clamp(2.6rem,9vw,8rem)]">
          REAL<span className="text-[#ff4d00]">*</span>TALK
        </h2>
        <span className="font-bold text-xs md:text-sm uppercase">the questions everyone asks</span>
      </div>

      <div className="border-t-[3px] border-current max-w-4xl">
        {QA.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={i} className="border-b-[3px] border-current">
              <button
                data-noclick
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-4 md:py-5 text-left group hover:bg-[#00ffa3] hover:text-[#0a0a0a] transition-colors px-2 md:px-4"
              >
                <span className="font-black uppercase text-sm md:text-xl">{item.q}</span>
                <span className="font-black text-2xl md:text-3xl shrink-0 group-hover:rotate-90 transition-transform duration-150">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                <div className="overflow-hidden">
                  <p className="font-bold text-xs md:text-sm uppercase leading-relaxed px-2 md:px-4 pb-5 max-w-2xl opacity-80">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
