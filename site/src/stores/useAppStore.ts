import { create } from 'zustand'

interface AppState {
  loaded: boolean
  progress: number
  setProgress: (p: number) => void
  setLoaded: (v: boolean) => void
  cursorLabel: string
  setCursorLabel: (l: string) => void
  /* 0-1 page scroll progress — drives the 3D scene's mood */
  scrollP: number
  setScrollP: (p: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  loaded: false,
  progress: 0,
  setProgress: (progress) => set({ progress }),
  setLoaded: (loaded) => set({ loaded }),
  cursorLabel: '',
  setCursorLabel: (cursorLabel) => set({ cursorLabel }),
  scrollP: 0,
  setScrollP: (scrollP) => set({ scrollP }),
}))
