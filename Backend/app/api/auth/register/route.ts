import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    console.log(`Attempting to create additional data for user: ${userId}`);

    const userData = await prisma.userProfile.create({
      data: {
        userId,
        phoneNumber: phone,
        country,
        promocode,
        currency,
      },
    });

    console.log(`User data created successfully: ${userData.id}`);

    return NextResponse.json(
      { message: "User data created successfully", userDataId: userData.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("User data creation error:", error);
    return NextResponse.json(
      { error: "An error occurred during user data creation" },
      { status: 500 }
    );
  }
}
