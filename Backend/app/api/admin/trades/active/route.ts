import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    const activeTrades = await prisma.trade.findMany({
      where: {
        status: "OPEN",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
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
