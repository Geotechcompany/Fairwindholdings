import { placeTrade } from "@/lib/oandaClient/route";
import { prisma } from "@/lib/prisma";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { instrument, units, type } = req.body;
    try {
      const oandaTrade = await placeTrade(instrument, units, type);
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
      res.status(500).json({ error: "Failed to place trade" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
