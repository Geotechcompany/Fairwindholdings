"use client";
import React, { useState } from "react";
import { Header } from "./Header";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import TradingResults from "./TradingResults";
import AccountPanel from "./Accountpanel";
import SuccessRateChart from "./SuccessRateChart";
import Verification from "./Verification";
import PersonalInfo from "./PersonalInfo";
import Withdrawal from "./withdrawal";
import Accounts from "./Accounts";
import LiveChat from "./Livechat";
import Savings from "./Savings";
import Settings from "./Settings";
import Deposit from "./Deposit";
import ProtectedDashboard from "@/components/ProtectedDashboard";

interface UserData {
  balance: number;
  leverage: string;
  credit: number;
  totalDeposits: number;
  fullName: string;
  email: string;
  profileImage: string;
}

interface Stats {
  pnl: number;
  profit: number;
  loss: number;
  profitableOrders: string;
}

interface DashboardProps {
  userData: UserData;
  stats: Stats;
}

export const Dashboard: React.FC<DashboardProps> = ({ userData, stats }) => {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "verification":
        return <Verification />;
      case "personal-info":
        return <PersonalInfo />;
      case "withdrawal":
        return <Withdrawal />;
      case "accounts":
        return <Accounts />;
      case "live-chat":
        return <LiveChat />;
      case "savings":
        return <Savings />;
      case "settings":
        return <Settings />;
      case "deposit":
        return <Deposit />;
      default:
        return (
          <>
            <div className="flex gap-6 mb-6">
              <div className="grid grid-cols-2 gap-4 w-[600px]">
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
          </>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white">
      <Header />
      <div className="flex flex-1">
        <Sidebar onNavigate={setCurrentView} userData={userData} />
        <main className="flex-grow p-6 mx-20">{renderView()}</main>
      </div>
    </div>
  );
};
export default function DashboardPage() {
  return <ProtectedDashboard />;
}
