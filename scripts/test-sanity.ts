/**
 * Test script to verify Sanity integration
 * Run with: npx tsx scripts/test-sanity.ts
 * Or: ts-node scripts/test-sanity.ts
 */

import { getProducts, client } from '../lib/sanity'

async function testSanityIntegration() {
  console.log('🧪 Testing Sanity Integration...\n')

  // Check environment variables
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

  console.log('📋 Configuration:')
  console.log(`   Project ID: ${projectId || '❌ NOT SET'}`)
  console.log(`   Dataset: ${dataset}`)
  console.log(`   API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-17'}\n`)

  if (!projectId) {
    console.error('❌ ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID is not set!')
    console.log('\n💡 Create a .env.local file with:')
    console.log('   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id')
    console.log('   NEXT_PUBLIC_SANITY_DATASET=production')
    process.exit(1)
  }

  try {
    // Test 1: Check client connection
    console.log('1️⃣ Testing client connection...')
    const testQuery = '*[_type == "product"] | order(_createdAt desc) [0..0]'
    await client.fetch(testQuery)
    console.log('   ✓ Client connection successful\n')

    // Test 2: Fetch products
    console.log('2️⃣ Fetching products...')
    const products = await getProducts()
    console.log(`   ✓ Found ${products.length} product(s)\n`)

    // Test 3: Validate product structure
    if (products.length > 0) {
      console.log('3️⃣ Validating product structure...')
      const product = products[0]
      const requiredFields = ['_id', 'title', 'slug', 'price', 'stripePriceId', 'imageOffUrl', 'imageOnUrl']
      const missingFields = requiredFields.filter(field => !(field in product))
      
      if (missingFields.length === 0) {
        console.log('   ✓ Product structure is valid\n')
      } else {
        console.log(`   ⚠️  Missing fields: ${missingFields.join(', ')}\n`)
      }

      // Test 4: Display first product details
      console.log('4️⃣ Sample product data:')
      console.log(`   Title: ${product.title}`)
      console.log(`   Slug: ${product.slug.current}`)
      console.log(`   Price: $${product.price}`)
      console.log(`   Stripe Price ID: ${product.stripePriceId}`)
      console.log(`   Image Off URL: ${product.imageOffUrl ? '✓ Set' : '❌ Missing'}`)
      console.log(`   Image On URL: ${product.imageOnUrl ? '✓ Set' : '❌ Missing'}\n`)
    } else {
      console.log('   ℹ️  No products found in dataset\n')
      console.log('💡 Tip: Create products in your Sanity Studio to test the full integration\n')
    }

    console.log('✅ All tests passed! Sanity integration is working correctly.\n')
  } catch (error) {
    console.error('❌ Test failed!\n')
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    } else {
      console.error('Unknown error:', error)
    }
    process.exit(1)
  }
}

// Run the test
testSanityIntegration().catch(console.error)
