# Vercel Deployment Guide for Sanity

## Environment Variables to Configure in Vercel

When deploying to Vercel, you need to configure the following environment variables in your Vercel project settings:

### Required Environment Variables

1. **NEXT_PUBLIC_SANITY_PROJECT_ID**
   - Value: Your Sanity project ID (e.g., `gdilyis4`)
   - Scope: Production, Preview, Development
   - This is a public variable (safe to expose)

2. **NEXT_PUBLIC_SANITY_DATASET**
   - Value: Your dataset name (e.g., `production`)
   - Scope: Production, Preview, Development
   - This is a public variable (safe to expose)

3. **NEXT_PUBLIC_SANITY_API_VERSION**
   - Value: API version (e.g., `2026-01-17`)
   - Scope: Production, Preview, Development
   - This is a public variable (safe to expose)

### Optional Environment Variables (for Studio build)

4. **SANITY_STUDIO_PROJECT_ID** (optional, falls back to NEXT_PUBLIC_SANITY_PROJECT_ID)
   - Value: Same as NEXT_PUBLIC_SANITY_PROJECT_ID
   - Scope: Production, Preview, Development

5. **SANITY_STUDIO_DATASET** (optional, falls back to NEXT_PUBLIC_SANITY_DATASET)
   - Value: Same as NEXT_PUBLIC_SANITY_DATASET
   - Scope: Production, Preview, Development

6. **SANITY_STUDIO_API_VERSION** (optional, falls back to NEXT_PUBLIC_SANITY_API_VERSION)
   - Value: Same as NEXT_PUBLIC_SANITY_API_VERSION
   - Scope: Production, Preview, Development

### Secret Environment Variables (if needed for scripts)

7. **SANITY_API_TOKEN** (only if you use server-side scripts that need write access)
   - Value: Your Sanity API token with write permissions
   - Scope: Production, Preview, Development
   - ⚠️ This is a SECRET - mark as "Sensitive" in Vercel
   - Only needed for scripts like `seed-products.ts`, not for the frontend

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Click **Add New**
   - Enter the variable name
   - Enter the value
   - Select the environments (Production, Preview, Development)
   - Click **Save**

## Important Notes

### Data Availability
✅ **Your products WILL be available on Vercel** because:
- Sanity stores all data in the cloud (not locally)
- Both localhost and Vercel connect to the same Sanity project
- As long as you use the same PROJECT_ID and DATASET, the data is shared

### CORS Configuration
You may need to configure CORS in Sanity to allow your Vercel domain:

1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to **API** → **CORS origins**
4. Add your Vercel domain(s):
   - `https://your-project.vercel.app`
   - `https://your-custom-domain.com` (if applicable)

### Dataset Strategy
- **Current setup**: Using `production` dataset for both localhost and Vercel
- **Alternative**: You could use separate datasets:
  - `development` for localhost
  - `production` for Vercel
  - This requires different environment variables per environment

## Verification Steps

After deploying to Vercel:

1. ✅ Check that your products appear on the deployed site
2. ✅ Verify that images load correctly
3. ✅ Test the Sanity Studio at `/studio` on your Vercel domain
4. ✅ Confirm that new products created in Studio appear on the site

## Troubleshooting

### Products not showing up?
- Check that environment variables are set correctly in Vercel
- Verify the PROJECT_ID and DATASET match your local setup
- Check Vercel build logs for any Sanity connection errors

### Images not loading?
- Verify CORS is configured for your Vercel domain
- Check that image URLs are being generated correctly
- Look for any CDN-related issues in the browser console

### Studio not working?
- Ensure SANITY_STUDIO_* variables are set (or NEXT_PUBLIC_* fallbacks work)
- Check that the Studio build completed successfully
- Verify the `/studio` route is accessible
