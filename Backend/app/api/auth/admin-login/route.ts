import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
	const { userId } = auth();

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const user = await prisma.user.findUnique({
			where: { clerkId: userId },
			select: { role: true },
		});

		if (!user || user.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Admin login error:', error);
		return NextResponse.json({ error: 'An error occurred during admin login' }, { status: 500 });
	}
}