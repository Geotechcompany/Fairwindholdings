import { NextResponse } from 'next/server';
import { placeTrade } from '@/lib/oandaClient/route';

export async function POST(request: Request) {
  try {
    const { instrument, units, type } = await request.json();
    const trade = await placeTrade(instrument, units, type);
    return NextResponse.json(trade);
  } catch (error) {
    console.error('Error placing trade:', error);
    return NextResponse.json({ error: 'Failed to place trade' }, { status: 500 });
  }
}