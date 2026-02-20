import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import About from '@/models/About'

// GET about info (single document)
export async function GET() {
  try {
    await connectDB()
    const about = await About.findOne()
    return NextResponse.json(about)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch about info' }, { status: 500 })
  }
}

// PUT update about info
export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const about = await About.findOneAndUpdate({}, body, { new: true, upsert: true })
    return NextResponse.json(about)
  } catch {
    return NextResponse.json({ error: 'Failed to update about info' }, { status: 500 })
  }
}
