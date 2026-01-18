import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

// Sanity client configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-17';

// Validate required environment variables
if (!projectId) {
  throw new Error(
    'Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID\n' +
    'Please create a .env.local file with your Sanity project ID.\n' +
    'Get your project ID from https://www.sanity.io/manage'
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

  // Map image URLs correctly
  return products.map((product) => ({
    ...product,
    imageOffUrl: product.imageOff
      ? urlFor(product.imageOff).width(800).height(800).url()
      : undefined,
    imageOnUrl: product.imageOn
      ? urlFor(product.imageOn).width(800).height(800).url()
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

  // Map image URLs correctly
  return {
    ...product,
    imageOffUrl: product.imageOff
      ? urlFor(product.imageOff).width(1200).height(1200).url()
      : undefined,
    imageOnUrl: product.imageOn
      ? urlFor(product.imageOn).width(1200).height(1200).url()
      : undefined,
  };
}
