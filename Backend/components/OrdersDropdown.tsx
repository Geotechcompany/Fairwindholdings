import React from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

interface Trade {
  id: string;
  instrument: string;
  currentUnits: number;
  price: number;
  unrealizedPL: number;
}

interface OrdersDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  openTrades: Trade[];
}

const OrdersDropdown: React.FC<OrdersDropdownProps> = ({
  isOpen,
  onToggle,
  openTrades,
}) => {
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
        <div className="p-2">
          {openTrades.length === 0 ? (
            <p>No open trades</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Type</th>
                  <th>Units</th>
                  <th>Price</th>
                  <th>P/L</th>
                </tr>
              </thead>
              <tbody>
                {openTrades.map((trade) => (
                  <tr key={trade.id}>
                    <td>{trade.instrument}</td>
                    <td>
                      {parseFloat(trade.currentUnits) > 0 ? "Buy" : "Sell"}
                    </td>
                    <td>{Math.abs(parseFloat(trade.currentUnits))}</td>
                    <td>{parseFloat(trade.price).toFixed(5)}</td>
                    <td
                      className={
                        parseFloat(trade.unrealizedPL) >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {parseFloat(trade.unrealizedPL).toFixed(2)}
                    </td>
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
