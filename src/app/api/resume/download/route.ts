import { list } from '@vercel/blob'

const RESUME_PREFIX = 'resume/'

export async function GET() {
  try {
    const existing = await list({ prefix: RESUME_PREFIX })
    if (existing.blobs.length > 0) {
      return Response.redirect(existing.blobs[0].url)
    }
    return new Response('Resume not found', { status: 404 })
  } catch {
    return new Response('Resume not found', { status: 404 })
  }
}
