import { NextRequest } from 'next/server'
import { put, list, del } from '@vercel/blob'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const RESUME_PREFIX = 'resume/'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return Response.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
    }

    const existing = await list({ prefix: RESUME_PREFIX })
    for (const blob of existing.blobs) {
      await del(blob.url)
    }

    const blob = await put(`${RESUME_PREFIX}resume.pdf`, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    return Response.json({ success: true, url: blob.url })
  } catch (error) {
    console.error('Resume upload error:', error)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const existing = await list({ prefix: RESUME_PREFIX })
    if (existing.blobs.length > 0) {
      return Response.json({ exists: true, url: existing.blobs[0].url })
    }
    return Response.json({ exists: false })
  } catch {
    return Response.json({ exists: false })
  }
}
