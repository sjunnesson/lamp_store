'use client'

import { useState } from 'react'
import { useLightStore } from '@/store/useLightStore'
import { Product } from '@/lib/sanity'

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const isLightOn = useLightStore((state) => state.isLightOn)
  const [isLoading, setIsLoading] = useState(false)

  const handleBuyNow = async () => {
    if (!product.stripePriceId) {
      alert('Product is not available for purchase. Missing Stripe Price ID.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/ucp/checkout-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line_items: [
            {
              price_id: product.stripePriceId,
              quantity: 1,
            },
          ],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.action_url) {
        window.location.href = data.action_url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error instanceof Error ? error.message : 'Failed to start checkout. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className={`border-2 border-black shadow-hard p-6 ${
      isLightOn ? 'bg-white text-black' : 'bg-black text-white'
    }`}>
      {/* Micro-data Labels */}
      <div className="flex justify-between items-start mb-4">
        <div className={`border border-black px-2 py-1 ${
          isLightOn ? 'bg-white text-black' : 'bg-black text-white'
        }`}>
          <span className="text-xs font-mono font-bold uppercase">
            REF-{product._id.slice(-6)}
          </span>
        </div>
        <div className={`border border-black px-2 py-1 ${
          isLightOn ? 'bg-white text-black' : 'bg-black text-white'
        }`}>
          <span className="text-xs font-mono font-bold uppercase">
            SKU: {product.slug.current.toUpperCase()}
          </span>
        </div>
      </div>

      <hr className="border-black border-t-2 mb-6" />

      {/* Title */}
      <h1 className="text-4xl font-black uppercase tracking-tight mb-6">
        {product.title}
      </h1>

      <hr className="border-black border-t-2 mb-6" />

      {/* Price */}
      <div className="mb-6">
        <div className="text-xs font-mono uppercase mb-2">PRICE</div>
        <div className="font-mono font-bold text-3xl">
          ${product.price.toFixed(2)}
        </div>
      </div>

      {/* Dimensions */}
      {product.dimensions && (
        <div className="mb-6 border-2 border-black p-4">
          <div className="text-xs font-mono uppercase mb-3">DIMENSIONS</div>
          <div className="grid grid-cols-3 divide-x-2 divide-black font-mono">
            {product.dimensions.width && (
              <div>
                <div className="text-xs uppercase mb-1">WIDTH</div>
                <div className="font-bold">{product.dimensions.width} CM</div>
              </div>
            )}
            {product.dimensions.height && (
              <div>
                <div className="text-xs uppercase mb-1">HEIGHT</div>
                <div className="font-bold">{product.dimensions.height} CM</div>
              </div>
            )}
            {product.dimensions.depth && (
              <div>
                <div className="text-xs uppercase mb-1">DEPTH</div>
                <div className="font-bold">{product.dimensions.depth} CM</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="mb-6">
          <div className="text-xs font-mono uppercase mb-3">DESCRIPTION</div>
          <div className="font-mono text-sm leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>
      )}

      <hr className="border-black border-t-2 mb-6" />

      {/* BUY Button */}
      <button 
        onClick={handleBuyNow}
        disabled={isLoading || !product.stripePriceId}
        className={`w-full border-2 border-black rounded-none font-mono font-bold uppercase py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isLightOn 
            ? 'bg-black text-white hover:bg-white hover:text-black' 
            : 'bg-white text-black hover:bg-black hover:text-white'
        }`}
      >
        {isLoading ? 'PROCESSING...' : 'BUY NOW ↗'}
      </button>
    </div>
  )
}
