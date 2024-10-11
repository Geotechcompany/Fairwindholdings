import React, { useState, useEffect } from "react";
import { Trade } from "@/types/trade";
import AdminTradeCreation from "./AdminTradeCreation";
import EditTradeModal from "./EditTradeModal";

const TradeManagement: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  useEffect(() => {
    const fetchActiveTrades = async () => {
      try {
        const response = await fetch("/api/admin/trades/active");
        if (!response.ok) {
          throw new Error("Failed to fetch active trades");
        }
        const data = await response.json();
        setTrades(data);
      } catch (error) {
        console.error("Error fetching active trades:", error);
      }
    };

    fetchActiveTrades();
    const intervalId = setInterval(fetchActiveTrades, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  const handleCloseTrade = async (tradeId: string) => {
    try {
      const response = await fetch(`/api/admin/trade/${tradeId}/close`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to close trade");
      }
      setTrades(trades.filter((trade) => trade.id !== tradeId));
    } catch (error) {
      console.error("Error closing trade:", error);
    }
  };

  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
  };

  const handleSaveEdit = async (updatedTrade: Trade) => {
    try {
      const response = await fetch(`/api/admin/trades/${updatedTrade.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instrument: updatedTrade.instrument,
          type: updatedTrade.type,
          units: updatedTrade.units,
          openPrice: updatedTrade.openPrice,
          closePrice: updatedTrade.closePrice,
          profitLoss: updatedTrade.profitLoss,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update trade");
      }
      const updatedTradeData = await response.json();
      setTrades(
        trades.map((trade) =>
          trade.id === updatedTradeData.id ? updatedTradeData : trade
        )
      );
      setEditingTrade(null);
    } catch (error) {
      console.error("Error updating trade:", error);
    }
  };

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Trade Management</h1>
      <div className="space-y-6">
        <AdminTradeCreation />
        <div>
          <h2 className="text-xl font-bold mb-4">Active Trades</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-2">ID</th>
                <th className="pb-2">User</th>
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Volume</th>
                <th className="pb-2">Open Price</th>
                <th className="pb-2">Close Price</th>
                <th className="pb-2">Profit/Loss</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-t border-gray-700">
                  <td className="py-4">{trade.id}</td>
                  <td className="py-4">{trade.userId}</td>
                  <td className="py-4">{trade.instrument}</td>
                  <td className="py-4">{trade.type}</td>
                  <td className="py-4">{trade.units}</td>
                  <td className="py-4">{trade.openPrice}</td>
                  <td className="py-4">{trade.closePrice || "-"}</td>
                  <td className="py-4">{trade.profitLoss || "-"}</td>
                  <td className="py-4">{trade.status}</td>
                  <td className="py-4">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleEditTrade(trade)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleCloseTrade(trade.id)}
                    >
                      Close
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingTrade && (
        <EditTradeModal
          trade={editingTrade}
          onSave={handleSaveEdit}
          onClose={() => setEditingTrade(null)}
        />
      )}
    </div>
  );
};

export default TradeManagement;
