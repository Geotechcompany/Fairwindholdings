import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId },
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

    // Get the user's email from Clerk using clerkClient
    const clerkUser = await clerkClient.users.getUser(userId);
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 404 });
    }

    // Find the user in your database using the email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    const body = await request.json();
    const {
      amount,
      accountNumber,
      accountHolderName,
      iban,
      swiftCode,
      bank,
    } = body;

    // Validate input
    if (!amount || !accountNumber || !accountHolderName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new withdrawal request
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: user.id, // Use the database user ID
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
    console.error("Failed to create withdrawal request:", error);
    return NextResponse.json(
      { error: "Failed to create withdrawal request" },
      { status: 500 }
    );
  }
}