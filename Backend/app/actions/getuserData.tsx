"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { UserData } from "@/types/user";
import type { Stats } from "@/types/stats";
import type { ActionResponse } from "@/types/actions";

export async function getUserData(): Promise<ActionResponse<UserData & Stats>> {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        stats: true,
        account: true,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const userData: UserData & Stats = {
      balance: user.account.balance,
      leverage: user.account.leverage,
      credit: user.account.credit,
      totalDeposits: user.account.totalDeposits,
      firstName: user.firstName || "",
      fullName: user.fullName || "",
      email: user.email,
      profileImage: user.profileImage || "/images/placeholder-avatar.png",
      pnl: user.stats.pnl,
      profit: user.stats.profit,
      loss: user.stats.loss,
      profitableOrders: user.stats.profitableOrders,
    };

    return { data: userData };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { error: "Failed to fetch user data" };
  }
}
