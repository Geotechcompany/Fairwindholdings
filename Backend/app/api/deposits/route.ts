import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the user by clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // If user not found by clerkId, try to find by email
      const clerkUser = await auth().getUser(userId);
      const email = clerkUser.emailAddresses[0].emailAddress;
      user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Update the user's clerkId
      await prisma.user.update({
        where: { id: user.id },
        data: { clerkId: userId },
      });
    }

    // Fetch the user's deposits
    const deposits = await prisma.deposit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deposits);
  } catch (error) {
    console.error("Error fetching deposits:", error);
    return NextResponse.json(
      { error: "Error fetching deposits" },
      { status: 500 }
    );
  }
}
