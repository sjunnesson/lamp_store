#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

// Map NEXT_PUBLIC_ variables to SANITY_STUDIO_ for Studio compatibility
if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && !process.env.SANITY_STUDIO_PROJECT_ID) {
  process.env.SANITY_STUDIO_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
}
if (process.env.NEXT_PUBLIC_SANITY_DATASET && !process.env.SANITY_STUDIO_DATASET) {
  process.env.SANITY_STUDIO_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
}
if (process.env.NEXT_PUBLIC_SANITY_API_VERSION && !process.env.SANITY_STUDIO_API_VERSION) {
  process.env.SANITY_STUDIO_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION
}

// Now run the sanity build
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const studioDistPath = path.join(process.cwd(), 'studio-dist')

// Delete existing directory if it exists
if (fs.existsSync(studioDistPath)) {
  console.log('Cleaning existing studio-dist directory...')
  fs.rmSync(studioDistPath, { recursive: true, force: true })
}

// Run sanity build (auto-answer Y to delete prompt)
console.log('Building Sanity Studio...')
execSync('echo "Y" | npx sanity build studio-dist', { 
  stdio: 'inherit',
  env: { ...process.env }
})

console.log('Studio build complete!')
