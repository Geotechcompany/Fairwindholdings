import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      select: {
        id: true,
        userId: true,
        type: true,
        status: true,
        url: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const formattedDocuments = documents.map((doc) => ({
      id: doc.id,
      userId: doc.userId,
      type: doc.type,
      status: doc.status,
      url: doc.url,
      submissionDate: doc.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedDocuments);
  } catch (error) {
    console.error("Error fetching KYC documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch KYC documents" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "Method not implemented" },
    { status: 501 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not implemented" },
    { status: 501 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not implemented" },
    { status: 501 }
  );
}
