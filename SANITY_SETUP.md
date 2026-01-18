# Sanity Setup Guide

Your Sanity integration is now configured! Follow these steps to get started:

## 1. Create a Sanity Project

If you haven't already, create a new project at [sanity.io](https://www.sanity.io/manage):

1. Go to https://www.sanity.io/manage
2. Click "Create project"
3. Choose a project name and dataset name (default is "production")

## 2. Set Up Environment Variables

Create a `.env.local` file in the root of your project with the following:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-17
```

Replace `your_project_id_here` with your actual Sanity project ID (you can find it in your Sanity project settings).

## 3. Start the Development Server

```bash
npm run dev
```

## 4. Access Sanity Studio

Once your dev server is running, visit:
- **Sanity Studio**: http://localhost:3000/studio

This is where you'll manage your content. You can:
- Create and edit products
- Upload images
- Manage your content schema

## 5. Test the Integration

Visit the test page to verify everything is working:
- **Test Page**: http://localhost:3000/test-sanity

Or run the test script:
```bash
npm run test:sanity
```

## 6. Create Your First Product

1. Go to http://localhost:3000/studio
2. Click "Create new" → "Product"
3. Fill in the required fields:
   - Title
   - Slug (auto-generated from title)
   - Price
   - Stripe Price ID
   - Image Off (default state)
   - Image On (lit state)
4. Click "Publish"

## Available Scripts

- `npm run dev` - Start Next.js dev server
- `npm run test:sanity` - Test Sanity connection and fetch products
- `npm run build` - Build for production

## Project Structure

- `sanity/schemaTypes/` - Your content schemas (currently has `product.ts`)
- `sanity/config.ts` - Sanity Studio configuration
- `lib/sanity.ts` - Sanity client and helper functions
- `app/studio/` - Sanity Studio route

## Next Steps

- Add more schema types as needed
- Customize the Studio structure in `sanity/structure.ts`
- Use the `getProducts()` function from `lib/sanity.ts` in your pages
