import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const activeTrades = await prisma.trade.findMany({
      where: { 
        userId: user.id,
        status: 'OPEN'
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(activeTrades);
  } catch (error) {
    console.error("Error fetching active trades:", error);
    return NextResponse.json(
      { error: "Failed to fetch active trades" },
      { status: 500 }
    );
  }
}