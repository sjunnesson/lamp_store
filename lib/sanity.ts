import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

// Sanity client configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production').trim();
const apiVersion = (process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-17').trim();

// Validate required environment variables
if (!projectId) {
  throw new Error(
    'Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID\n' +
    'Please create a .env.local file with your Sanity project ID.\n' +
    'Get your project ID from https://www.sanity.io/manage'
  );
}

// Validate project ID format (only a-z, 0-9, and dashes)
if (!/^[a-z0-9-]+$/.test(projectId)) {
  throw new Error(
    `Invalid Sanity project ID format: "${projectId}". Project ID can only contain lowercase letters, numbers, and dashes.`
  );
}

// Create client instance
export const client = createClient({
  projectId,
  dataset,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion,
});

// Image URL builder
const builder = createImageUrlBuilder(client);

// Helper function to build image URLs
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Product type definition
export interface Product {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  price: number;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  stripePriceId: string;
  imageOff: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  imageOn: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  imageOffUrl?: string;
  imageOnUrl?: string;
}

// Fetch all products with image URLs mapped correctly
export async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product"] {
    _id,
    title,
    slug,
    description,
    price,
    dimensions,
    stripePriceId,
    imageOff,
    imageOn
  }`;

  const products = await client.fetch<Product[]>(query);

  // Map image URLs with optimization settings
  return products.map((product) => ({
    ...product,
    imageOffUrl: product.imageOff
      ? urlFor(product.imageOff)
          .width(800)
          .height(800)
          .auto('format') // Automatically serve WebP/AVIF when supported
          .quality(85) // Good balance between quality and file size
          .url()
      : undefined,
    imageOnUrl: product.imageOn
      ? urlFor(product.imageOn)
          .width(800)
          .height(800)
          .auto('format')
          .quality(85)
          .url()
      : undefined,
  }));
}

// Fetch a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    price,
    dimensions,
    stripePriceId,
    imageOff,
    imageOn
  }`;

  const product = await client.fetch<Product | null>(query, { slug });

  if (!product) return null;

  // Map image URLs with optimization settings
  return {
    ...product,
    imageOffUrl: product.imageOff
      ? urlFor(product.imageOff)
          .width(1200)
          .height(1200)
          .auto('format') // Automatically serve WebP/AVIF when supported
          .quality(90) // Higher quality for detail pages
          .url()
      : undefined,
    imageOnUrl: product.imageOn
      ? urlFor(product.imageOn)
          .width(1200)
          .height(1200)
          .auto('format')
          .quality(90)
          .url()
      : undefined,
  };
}
