"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Header from "./Header";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import TradingResults from "./TradingResults";
import AccountPanel from "./Accountpanel";
import SuccessRateChart from "./SuccessRateChart";

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
  //   const successRateData = {
  //     datasets: [
  //       {
  //         data: [stats.profit, stats.loss],
  //         backgroundColor: ["#4caf50", "#f44336"],
  //         borderWidth: 0,
  //       },
  //     ],
  //   };
  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-grow p-6 mx-20">
          <div className="flex gap-6 mb-6">
            <div className="grid grid-cols-2 gap-4 w-[600px]">
              {" "}
              {/* Stat cards container */}
              <StatCard
                title="Total Balance"
                value={`$${userData.balance.toFixed(2)}`}
                icon="wallet"
                note="* using current exchange rate"
              />
              <StatCard
                title="Total PNL"
                value={`$${stats.pnl.toFixed(2)}`}
                icon="coins"
                note="* using current exchange rate"
              />
              <StatCard
                title="Profitable Orders"
                value={stats.profitableOrders}
                icon="flask"
              />
              <StatCard
                title="Total Deposits"
                value={`$${userData.totalDeposits.toFixed(2)}`}
                icon="chart"
                note="* using current exchange rate"
              />
            </div>
            <div className="flex-grow flex justify-end">
              <SuccessRateChart profit={stats.profit} loss={stats.loss} />
            </div>
          </div>
          <div className="mb-6">
            <TradingResults className="h-64 w-full" />
          </div>
          <AccountPanel
            balance={userData.balance}
            leverage={userData.leverage}
            credit={userData.credit}
            className="w-[300px]"
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
