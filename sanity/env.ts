export const apiVersion =
  (process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-17').trim()

export const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production').trim()

const rawProjectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const projectId = rawProjectId.trim()

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
