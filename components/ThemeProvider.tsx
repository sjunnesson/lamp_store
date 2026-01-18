'use client'

import { useEffect } from 'react'
import { useLightStore } from '@/store/useLightStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isLightOn = useLightStore((state) => state.isLightOn)

  useEffect(() => {
    if (isLightOn) {
      document.body.className = 'bg-white text-black border-black'
    } else {
      document.body.className = 'bg-[#111] text-white border-white'
    }
  }, [isLightOn])

  return (
    <div
      className={`min-h-screen transition-colors duration-0 ${
        isLightOn
          ? 'bg-white text-black border-black'
          : 'bg-[#111] text-white border-white'
      }`}
    >
      {children}
    </div>
  )
}
