import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

function bigIntToNumber(value: bigint | number | null): number {
  if (typeof value === "bigint") {
    return Number(value);
  }
  return value || 0;
}

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.publicMetadata.role === "admin";

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalUsers = await prisma.user.count();
    const totalTrades = await prisma.trade.count();
    const activeUsers = await prisma.user.count({
      where: {
        trades: {
          some: {
            status: "OPEN",
          },
        },
      },
    });
    const totalVolume = await prisma.trade.aggregate({
      _sum: {
        units: true,
      },
    });
    const revenue = await prisma.trade.aggregate({
      _sum: {
        closePrice: true,
        openPrice: true,
      },
    });

    // Calculate profit/loss
    const profitLoss =
      bigIntToNumber(revenue._sum.closePrice) -
      bigIntToNumber(revenue._sum.openPrice);

    // Get monthly data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(DISTINCT "userId") as "userGrowth",
        SUM("units") as "tradeVolume"
      FROM "Trade"
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;

    const formattedMonthlyData = monthlyData.map((item: any) => ({
      month: item.month.toISOString().slice(0, 7), // Format as YYYY-MM
      userGrowth: bigIntToNumber(item.userGrowth),
      tradeVolume: bigIntToNumber(item.tradeVolume),
    }));

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalTrades,
      totalVolume: bigIntToNumber(totalVolume._sum.units),
      revenue: profitLoss,
      monthlyData: formattedMonthlyData,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
