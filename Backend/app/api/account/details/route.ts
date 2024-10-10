import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        mainAccount: true,
        stats: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.mainAccount) {
      // Create an account if it doesn't exist
      const account = await prisma.account.create({
        data: {
          userId: user.id,
          mainUserId: user.id,
          balance: 0,
          leverage: "1:100",
          credit: 0,
          totalDeposits: 0,
        },
      });
      
      // Instead of reassigning user, we'll create a new object with the updated data
      const updatedUser = {
        ...user,
        mainAccount: account
      };

      return NextResponse.json({
        id: account.id,
        balance: account.balance,
        credit: account.credit,
        totalDeposits: account.totalDeposits,
        pnl: updatedUser.stats?.pnl || 0,
      });
    }

    return NextResponse.json({
      id: user.mainAccount.id,
      balance: user.mainAccount.balance,
      credit: user.mainAccount.credit,
      totalDeposits: user.mainAccount.totalDeposits,
      pnl: user.stats?.pnl || 0,
    });
  } catch (error) {
    console.error("Error fetching account details:", error);
    return NextResponse.json({ error: "Failed to fetch account details" }, { status: 500 });
  }
}