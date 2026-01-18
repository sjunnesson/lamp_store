import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const STUDIO_DIST_PATH = join(process.cwd(), 'studio-dist')

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
}

function getMimeType(filePath: string): string {
  const ext = filePath.substring(filePath.lastIndexOf('.'))
  return MIME_TYPES[ext] || 'application/octet-stream'
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    const resolvedParams = await params
    const pathSegments = resolvedParams.path || []
    const requestedPath = pathSegments.join('/')
    
    // If no path or root, serve index.html
    if (!requestedPath || requestedPath === '') {
      const indexPath = join(STUDIO_DIST_PATH, 'index.html')
      if (existsSync(indexPath)) {
        const content = await readFile(indexPath, 'utf-8')
        return new NextResponse(content, {
          headers: {
            'Content-Type': 'text/html',
          },
        })
      }
      return new NextResponse('Studio not built. Run: npm run studio:build', {
        status: 404,
      })
    }

    // Try to serve the requested file
    const filePath = join(STUDIO_DIST_PATH, requestedPath)
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(STUDIO_DIST_PATH)) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    if (existsSync(filePath)) {
      const content = await readFile(filePath)
      const mimeType = getMimeType(filePath)
      
      return new NextResponse(content, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // For SPA routing, fall back to index.html for non-file requests
    // This handles client-side routing
    const indexPath = join(STUDIO_DIST_PATH, 'index.html')
    if (existsSync(indexPath)) {
      const content = await readFile(indexPath, 'utf-8')
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }

    return new NextResponse('Not Found', { status: 404 })
  } catch (error) {
    console.error('Error serving Studio file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
