import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log(`Attempting to log in user: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user || !(await compare(password, user.password))) {
      console.log(`Login failed for user: ${email}`);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    console.log(`User logged in successfully: ${user.id}`);

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      redirectUrl: user.role === "ADMIN" ? "/admin/dashboard" : "/trading-dashboard"
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}