'use client'

import { useState, useEffect } from 'react'
import { useLightStore } from '@/store/useLightStore'
import { getProducts, Product } from '@/lib/sanity'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const { isLightOn, toggle } = useLightStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts = await getProducts()
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <main className="min-h-screen p-8">
      {/* Header Section */}
      <div className="mb-8 border-b-2 border-black pb-4">
        <h1
          className="text-7xl font-black uppercase tracking-tight cursor-pointer border-2 border-black bg-white p-8 hover:bg-black hover:text-white transition-colors inline-block shadow-hard"
          onClick={toggle}
        >
          LIGHT / DARK
        </h1>
        <hr className="border-black border-t-2 mt-4" />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12 font-mono uppercase">LOADING PRODUCTS...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 font-mono uppercase">NO PRODUCTS FOUND.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
