import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export async function getCurrentUser() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const currentUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!currentUser) {
    return null;
  }

  return currentUser;
}

export async function setUserRole(userId: string, role: string) {
  await clerkClient.users.updateUser(userId, {
    publicMetadata: { role },
  });
}
