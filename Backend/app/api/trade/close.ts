import { closeTrade } from "../../../lib/oandaClient/route";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { tradeId } = req.body;
    try {
      const result = await closeTrade(tradeId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to close trade" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
