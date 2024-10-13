import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.publicMetadata.role === "admin";

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { balance, equity, leverage, credit } = await request.json();

    const updatedAccount = await prisma.account.update({
      where: { id: params.id },
      data: { balance, equity, leverage, credit },
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.publicMetadata.role === "admin";

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();

    if (status !== "ACTIVE" && status !== "DISABLED") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedAccount = await prisma.account.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error updating account status:", error);
    return NextResponse.json(
      { error: "Failed to update account status" },
      { status: 500 }
    );
  }
}
