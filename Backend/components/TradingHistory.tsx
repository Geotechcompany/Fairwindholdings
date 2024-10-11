import React from "react";

interface Trade {
  id: string;
  instrument: string;
  type: string;
  units: number;
  openPrice: number;
  closePrice: number | null;
  profitLoss: number | null;
  status: string;
}

interface TradingHistoryProps {
  trades: Trade[];
}

const TradingHistory: React.FC<TradingHistoryProps> = ({ trades }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Trading History</h2>
      <ul>
        {trades.map((trade) => (
          <li key={trade.id} className="mb-2">
            {trade.instrument} - {trade.type} - {trade.units} units - Open: {trade.openPrice}
            {trade.status === 'CLOSED' && (
              <> - Close: {trade.closePrice} - Profit/Loss: {trade.profitLoss}</>
            )}
            - Status: {trade.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradingHistory;
