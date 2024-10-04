import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      phone,
      country,
      promocode,
      currency,
    } = await req.json();

    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        phoneNumber: phone,
        country,
        promocode,
        currency,
      },
    });

    console.log(`User data updated successfully: ${user.id}`);

    return NextResponse.json(
      { message: "User data updated successfully", userId: user.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("User data update error:", error);
    return NextResponse.json(
      { error: "An error occurred during user data update" },
      { status: 500 }
    );
  }
}
