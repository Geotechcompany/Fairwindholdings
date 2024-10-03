import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const deposits = await prisma.deposit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit to last 10 deposits
    });

    return NextResponse.json(deposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}