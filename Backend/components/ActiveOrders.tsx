import React from "react";

const ActiveOrders = ({ orders }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Active Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="mb-2">
            {order.instrument} - {order.type} - {order.units} units at{" "}
            {order.openPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveOrders;
