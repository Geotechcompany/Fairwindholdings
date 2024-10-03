"use client";
import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import TradingResults from "./TradingResults";
import AccountPanel from "./AccountPanel";
import SuccessRateChart from "./SuccessRateChart";
import Verification from "./Verification";
import PersonalInfo from "./PersonalInfo";
import Withdrawal from "./withdrawal";
import Accounts from "./Accounts";
import LiveChat from "./Livechat";
import Savings from "./Savings";
import Settings from "./Settings";
import Deposit from "./Deposit";
import { fetchUserData } from "@/lib/api/auth";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  currency: string;
  balance: number;
  leverage: string;
  credit: number;
  totalDeposits: number;
  fullName: string;
  profileImage: string;
}

interface Stats {
  pnl: number;
  profit: number;
  loss: number;
  profitableOrders: string;
}

export const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching user data...');
        const data = await fetchUserData();
        console.log('Fetched user data:', data);
        if (data.status === 'success' && data.data) {
          setUserData(data.data.userData);
          setStats(data.data.stats);
          setError(null);
        } else {
          throw new Error('Invalid data structure received');
        }
      } catch (error) {
        console.error('Failed to load user data', error);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData || !stats) {
    return <div>No user data available. Please try logging in again.</div>;
  }

  const renderView = () => {
    switch (currentView) {
      case "verification":
        return <Verification />;
      case "personal-info":
        return <PersonalInfo userData={userData} />;
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TradingResults className="h-64 w-full overflow-x-auto" />
              </div>
              <div>
                <SuccessRateChart profit={stats.profit} loss={stats.loss} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AccountPanel
                  balance={userData.balance}
                  leverage={userData.leverage}
                  credit={userData.credit}
                  className="w-full"
                />
              </div>
              <div>
                {/* You can add another component or information here */}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white overflow-hidden">
      <Header />
      <div className="flex flex-1">
        <Sidebar onNavigate={setCurrentView} userData={userData} />
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
