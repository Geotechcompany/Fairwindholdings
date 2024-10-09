import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json({ error: "User email not found" }, { status: 404 });
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    // Check if the user is an admin
    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true }
    });

    if (dbUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deposits = await prisma.deposit.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
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