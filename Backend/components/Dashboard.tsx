"use client";
import React from 'react';
import { Card } from '@mui/material';
import AccountSummary from '../components/AccountSummary';
import TradingResults from '../components/TradingResults';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


type DashboardProps = {
  userData: {
    balance: number;
    leverage: string;
    credit: number;
    totalDeposits: number;
  };
  stats: {
    pnl: number;
    profit: number;
    loss: number;
    profitableOrders: string;
  };
};

const Dashboard: React.FC<DashboardProps> = ({ userData, stats }) => {
    const successRateData = {
        labels: ['Closed With Profit', 'Closed With Loss'],
        datasets: [
          {
            data: [stats.profit, stats.loss],
            backgroundColor: ['#4caf50', '#f44336'],
            borderColor: ['#4caf50', '#f44336'],
            borderWidth: 1,
          },
        ],
      };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4 bg-gray-800">
          <h3>Total Balance</h3>
          <p>${userData.balance}</p>
        </Card>

        <Card className="p-4 bg-gray-800">
          <h3>Total PNL</h3>
          <p>${stats.pnl}</p>
        </Card>

        <Card className="p-4 bg-gray-800">
          <h3>Profitable Orders</h3>
          <p>{stats.profitableOrders}</p>
        </Card>

        <Card className="p-4 bg-gray-800">
          <h3>Total Deposits</h3>
          <p>${userData.totalDeposits}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 p-4 bg-gray-800">
          <h3>Success Rate</h3>
          <Doughnut data={successRateData} />
        </Card>

        <Card className="col-span-2 p-4 bg-gray-800">
          <TradingResults />
        </Card>
      </div>

      <AccountSummary userData={userData} />
    </div>
  );
};

export default Dashboard;
