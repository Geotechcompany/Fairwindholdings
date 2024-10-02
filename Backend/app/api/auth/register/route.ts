import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      email,
      phone,
      firstName,
      lastName,
      password,
      country,
      promocode,
      currency,
    } = await req.json();

    console.log(`Attempting to register user: ${email}`);

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        phoneNumber: phone,
        firstName,
        lastName,
        password: hashedPassword,
        country,
        promocode,
        currency,
      },
    });

    console.log(`User registered successfully: ${user.id}`);

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
