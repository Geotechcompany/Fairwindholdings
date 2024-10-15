import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { tradeId: string } }
) {
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

    const { tradeId } = params;
    const { closeType } = await request.json();

    const trade = await prisma.trade.findUnique({
      where: { id: tradeId },
    });

    if (!trade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    const closedTrade = await prisma.trade.update({
      where: { id: tradeId },
      data: {
        status: closeType === 'PROFIT' ? "CLOSED_WITH_PROFIT" : "CLOSED_WITH_LOSS",
        closePrice: trade.openPrice, // You might want to calculate this based on current market price
        profitLoss: closeType === 'PROFIT' ? 100 : -100, // Replace with actual profit/loss calculation
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(closedTrade);
  } catch (error) {
    console.error("Error closing trade:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
