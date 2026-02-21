import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Contact from '@/models/Contact'

export const dynamic = 'force-dynamic';

// GET contact info (single document)
export async function GET() {
  try {
    await connectDB()
    const contact = await Contact.findOne()
    return NextResponse.json(contact)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contact info' }, { status: 500 })
  }
}

// PUT update contact info
export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const contact = await Contact.findOneAndUpdate({}, body, { new: true, upsert: true })
    return NextResponse.json(contact)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 })
  }
}