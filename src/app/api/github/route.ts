import { NextResponse } from 'next/server';
import { getGitHubActivity } from '@/lib/github';

export async function GET() {
  const data = await getGitHubActivity();
  if (data.error) {
    return NextResponse.json({ error: data.error }, { status: 500 });
  }
  return NextResponse.json(data);
}
