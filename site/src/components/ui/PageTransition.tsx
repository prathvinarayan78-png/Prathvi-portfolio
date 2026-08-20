import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/* Route transition: content fades/slides in, a curtain wipes out. */

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <>
      {/* curtain wipe */}
      <motion.div
        className="fixed inset-0 z-[80] bg-[#111318] pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
        exit={{ scaleY: 0 }}
        style={{ transformOrigin: 'top' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] } }}
        exit={{ opacity: 0, y: -24, transition: { duration: 0.3, ease: 'easeIn' } }}
      >
        {children}
      </motion.div>
    </>
  )
}
