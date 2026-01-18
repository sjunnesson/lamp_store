import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/sanity'
import ImageCarousel from '@/components/ImageCarousel'
import ProductInfo from '@/components/ProductInfo'
import BackButton from '@/components/BackButton'

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
        <BackButton />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div>
            <ImageCarousel images={carouselImages} alt={product.title} />
          </div>

          {/* Product Information */}
          <ProductInfo product={product} />
        </div>
      </div>
    </main>
  )
}
