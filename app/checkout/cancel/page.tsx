'use client'

import { useLightStore } from '@/store/useLightStore'

export default function CheckoutCancelPage() {
  const isLightOn = useLightStore((state) => state.isLightOn)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Cancel Message Card */}
        <div className={`border-2 border-black shadow-hard p-8 ${
          isLightOn ? 'bg-white text-black' : 'bg-black text-white'
        }`}>
          {/* Micro-data Label */}
          <div className={`inline-block border border-black px-2 py-1 mb-6 ${
            isLightOn ? 'bg-white text-black' : 'bg-black text-white'
          }`}>
            <span className="text-xs font-mono font-bold uppercase">STATUS: CANCELLED</span>
          </div>

          <hr className="border-black border-t-2 mb-6" />

          {/* Title */}
          <h1 className="text-4xl font-black uppercase tracking-tight mb-6">
            PAYMENT CANCELLED
          </h1>

          <hr className="border-black border-t-2 mb-6" />

          {/* Message */}
          <div className="mb-6">
            <div className="text-xs font-mono uppercase mb-3">MESSAGE</div>
            <div className="font-mono text-sm leading-relaxed">
              Your payment has been cancelled. No charges were made.
            </div>
          </div>

          <hr className="border-black border-t-2 mb-6" />

          {/* Action */}
          <div className="text-xs font-mono uppercase mb-3">NEXT STEPS</div>
          <div className="font-mono text-sm mb-6">
            You can return to browse our products or try the checkout process again.
          </div>

          {/* Back to Home Button */}
          <a
            href="/"
            className={`inline-block w-full text-center border-2 border-black rounded-none font-mono font-bold uppercase py-4 transition-colors ${
              isLightOn 
                ? 'bg-black text-white hover:bg-white hover:text-black' 
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            RETURN TO STORE
          </a>
        </div>
      </div>
    </main>
  )
}
