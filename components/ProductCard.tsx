'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLightStore } from '@/store/useLightStore'
import { Product } from '@/lib/sanity'
import Barcode from './Barcode'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const isLightOn = useLightStore((state) => state.isLightOn)

  return (
    <Link 
      href={`/product/${product.slug.current}`}
      className={`relative block border-2 border-black shadow-hard rounded-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-hover transition-all cursor-pointer ${
        isLightOn ? 'bg-white text-black' : 'bg-black text-white'
      }`}
    >
      {/* Micro-data Label - Top Left */}
      <div className={`absolute top-2 left-2 z-10 border border-black px-1.5 py-0.5 ${
        isLightOn ? 'bg-white text-black' : 'bg-black text-white'
      }`}>
        <span className="text-xs font-mono font-bold uppercase">FIG-{product._id.slice(-4)}</span>
      </div>

      {/* Micro-data Label - Top Right */}
      <div className={`absolute top-2 right-2 z-10 border border-black px-1.5 py-0.5 ${
        isLightOn ? 'bg-white text-black' : 'bg-black text-white'
      }`}>
        <span className="text-xs font-mono font-bold uppercase">QTY:1</span>
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden border-b-2 border-black">
        {product.imageOffUrl && (
          <motion.img
            src={product.imageOffUrl}
            alt={`${product.title} - Off`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 1 }}
            animate={{ opacity: isLightOn ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {product.imageOnUrl && (
          <motion.img
            src={product.imageOnUrl}
            alt={`${product.title} - Lit`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLightOn ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>

      {/* Barcode */}
      <div className="border-b-2 border-black">
        <Barcode />
      </div>

      {/* Data Grid - Manifest Style */}
      <div className="divide-y-2 divide-black">
        {/* Title Row */}
        <div className="p-3">
          <div className="font-sans font-black uppercase tracking-tight text-sm">
            {product.title}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 divide-x-2 divide-black">
          <div className="p-3">
            <div className="text-xs font-mono uppercase mb-1">PRICE</div>
            <div className="font-mono font-bold text-lg">${product.price.toFixed(2)}</div>
          </div>
          <div className="p-3">
            <div className="text-xs font-mono uppercase mb-1">SKU</div>
            <div className="font-mono text-sm">{product.slug.current.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
