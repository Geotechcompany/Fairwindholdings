import React, { useState, useEffect } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

interface Trade {
  id: string;
  instrument: string;
  units: number;
  type: string;
  openPrice: number;
  status: string;
}

interface OrdersDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

const OrdersDropdown: React.FC<OrdersDropdownProps> = ({
  isOpen,
  onToggle,
}) => {
  const [openTrades, setOpenTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpenTrades = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/trade/active");
        if (!response.ok) {
          throw new Error("Failed to fetch open trades");
        }
        const trades = await response.json();
        setOpenTrades(trades);
      } catch (err) {
        setError("Error fetching open trades");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpenTrades();
    // Set up an interval to fetch trades every minute
    const intervalId = setInterval(fetchOpenTrades, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  console.log("Open trades in OrdersDropdown:", openTrades);

  return (
    <div className="bg-gray-800 text-white">
      <button
        className="w-full p-2 flex justify-between items-center"
        onClick={onToggle}
      >
        <span>Open Orders</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isOpen && (
        <div className="p-2 overflow-x-auto">
          {isLoading ? (
            <p className="text-center py-4">Loading...</p>
          ) : error ? (
            <p className="text-center py-4 text-red-500">{error}</p>
          ) : openTrades.length === 0 ? (
            <p className="text-center py-4">No open trades</p>
          ) : (
            <table className="w-full min-w-max">
              <thead>
                <tr className="text-left bg-gray-700">
                  <th className="p-2">Instrument</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Units</th>
                  <th className="p-2">Open Price</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {openTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-700">
                    <td className="p-2">{trade.instrument}</td>
                    <td className="p-2">{trade.type}</td>
                    <td className="p-2">{trade.units}</td>
                    <td className="p-2">{trade.openPrice.toFixed(5)}</td>
                    <td className="p-2">{trade.status}</td>
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
