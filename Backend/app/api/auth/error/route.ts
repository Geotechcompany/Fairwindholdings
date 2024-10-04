import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
}