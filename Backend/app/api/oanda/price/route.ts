import { NextResponse } from 'next/server';
import { getInstrumentCandles } from '@/lib/oandaClient/route';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const instrument = searchParams.get('instrument');

  if (!instrument) {
    return NextResponse.json({ error: 'Instrument parameter is required' }, { status: 400 });
  }

  try {
    const candlesResponse = await getInstrumentCandles(instrument);
    if (candlesResponse.candles && candlesResponse.candles.length > 0) {
      const latestCandle = candlesResponse.candles[candlesResponse.candles.length - 1];
      const price = latestCandle.mid?.c || latestCandle.ask?.c || latestCandle.bid?.c;
      
      if (price) {
        return NextResponse.json({ price: parseFloat(price) });
      } else {
        throw new Error('No price data available in the latest candle');
      }
    } else {
      throw new Error('No candle data available');
    }
  } catch (error) {
    console.error('Error fetching instrument price:', error);
    return NextResponse.json({ error: 'Failed to fetch instrument price' }, { status: 500 });
  }
}