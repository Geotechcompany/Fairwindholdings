import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        accountNumber: true,
        accountHolderName: true,
        iban: true,
        swiftCode: true,
        bank: true,
      },
    });

    return NextResponse.json(withdrawals);
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      amount,
      accountNumber,
      accountHolderName,
      iban,
      swiftCode,
      bank,
      email,
    } = body;

    // Validate input
    if (!amount || !accountNumber || !accountHolderName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the user in your database using clerkId or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          { email: email }
        ]
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Create new withdrawal request
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: user.id,
        email: user.email, // Use the email from the found user
        amount: parseFloat(amount),
        bank,
        currency: "AUD",
        accountNumber,
        accountHolderName,
        iban,
        swiftCode,
        status: "PENDING",
      },
    });

    return NextResponse.json(withdrawal);
  } catch (error) {
    console.error("Error creating withdrawal request:", error);
    return NextResponse.json(
      { error: "Failed to create withdrawal request" },
      { status: 500 }
    );
  }
}