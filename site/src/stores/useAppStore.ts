import { create } from 'zustand'

interface AppState {
  loaded: boolean
  progress: number
  setProgress: (p: number) => void
  setLoaded: (v: boolean) => void
  cursorLabel: string
  setCursorLabel: (l: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  loaded: false,
  progress: 0,
  setProgress: (progress) => set({ progress }),
  setLoaded: (loaded) => set({ loaded }),
  cursorLabel: '',
  setCursorLabel: (cursorLabel) => set({ cursorLabel }),
}))
