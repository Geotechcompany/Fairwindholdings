import React, { useState, useEffect } from "react";
import { FaCog, FaExpand, FaCamera } from "react-icons/fa";

const TradingInterface = () => {
  const [selectedMarket, setSelectedMarket] = useState("XAU/USD");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tradeVolume, setTradeVolume] = useState<number>(1);
  const [tradeSL, setTradeSL] = useState<number | null>(null);
  const [tradeTP, setTradeTP] = useState<number | null>(null);
  const [marketPrice, setMarketPrice] = useState<number>(0);

  interface Trade {
    id: number;
    symbol: string;
    type: string;
    volume: number;
    openPrice: number;
    openTime: string;
    sl: number | null;
    tp: number | null;
    price: number | null;
    commission: number;
    swap: number;
    pnl: number;
  }

  const [trades, setTrades] = useState<Trade[]>([]);
  const tradeSymbol = "OANDA:XAUUSD"; // Fixed to Gold

  useEffect(() => {
    // Fetching market price from an API
    const fetchMarketPrice = async () => {
      try {
        const response = await fetch(
          "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=YOUR_API_KEY"
        );
        const data = await response.json();
        const price = parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
        setMarketPrice(price);
      } catch (error) {
        console.error("Error fetching market price:", error);
      }
    };

    fetchMarketPrice();
    const intervalId = setInterval(fetchMarketPrice, 5000); // Update price every 5 seconds
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const handlePlaceTrade = () => {
    // Trade validation logic
    if (tradeType === "buy") {
      if (tradeTP !== null && tradeTP <= marketPrice) {
        alert("Take Profit must be greater than the market price for Buy orders.");
        return;
      }
      if (tradeSL !== null && tradeSL >= marketPrice) {
        alert("Stop Loss must be less than the market price for Buy orders.");
        return;
      }
    } else {
      if (tradeTP !== null && tradeTP >= marketPrice) {
        alert("Take Profit must be less than the market price for Sell orders.");
        return;
      }
      if (tradeSL !== null && tradeSL <= marketPrice) {
        alert("Stop Loss must be greater than the market price for Sell orders.");
        return;
      }
    }

    const newTrade: Trade = {
      id: trades.length + 1,
      symbol: tradeSymbol,
      type: tradeType,
      volume: tradeVolume,
      openPrice: marketPrice,
      openTime: new Date().toLocaleString(),
      sl: tradeSL,
      tp: tradeTP,
      price: null,
      commission: 0,
      swap: 0,
      pnl: 0,
    };

    setTrades([...trades, newTrade]);
    setTradeVolume(1);
    setTradeSL(null);
    setTradeTP(null);
  };

  return (
    <main className="flex-grow flex flex-col">
      <div className="flex items-center space-x-4 p-4">
        <h2 className="text-xl font-semibold">{selectedMarket}</h2>
        <div className="flex space-x-2 ml-auto">
          <FaCog className="text-gray-400" />
          <FaExpand className="text-gray-400" />
          <FaCamera className="text-gray-400" />
        </div>
      </div>
      
      {/* TradingView Chart */}
      <div id="tradingview_chart" className="flex-grow" />

      <div className="p-4">
        <div className="flex space-x-4 mb-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Active Orders</button>
          <button className="bg-[#2c3035] text-white px-4 py-2 rounded">Orders History</button>
        </div>

        {/* Trade Input Form */}
        <div className="flex flex-col space-y-4 mb-4">
          <input
            type="text"
            value={tradeSymbol}
            readOnly
            placeholder="Symbol"
            className="p-2 border rounded bg-gray-200"
          />
          <div className="flex space-x-4">
            <button
              onClick={() => setTradeType("buy")}
              className={`flex-grow px-4 py-2 rounded ${
                tradeType === "buy" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType("sell")}
              className={`flex-grow px-4 py-2 rounded ${
                tradeType === "sell" ? "bg-red-500 text-white" : "bg-gray-300 text-black"
              }`}
            >
              Sell
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <label className="font-semibold">Market Price:</label>
            <span className="font-bold">{marketPrice.toFixed(2)} USD</span>
          </div>
          <input
            type="number"
            value={tradeVolume}
            onChange={(e) => setTradeVolume(Number(e.target.value))}
            placeholder="Volume (Lots)"
            className="p-2 border rounded"
            min="0.01" // Minimum volume (assuming mini lots)
            step="0.01" // Allow two decimal places for lots
          />
          <input
            type="number"
            value={tradeSL || ""}
            onChange={(e) => setTradeSL(e.target.value ? Number(e.target.value) : null)}
            placeholder="Stop Loss"
            className="p-2 border rounded"
          />
          <input
            type="number"
            value={tradeTP || ""}
            onChange={(e) => setTradeTP(e.target.value ? Number(e.target.value) : null)}
            placeholder="Take Profit"
            className="p-2 border rounded"
          />
          <button onClick={handlePlaceTrade} className="bg-blue-500 text-white px-4 py-2 rounded">
            Place Trade
          </button>
        </div>

        {/* Active Orders Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400">
              <th className="text-left">Symbol</th>
              <th className="text-left">ID</th>
              <th className="text-left">Type</th>
              <th className="text-left">Volume</th>
              <th className="text-left">Open Price</th>
              <th className="text-left">Open Time</th>
              <th className="text-left">SL</th>
              <th className="text-left">TP</th>
              <th className="text-left">Price</th>
              <th className="text-left">Commission</th>
              <th className="text-left">Swap</th>
              <th className="text-left">PnL</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="text-gray-300">
                <td>{trade.symbol}</td>
                <td>{trade.id}</td>
                <td>{trade.type}</td>
                <td>{trade.volume}</td>
                <td>{trade.openPrice.toFixed(2)}</td>
                <td>{trade.openTime}</td>
                <td>{trade.sl !== null ? trade.sl.toFixed(2) : "-"}</td>
                <td>{trade.tp !== null ? trade.tp.toFixed(2) : "-"}</td>
                <td>{trade.price !== null ? trade.price.toFixed(2) : "-"}</td>
                <td>{trade.commission || "-"}</td>
                <td>{trade.swap || "-"}</td>
                <td>{trade.pnl || "-"}</td>
                <td>
                  <button className="text-blue-500">Close</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default TradingInterface;
