import { NextResponse } from 'next/server';
import { getLastPlayed } from '@/lib/spotify';

export const revalidate = 120;

export async function GET() {
  const track = await getLastPlayed();

  if (!track) {
    return NextResponse.json({ playing: false }, { status: 200 });
  }

  return NextResponse.json({ playing: true, track });
}
