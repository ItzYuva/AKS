import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch('https://zenquotes.io/api/random', {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error('API error');

    const data = await res.json();
    const q = data[0];

    if (q?.q && q?.a) {
      return NextResponse.json({ text: q.q, author: q.a });
    }

    throw new Error('Bad response');
  } catch {
    return NextResponse.json({
      text: 'Talk is cheap. Show me the code.',
      author: 'Linus Torvalds',
    });
  }
}
