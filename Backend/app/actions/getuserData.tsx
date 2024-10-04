"use server";

import { prisma } from "@/lib/prisma";
import type { UserData } from "@/types/user";
import type { Stats } from "@/types/stats";
import type { ActionResponse } from "@/types/actions";

export async function getUserData(
  email: string
): Promise<ActionResponse<UserData & Stats>> {
  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        stats: true,
        mainAccount: true,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const userData: UserData & Stats = {
      balance: user.mainAccount?.balance ?? 0,
      leverage: user.mainAccount?.leverage ?? "1:100",
      credit: user.mainAccount?.credit ?? 0,
      totalDeposits: user.mainAccount?.totalDeposits ?? 0,
      firstName: user.firstName || "",
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      profileImage: user.profileImage || "/images/placeholder-avatar.png",
      pnl: user.stats?.pnl ?? 0,
      profit: user.stats?.profit ?? 0,
      loss: user.stats?.loss ?? 0,
      profitableOrders: user.stats?.profitableOrders ?? "0/0",
    };

    return { data: userData };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { error: "Failed to fetch user data" };
  }
}
