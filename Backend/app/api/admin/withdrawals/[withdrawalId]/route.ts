import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { ActionResponse } from "@/types/actions";

// Schema for withdrawal status update
const updateWithdrawalSchema = z.object({
  withdrawalId: z.string(),
  newStatus: z.enum(["APPROVED", "REJECTED"]),
});

export async function PATCH(request: Request, { params }: { params: { withdrawalId: string } }) {
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
    const { withdrawalId, newStatus } = updateWithdrawalSchema.parse(body);

    const updatedWithdrawal = await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: newStatus },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Withdrawal ${withdrawalId} status updated to ${newStatus}`,
      data: updatedWithdrawal
    });
  } catch (error) {
    console.error("Error updating withdrawal status:", error);
    return NextResponse.json({ success: false, message: "Error updating withdrawal status" }, { status: 500 });
  }
}

