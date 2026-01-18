import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug } from '@/lib/sanity'
import ImageCarousel from '@/components/ImageCarousel'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Prepare images for carousel (imageOff and imageOn)
  const carouselImages = [
    product.imageOffUrl,
    product.imageOnUrl,
  ].filter((img): img is string => Boolean(img))

  return (
    <main className="min-h-screen p-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-block bg-white border-2 border-black px-4 py-2 font-mono font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors shadow-hard"
        >
          ← BACK
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div>
            <ImageCarousel images={carouselImages} alt={product.title} />
          </div>

          {/* Product Information */}
          <div className="bg-white border-2 border-black shadow-hard p-6">
            {/* Micro-data Labels */}
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white border border-black px-2 py-1">
                <span className="text-xs font-mono font-bold uppercase">
                  REF-{product._id.slice(-6)}
                </span>
              </div>
              <div className="bg-white border border-black px-2 py-1">
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
            <button className="w-full bg-black text-white border-2 border-black rounded-none font-mono font-bold uppercase py-4 hover:bg-white hover:text-black transition-colors">
              BUY NOW ↗
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
