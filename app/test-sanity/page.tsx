'use client'

import { useEffect, useState } from 'react'
import { getProducts, Product } from '@/lib/sanity'

export default function TestSanityPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
        console.error('Sanity integration error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Loading products from Sanity...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <h2 className="text-2xl font-bold text-red-800 mb-2">Connection Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="text-left bg-white p-4 rounded border text-sm">
              <p className="font-semibold mb-2">Check your environment variables:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>NEXT_PUBLIC_SANITY_PROJECT_ID</li>
                <li>NEXT_PUBLIC_SANITY_DATASET</li>
                <li>NEXT_PUBLIC_SANITY_API_VERSION (optional)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Sanity Integration Test</h1>
        
        {products.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">No Products Found</h2>
            <p className="text-yellow-700">
              The connection is working, but there are no products in your Sanity dataset.
              Make sure you have created products in your Sanity Studio.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-green-600 font-semibold">
              ✓ Successfully connected! Found {products.length} product{products.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="border rounded-lg p-4 shadow-sm">
                  <h2 className="text-xl font-bold mb-2">{product.title}</h2>
                  <p className="text-gray-600 mb-2">Slug: {product.slug.current}</p>
                  <p className="text-lg font-semibold mb-2">${product.price}</p>
                  <p className="text-sm text-gray-500 mb-4">Stripe ID: {product.stripePriceId}</p>
                  
                  <div className="space-y-2">
                    {product.imageOffUrl ? (
                      <div>
                        <p className="text-sm font-semibold mb-1">Image Off (Default):</p>
                        <img 
                          src={product.imageOffUrl} 
                          alt={`${product.title} - Off`}
                          className="w-full h-48 object-cover rounded border"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No imageOff URL</p>
                    )}
                    
                    {product.imageOnUrl ? (
                      <div>
                        <p className="text-sm font-semibold mb-1">Image On (Lit):</p>
                        <img 
                          src={product.imageOnUrl} 
                          alt={`${product.title} - On`}
                          className="w-full h-48 object-cover rounded border"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No imageOn URL</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
