/**
 * Seed script to create 5 dummy products in Sanity
 * Run with: npm run seed:products
 * Or: tsx scripts/seed-products.ts
 * 
 * This script will:
 * 1. Upload placeholder images to Sanity
 * 2. Create 5 products with those images
 * 3. You can replace the placeholder images later in Sanity Studio
 * 
 * Requirements:
 * - NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 * - SANITY_API_TOKEN in .env.local (with write permissions)
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-17';
const token = process.env.SANITY_API_TOKEN; // Required for write access

if (!projectId) {
  console.error('❌ ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID is not set!');
  console.log('\n💡 Make sure you have a .env.local file with:');
  console.log('   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id');
  console.log('   NEXT_PUBLIC_SANITY_DATASET=production');
  console.log('   SANITY_API_TOKEN=your_token (required for write access)');
  console.log('\n   Get your token from: https://www.sanity.io/manage/personal/api');
  process.exit(1);
}

if (!token) {
  console.error('❌ ERROR: SANITY_API_TOKEN is not set!');
  console.log('\n💡 You need a token with write access to create products.');
  console.log('   Get your token from: https://www.sanity.io/manage/personal/api');
  console.log('   Add it to .env.local as: SANITY_API_TOKEN=your_token');
  console.log('\n   Alternatively, create products manually in Sanity Studio at /studio');
  process.exit(1);
}

// Create client with write access
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token, // Token is required for write operations
});

// Helper function to upload a simple placeholder image to Sanity
async function uploadPlaceholderImage(filename: string): Promise<string> {
  try {
    // Create a minimal 1x1 PNG as placeholder
    const buffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType: 'image/png',
    });
    
    return asset._id;
  } catch (error) {
    console.error(`   ⚠️  Failed to upload placeholder image:`, error instanceof Error ? error.message : error);
    throw error;
  }
}

// Dummy products data
// Note: Images will be created as minimal placeholders
// You can replace them with actual product images in Sanity Studio
const dummyProducts = [
  {
    _type: 'product',
    title: 'Vintage Brass Table Lamp',
    slug: {
      _type: 'slug',
      current: 'vintage-brass-table-lamp',
    },
    price: 89.99,
    stripePriceId: 'price_dummy_001',
  },
  {
    _type: 'product',
    title: 'Modern Minimalist Floor Lamp',
    slug: {
      _type: 'slug',
      current: 'modern-minimalist-floor-lamp',
    },
    price: 149.99,
    stripePriceId: 'price_dummy_002',
  },
  {
    _type: 'product',
    title: 'Art Deco Pendant Light',
    slug: {
      _type: 'slug',
      current: 'art-deco-pendant-light',
    },
    price: 199.99,
    stripePriceId: 'price_dummy_003',
  },
  {
    _type: 'product',
    title: 'Industrial Wall Sconce',
    slug: {
      _type: 'slug',
      current: 'industrial-wall-sconce',
    },
    price: 79.99,
    stripePriceId: 'price_dummy_004',
  },
  {
    _type: 'product',
    title: 'Crystal Chandelier',
    slug: {
      _type: 'slug',
      current: 'crystal-chandelier',
    },
    price: 349.99,
    stripePriceId: 'price_dummy_005',
  },
];

async function seedProducts() {
  console.log('🌱 Starting product seeding...\n');
  console.log(`📋 Configuration:`);
  console.log(`   Project ID: ${projectId}`);
  console.log(`   Dataset: ${dataset}`);
  console.log(`   API Version: ${apiVersion}\n`);

  try {
    // Check existing products
    const existingProducts = await client.fetch('*[_type == "product"]');
    console.log(`📦 Found ${existingProducts.length} existing product(s)\n`);

    if (existingProducts.length > 0) {
      console.log('⚠️  Products already exist. This script will create additional products.');
      console.log('   To avoid duplicates, you may want to delete existing products first.\n');
    }

    // Create products
    console.log('🔄 Creating products...\n');
    const createdProducts = [];
    const skippedProducts = [];

    for (const productData of dummyProducts) {
      try {
        // Check if product with this slug already exists
        const existing = await client.fetch(
          `*[_type == "product" && slug.current == $slug][0]`,
          { slug: productData.slug.current }
        );

        if (existing) {
          console.log(`   ⏭️  Skipping "${productData.title}" - already exists`);
          skippedProducts.push(productData.title);
          continue;
        }

        console.log(`   📤 Creating placeholder images for "${productData.title}"...`);
        
        // Upload placeholder images (minimal 1x1 PNGs)
        const imageOffId = await uploadPlaceholderImage(
          `${productData.slug.current}-off.png`
        );
        const imageOnId = await uploadPlaceholderImage(
          `${productData.slug.current}-on.png`
        );

        // Create product with images
        const product = {
          _type: productData._type,
          title: productData.title,
          slug: productData.slug,
          price: productData.price,
          stripePriceId: productData.stripePriceId,
          imageOff: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageOffId,
            },
          },
          imageOn: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageOnId,
            },
          },
        };

        const created = await client.create(product);
        createdProducts.push(created);
        console.log(`   ✅ Created: ${productData.title} ($${productData.price})`);
      } catch (error) {
        console.error(`   ❌ Failed to create "${productData.title}":`, error instanceof Error ? error.message : error);
      }
    }

    console.log(`\n✨ Seeding complete!`);
    console.log(`   Created: ${createdProducts.length} product(s)`);
    if (skippedProducts.length > 0) {
      console.log(`   Skipped: ${skippedProducts.length} product(s) (already exist)`);
    }

    if (createdProducts.length > 0) {
      console.log('\n💡 Tip: You can replace the placeholder images using the Sanity API or Sanity Management UI:');
      console.log('   Visit https://www.sanity.io/manage to manage your content\n');
    }

  } catch (error) {
    console.error('❌ Seeding failed!\n');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      if (error.message.includes('token') || error.message.includes('unauthorized')) {
        console.error('\n💡 Make sure your SANITY_API_TOKEN has write permissions.');
        console.error('   Get your token from: https://www.sanity.io/manage/personal/api');
      } else if (error.message.includes('required')) {
        console.error('\n💡 The product schema requires images.');
        console.error('   You may need to temporarily make images optional in the schema,');
        console.error('   or upload images first using Sanity\'s asset API.');
      }
    } else {
      console.error('Unknown error:', error);
    }
    process.exit(1);
  }
}

// Run the seeding
seedProducts().catch(console.error);
