// app/api/kyc/index.ts

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const kycRequests = await prisma.kYCDocument.findMany({
      include: { user: true },
    });
    return res.status(200).json(kycRequests);
  }

  res.status(405).json({ error: "Method not allowed" });
}

// Similar structure for deposits and withdrawals API routes
