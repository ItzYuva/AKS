import { NextRequest } from 'next/server'
import { put } from '@vercel/blob'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
    }

    // Store as a real file on Vercel Blob (served from a CDN), not base64 in MongoDB.
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return Response.json({ url: blob.url })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
