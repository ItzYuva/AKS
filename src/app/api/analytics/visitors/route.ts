import connectDB from '@/lib/mongodb'
import PageView from '@/models/PageView'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()
    const ids: string[] = await PageView.distinct('sessionId', {
      sessionId: { $ne: '' },
    })
    return Response.json({ count: ids.length })
  } catch {
    return Response.json({ count: 0 })
  }
}
