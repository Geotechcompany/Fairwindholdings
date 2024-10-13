import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.chatMessage.groupBy({
      by: ["userId"],
      _max: {
        createdAt: true,
        content: true,
      },
      orderBy: {
        _max: {
          createdAt: "desc",
        },
      },
    });

    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const userDetails = await prisma.user.findUnique({
          where: { id: conv.userId },
          select: { firstName: true, lastName: true },
        });

        return {
          userId: conv.userId,
          firstName: userDetails?.firstName || "Unknown",
          lastName: userDetails?.lastName || "User",
          profileImageUrl: `/api/avatar/${conv.userId}`, // We'll create this API route later
          lastMessage: conv._max.content,
          timestamp: conv._max.createdAt,
          unread: false, // You'll need to implement unread logic
        };
      })
    );

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Error fetching conversations" },
      { status: 500 }
    );
  }
}
