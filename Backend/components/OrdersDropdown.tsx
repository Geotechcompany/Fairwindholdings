import React, { useState, useEffect } from "react";
import {
  FaChevronUp,
  FaChevronDown,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { Trade } from "@/types/trade";

interface OrdersDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

const OrdersDropdown: React.FC<OrdersDropdownProps> = ({
  isOpen,
  onToggle,
}) => {
  const [activeTab, setActiveTab] = useState<
    "ACTIVE ORDERS" | "ORDERS HISTORY"
  >("ACTIVE ORDERS");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrades = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/trade/${activeTab === "ACTIVE ORDERS" ? "active" : "history"}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch ${activeTab.toLowerCase()}`);
        }
        const fetchedTrades = await response.json();
        setTrades(fetchedTrades);
      } catch (err) {
        setError(`Error fetching ${activeTab.toLowerCase()}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrades();
    const intervalId = setInterval(fetchTrades, 60000);
    return () => clearInterval(intervalId);
  }, [activeTab]);

  const formatNumber = (
    value: number | null | undefined,
    decimals: number = 2
  ): string => {
    return value != null ? value.toFixed(decimals) : "-";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string, profitLoss: number | null) => {
    if (status === "OPEN") return "bg-yellow-500 text-black";
    if (profitLoss === null) return "bg-gray-500";
    return profitLoss >= 0 ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="bg-[#1E2530] text-white">
      <div className="flex items-center justify-between px-4 py-2 bg-[#242D3C] border-b border-[#2A3544]">
        <div className="flex space-x-4">
          <button
            className={`text-sm font-semibold ${
              activeTab === "ACTIVE ORDERS" ? "text-[#3B82F6]" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("ACTIVE ORDERS")}
          >
            ACTIVE ORDERS
          </button>
          <button
            className={`text-sm font-semibold ${
              activeTab === "ORDERS HISTORY"
                ? "text-[#3B82F6]"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("ORDERS HISTORY")}
          >
            ORDERS HISTORY
          </button>
        </div>
        <button onClick={onToggle}>
          {isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </button>
      </div>
      {isOpen && (
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-center py-4">Loading...</p>
          ) : error ? (
            <p className="text-center py-4 text-red-500">{error}</p>
          ) : trades.length === 0 ? (
            <p className="text-center py-4">
              No {activeTab.toLowerCase()} found
            </p>
          ) : (
            <table className="w-full min-w-max">
              <thead>
                <tr className="text-left text-xs text-gray-400 bg-[#1E2530]">
                  <th className="p-2">ID</th>
                  <th className="p-2">Instrument</th>
                  <th className="p-2">Units</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Open Price</th>
                  <th className="p-2">Close Price</th>
                  <th className="p-2">Profit/Loss</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr
                    key={trade.id}
                    className="text-sm border-b border-[#2A3544]"
                  >
                    <td className="p-2">{trade.id}</td>
                    {/* <td className="p-2">{trade.userId}</td> */}
                    <td className="p-2">{trade.instrument}</td>
                    <td className="p-2">{formatNumber(trade.units)}</td>
                    <td className="p-2">{trade.type}</td>
                    <td className="p-2">{formatNumber(trade.openPrice, 5)}</td>
                    <td className="p-2">{formatNumber(trade.closePrice, 5)}</td>
                    <td className="p-2">
                      <div
                        className={`flex items-center ${
                          trade.profitLoss !== null && trade.profitLoss >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {trade.profitLoss !== null &&
                          (trade.profitLoss >= 0 ? (
                            <FaArrowUp />
                          ) : (
                            <FaArrowDown />
                          ))}
                        <span className="ml-1">
                          {formatNumber(trade.profitLoss)}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          trade.status,
                          trade.profitLoss
                        )}`}
                      >
                        {trade.status}
                      </span>
                    </td>
                    {/* <td className="p-2">
                      {formatDate(trade.createdAt.toString())}
                    </td>
                    <td className="p-2">
                      {formatDate(trade.updatedAt.toString())}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersDropdown;
