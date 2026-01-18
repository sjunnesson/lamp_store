'use client'

import { useLightStore } from '@/store/useLightStore'

export default function Barcode() {
  const isLightOn = useLightStore((state) => state.isLightOn)

  return (
    <div 
      className={`h-8 w-full ${isLightOn ? 'bg-black' : 'bg-white'}`}
      style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          ${isLightOn ? 'white' : 'black'} 2px,
          ${isLightOn ? 'white' : 'black'} 4px
        )`,
      }}
      aria-label="Barcode pattern"
    />
  )
}
