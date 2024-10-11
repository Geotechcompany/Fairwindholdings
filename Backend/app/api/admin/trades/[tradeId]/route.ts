import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
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

export async function PUT(
  request: Request,
  { params }: { params: { tradeId: string } }
) {
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

    const { tradeId } = params;

    const body = await request.json();
    const { instrument, type, units, openPrice, closePrice, profitLoss } = body;

    const updatedTrade = await prisma.trade.update({
      where: { id: tradeId },
      data: {
        instrument,
        type,
        units: parseFloat(units),
        openPrice: parseFloat(openPrice),
        closePrice: closePrice ? parseFloat(closePrice) : null,
        profitLoss: profitLoss ? parseFloat(profitLoss) : null,
        status: closePrice ? "CLOSED" : "OPEN",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedTrade);
  } catch (error) {
    console.error("Error updating trade:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
