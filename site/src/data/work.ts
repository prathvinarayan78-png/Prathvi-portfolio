/* ============================================================
   YOUR WORK LIVES HERE.
   To add a piece: drop the image into site/public/work/
   and add an entry below. Nothing else to touch.
   ============================================================ */

export interface DesignPiece {
  img: string
  title: string
  kind: string   // e.g. POSTER / BRANDING / COVER ART
  year: string
  /* grid span — 'tall' | 'wide' | 'square' controls the mosaic */
  span: 'tall' | 'wide' | 'square'
}

export interface WebPiece {
  img: string
  title: string
  stack: string  // e.g. REACT · THREE.JS
  url?: string   // live link (optional)
  year: string
}

export interface EditPiece {
  img: string        // poster frame
  video?: string     // mp4 in public/work/ (optional — plays on hover/click)
  title: string
  kind: string       // e.g. MUSIC VIDEO / SHORT FILM / REEL
  duration: string   // e.g. 01:24
  year: string
}

export const DESIGN_WORK: DesignPiece[] = [
  { img: '/work/design-1.jpg', title: 'BLUE NOISE', kind: 'POSTER SERIES', year: '2026', span: 'tall' },
  { img: '/work/design-2.jpg', title: 'AMBER & CO', kind: 'BRAND IDENTITY', year: '2026', span: 'wide' },
  { img: '/work/design-3.jpg', title: 'RED SHIFT', kind: 'COVER ART', year: '2025', span: 'square' },
]

export const WEB_WORK: WebPiece[] = [
  { img: '/work/web-1.jpg', title: 'STUDIO ORBIT', stack: 'REACT · THREE.JS · GSAP', year: '2026' },
  { img: '/work/web-2.jpg', title: 'MAISON CREAM', stack: 'NEXT.JS · COMMERCE', year: '2025' },
]

export const EDIT_WORK: EditPiece[] = [
  { img: '/work/edit-1.jpg', title: 'NIGHT SIGNAL', kind: 'MUSIC VIDEO', duration: '02:41', year: '2026' },
  { img: '/work/edit-2.jpg', title: 'ASCENT', kind: 'SHORT FILM', duration: '04:17', year: '2025' },
]
