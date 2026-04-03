import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import ChatLog from '@/models/ChatLog'
import { hashIp } from '@/lib/hashIp'

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0].trim() || 'unknown'
    const hashedIp = hashIp(ip)

    const body = await req.json()
    const { question, sessionId } = body

    if (!question || typeof question !== 'string') {
      return Response.json({ error: 'Question is required' }, { status: 400 })
    }

    await connectDB()

    await ChatLog.create({
      question,
      sessionId: sessionId || '',
      ip: hashedIp,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Chatlog error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
