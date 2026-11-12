import { NextRequest } from 'next/server'
import { put, list, del } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

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

    // Write to public/resume.pdf so it's served at /resume.pdf
    const publicDir = join(process.cwd(), 'public')
    const filePath = join(publicDir, 'resume.pdf')
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // Also upload to Vercel Blob as backup (delete old ones first)
    try {
      const existing = await list({ prefix: RESUME_PREFIX })
      for (const blob of existing.blobs) {
        await del(blob.url)
      }
      await put(`${RESUME_PREFIX}resume.pdf`, file, {
        access: 'public',
        addRandomSuffix: false,
      })
    } catch {
      // Blob storage is optional — local file is the primary
    }

    return Response.json({ success: true, message: 'Resume uploaded successfully' })
  } catch (error) {
    console.error('Resume upload error:', error)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const fs = await import('fs')
    const filePath = join(process.cwd(), 'public', 'resume.pdf')
    const exists = fs.existsSync(filePath)
    return Response.json({ exists })
  } catch {
    return Response.json({ exists: false })
  }
}
