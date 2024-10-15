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

    // Removed the admin role check

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

export async function PATCH(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user || user.publicMetadata.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedDeposit = await prisma.deposit.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedDeposit);
  } catch (error) {
    console.error("Error updating deposit status:", error);
    return NextResponse.json(
      { error: "Error updating deposit status" },
      { status: 500 }
    );
  }
}
