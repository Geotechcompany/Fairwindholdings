import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
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
          where: { clerkId: conv.userId },
          select: { firstName: true, lastName: true },
        });

        const unreadCount = await prisma.chatMessage.count({
          where: {
            userId: conv.userId,
            isAdmin: true,
            isRead: false,
          },
        });

        return {
          id: conv.userId,
          name: `${userDetails?.firstName || "Support"} ${
            userDetails?.lastName || "Team"
          }`,
          lastMessage: conv._max.content || "",
          unreadCount,
          timestamp:
            conv._max.createdAt?.toISOString() || new Date().toISOString(),
        };
      })
    );

    console.log("API: Formatted conversations:", formattedConversations);
    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Error fetching conversations" },
      { status: 500 }
    );
  }
}
