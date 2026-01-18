'use client'

import Link from 'next/link'
import { useLightStore } from '@/store/useLightStore'

export default function BackButton() {
  const isLightOn = useLightStore((state) => state.isLightOn)

  return (
    <Link
      href="/"
      className={`inline-block border-2 border-black px-4 py-2 font-mono font-bold uppercase text-sm transition-colors shadow-hard ${
        isLightOn 
          ? 'bg-white text-black hover:bg-black hover:text-white' 
          : 'bg-black text-white hover:bg-white hover:text-black'
      }`}
    >
      ← BACK
    </Link>
  )
}
