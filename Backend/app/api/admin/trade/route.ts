import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      userIdentifier,
      identifierType,
      instrument,
      units,
      type,
      openPrice,
      status,
    } = await request.json();

    // Find the user based on the identifier
    const user = await prisma.user.findUnique({
      where:
        identifierType === "id"
          ? { id: userIdentifier }
          : { email: userIdentifier },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the trade
    const trade = await prisma.trade.create({
      data: {
        userId: user.id,
        instrument,
        units: parseFloat(units),
        type,
        openPrice: parseFloat(openPrice),
        status,
      },
    });

    return NextResponse.json({ trade });
  } catch (error) {
    console.error("Error creating trade:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
