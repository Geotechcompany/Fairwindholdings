import { getOpenTrades, getPricing } from "@/lib/oandaClient/route";

const oandaTrades = await getOpenTrades();
const instruments = [
  ...new Set(oandaTrades.trades.map((trade) => trade.instrument)),
];
const pricing = await getPricing(instruments);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const trades = await getOpenTrades();
      res.status(200).json(trades);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch open trades" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
