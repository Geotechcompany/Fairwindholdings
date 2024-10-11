import React from "react";

interface Trade {
  id: string;
  instrument: string;
  type: string;
  units: number;
  openPrice: number;
  currentPrice?: number;
  profitLoss?: number;
}

interface ActiveOrdersProps {
  orders: Trade[];
}

const ActiveOrders: React.FC<ActiveOrdersProps> = ({ orders }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Active Orders</h2>
      {orders.length === 0 ? (
        <p>No active orders</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="mb-2 border-b border-gray-700 pb-2">
              <div>{order.instrument} - {order.type}</div>
              <div>{order.units} units at {order.openPrice}</div>
              {order.currentPrice && (
                <div>Current Price: {order.currentPrice}</div>
              )}
              {order.profitLoss && (
                <div className={order.profitLoss >= 0 ? "text-green-500" : "text-red-500"}>
                  P/L: {order.profitLoss.toFixed(2)}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveOrders;
