import React, { useState, useEffect } from 'react';

const TradeManagement: React.FC = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    // Fetch trades from API
    // setTrades(fetchedTrades);
  }, []);

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Trade Management</h1>
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
          {trades.map((trade: any) => (
            <tr key={trade.id} className="border-t border-gray-700">
              <td className="py-4">{trade.id}</td>
              <td className="py-4">{trade.user}</td>
              <td className="py-4">{trade.symbol}</td>
              <td className="py-4">{trade.type}</td>
              <td className="py-4">{trade.volume}</td>
              <td className="py-4">{trade.openPrice}</td>
              <td className="py-4">{trade.closePrice}</td>
              <td className="py-4">{trade.profitLoss}</td>
              <td className="py-4">{trade.status}</td>
              <td className="py-4">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Close</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeManagement;