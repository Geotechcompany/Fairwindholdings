import React from "react";

const TradingHistory = ({ history }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Trading History</h2>
      <ul>
        {history.map((trade) => (
          <li key={trade.id} className="mb-2">
            {trade.instrument} - {trade.type} - {trade.units} units - Open:{" "}
            {trade.openPrice} - Close: {trade.closePrice} - Profit/Loss:{" "}
            {trade.profitLoss}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradingHistory;
