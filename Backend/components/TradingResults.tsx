import React from 'react';
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Sample data for trading results, replace this with your dynamic data
const tradingData = [
  {
    id: 1,
    date: '2024-09-20',
    asset: 'BTC/USD',
    orderType: 'Buy',
    profitLoss: '+$500',
  },
  {
    id: 2,
    date: '2024-09-18',
    asset: 'ETH/USD',
    orderType: 'Sell',
    profitLoss: '-$200',
  },
  {
    id: 3,
    date: '2024-09-17',
    asset: 'XRP/USD',
    orderType: 'Buy',
    profitLoss: '+$150',
  },
];

const TradingResults: React.FC = () => {
  return (
    <Card className="p-4 bg-gray-800">
      <h3 className="text-lg font-semibold mb-4">Trading Results</h3>

      {/* Table to display trading results */}
      <TableContainer component={Paper}>
        <Table aria-label="trading results table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Order Type</TableCell>
              <TableCell>Profit/Loss</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tradingData.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{trade.date}</TableCell>
                <TableCell>{trade.asset}</TableCell>
                <TableCell>{trade.orderType}</TableCell>
                <TableCell>{trade.profitLoss}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default TradingResults;
