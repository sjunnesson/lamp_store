import { create } from 'zustand'

interface LightStore {
  isLightOn: boolean
  toggle: () => void
}

export const useLightStore = create<LightStore>((set) => ({
  isLightOn: true,
  toggle: () => set((state) => ({ isLightOn: !state.isLightOn })),
}))
