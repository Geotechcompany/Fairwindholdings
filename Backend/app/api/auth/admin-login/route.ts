import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const token = sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json({ error: 'An error occurred during sign-in' }, { status: 500 });
  }
}