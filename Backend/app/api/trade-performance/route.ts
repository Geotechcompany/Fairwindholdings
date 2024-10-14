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

    console.log('Raw trade performance data:', tradePerformance);

    const totalTrades = tradePerformance.reduce((acc, curr) => acc + curr._count.id, 0);
    
    const statuses = ['CLOSED_WITH_PROFIT', 'CLOSED_WITH_LOSS'];
    const formattedData = statuses.map(status => {
      const item = tradePerformance.find(t => t.status === status);
      return {
        status,
        count: item ? item._count.id : 0,
        percentage: totalTrades > 0 ? ((item ? item._count.id : 0) / totalTrades) * 100 : 0
      };
    });

    console.log('Formatted trade performance data:', formattedData);

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching trade performance:', error);
    return NextResponse.json({ error: 'Failed to fetch trade performance' }, { status: 500 });
  }
}
