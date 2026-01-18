'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLightStore } from '@/store/useLightStore'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const isLightOn = useLightStore((state) => state.isLightOn)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Message Card */}
        <div className={`border-2 border-black shadow-hard p-8 ${
          isLightOn ? 'bg-white text-black' : 'bg-black text-white'
        }`}>
          {/* Micro-data Label */}
          <div className={`inline-block border border-black px-2 py-1 mb-6 ${
            isLightOn ? 'bg-white text-black' : 'bg-black text-white'
          }`}>
            <span className="text-xs font-mono font-bold uppercase">STATUS: SUCCESS</span>
          </div>

          <hr className="border-black border-t-2 mb-6" />

          {/* Title */}
          <h1 className="text-4xl font-black uppercase tracking-tight mb-6">
            PAYMENT SUCCESSFUL
          </h1>

          <hr className="border-black border-t-2 mb-6" />

          {/* Message */}
          <div className="mb-6">
            <div className="text-xs font-mono uppercase mb-3">MESSAGE</div>
            <div className="font-mono text-sm leading-relaxed">
              Thank you for your purchase! Your payment has been processed successfully.
            </div>
          </div>

          {/* Session ID (if available) */}
          {sessionId && (
            <>
              <hr className="border-black border-t-2 mb-6" />
              <div className="mb-6">
                <div className="text-xs font-mono uppercase mb-3">SESSION ID</div>
                <div className="font-mono text-xs break-all border-2 border-black p-3 bg-white text-black">
                  {sessionId}
                </div>
              </div>
            </>
          )}

          <hr className="border-black border-t-2 mb-6" />

          {/* Next Steps */}
          <div className="text-xs font-mono uppercase mb-3">NEXT STEPS</div>
          <div className="font-mono text-sm mb-6">
            You will receive a confirmation email shortly. Your order is being processed.
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="border-2 border-black shadow-hard p-8 bg-white">
            <div className="font-mono uppercase">LOADING...</div>
          </div>
        </div>
      </main>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
