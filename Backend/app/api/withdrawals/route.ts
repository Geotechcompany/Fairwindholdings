import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session/route";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(withdrawals);
  } catch (error) {
    console.error("Failed to fetch withdrawals:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      amount,
      currency,
      accountNumber,
      accountHolderName,
      iban,
      swiftCode,
    } = body;

    // Validate input
    if (!amount || !currency || !accountNumber || !accountHolderName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new withdrawal request
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: currentUser.id,
        amount: parseFloat(amount),
        currency,
        accountNumber,
        accountHolderName,
        iban,
        swiftCode,
        status: "PENDING",
      },
    });

    return NextResponse.json(withdrawal);
  } catch (error) {
    console.error("Failed to create withdrawal request:", error);
    return NextResponse.json(
      { error: "Failed to create withdrawal request" },
      { status: 500 }
    );
  }
}
