import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

// Read environment variables - Sanity Studio uses SANITY_STUDIO_ prefix
// Fall back to NEXT_PUBLIC_ for compatibility with Next.js app
const rawProjectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const rawDataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const rawApiVersion = process.env.SANITY_STUDIO_API_VERSION || process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-17'

// Trim and validate
const projectId = rawProjectId?.trim()
const dataset = rawDataset.trim()
const apiVersion = rawApiVersion.trim()

if (!projectId) {
  throw new Error('Missing required environment variable: SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID')
}

// Validate project ID format (only a-z, 0-9, and dashes)
if (!/^[a-z0-9-]+$/.test(projectId)) {
  throw new Error(
    `Invalid Sanity project ID format: "${projectId}". Project ID can only contain lowercase letters, numbers, and dashes.`
  )
}

if (!dataset) {
  throw new Error('Missing required environment variable: SANITY_STUDIO_DATASET or NEXT_PUBLIC_SANITY_DATASET')
}

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
