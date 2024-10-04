import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (user?.role === "ADMIN") {
    return NextResponse.json({ isAdmin: true });
  } else {
    return NextResponse.json({ isAdmin: false }, { status: 403 });
  }
}
