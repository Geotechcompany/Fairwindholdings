import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const isAdmin = user.publicMetadata.role === 'admin';

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, action } = params;

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: { status: action === 'approve' ? 'Approved' : 'Rejected' },
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error(`Error ${params.action}ing document:`, error);
    return NextResponse.json({ error: `Failed to ${params.action} document` }, { status: 500 });
  }
}