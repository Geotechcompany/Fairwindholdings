import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tradePerformance = await prisma.trade.groupBy({
      by: ['status'],
      _count: {
        id: true
      },
      where: {
        status: {
          in: ['CLOSED_WITH_PROFIT', 'CLOSED_WITH_LOSS']
        }
      }
    });

    const totalTrades = tradePerformance.reduce((acc, curr) => acc + curr._count.id, 0);
    const formattedData = tradePerformance.map(item => ({
      status: item.status,
      count: item._count.id,
      percentage: (item._count.id / totalTrades) * 100
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching trade performance:', error);
    return NextResponse.json({ error: 'Failed to fetch trade performance' }, { status: 500 });
  }
}