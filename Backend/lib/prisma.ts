import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export async function saveFileMetadata(
  docType: string,
  publicId: string,
  secureUrl: string,
  userId: string
) {
  try {
    const result = await prisma.document.create({
      data: {
        type: docType,
        publicId,
        status: "active",
        url: secureUrl,
        userId,
      },
    });
    return result;
  } catch (error) {
    console.error("Error saving file metadata:", error);
    throw error;
  }
}