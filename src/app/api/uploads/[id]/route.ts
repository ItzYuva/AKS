import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Upload from '@/models/Upload'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await connectDB()
    const upload = await Upload.findById(id).lean()

    if (!upload) {
      return new Response('Not found', { status: 404 })
    }

    const buffer = Buffer.from(upload.data, 'base64')

    return new Response(buffer, {
      headers: {
        'Content-Type': upload.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
