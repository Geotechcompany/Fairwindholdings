import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { ActionResponse } from "@/types/actions";

// Schema for deposit status update
const updateDepositSchema = z.object({
  depositId: z.string(),
  newStatus: z.enum(["APPROVED", "REJECTED"]),
});

// GET handler for fetching deposits
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 404 }
      );
    }

    const deposits = await prisma.deposit.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
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

// PATCH handler using next-safe-action
export async function PATCH(request: Request, { params }: { params: { depositId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { depositId, newStatus } = updateDepositSchema.parse(body);

    const updatedDeposit = await prisma.deposit.update({
      where: { id: depositId },
      data: { status: newStatus },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Deposit ${depositId} status updated to ${newStatus}`,
      data: updatedDeposit
    });
  } catch (error) {
    console.error("Error updating deposit status:", error);
    return NextResponse.json({ success: false, message: "Error updating deposit status" }, { status: 500 });
  }
}
