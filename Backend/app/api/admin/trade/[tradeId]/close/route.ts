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

    // Check if the user is an admin using Clerk's public metadata
    const isAdmin = user.publicMetadata.role === "admin";

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tradeId } = params;

    const closedTrade = await prisma.trade.update({
      where: { id: tradeId },
      data: {
        status: "CLOSED",
        closePrice: 0, // You might want to calculate this based on current market price
        updatedAt: new Date(), // Use updatedAt instead of closedAt
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
