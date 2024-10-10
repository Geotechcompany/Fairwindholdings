import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { placeTrade } from "@/lib/oandaClient/route";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userIdentifier, identifierType, instrument, units, type } =
      req.body;

    // Find the user based on the identifier
    let user;
    if (identifierType === "id") {
      user = await prisma.user.findUnique({ where: { id: userIdentifier } });
    } else if (identifierType === "email") {
      user = await prisma.user.findUnique({ where: { email: userIdentifier } });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Place the trade using the OANDA API
    const oandaTrade = await placeTrade(instrument, units, type);

    // Create a record of the trade in your database
    const trade = await prisma.trade.create({
      data: {
        userId: user.id,
        instrument,
        units: parseFloat(units),
        type,
        openPrice: parseFloat(oandaTrade.orderFillTransaction.price),
        tradeId: oandaTrade.orderFillTransaction.id,
        status: "OPEN",
      },
    });

    res.status(200).json(trade);
  } catch (error) {
    console.error("Error creating trade:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the trade" });
  }
}
