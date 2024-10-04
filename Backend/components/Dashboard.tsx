"use client";

import React, { useState, useEffect } from "react";
import { getUserData } from "@/app/actions/getuserData";
import { useUser } from "@clerk/nextjs";
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

interface UserData {
  balance: number;
  leverage: string;
  credit: number;
  totalDeposits: number;
  fullName: string;
  firstName: string;
  email: string;
  profileImage: string;
}

interface Stats {
  pnl: number;
  profit: number;
  loss: number;
  profitableOrders: string;
}

export function Dashboard() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [userData, setUserData] = useState<(UserData & Stats) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const result = await getUserData();
        if ("error" in result) {
          setError(result.error ?? null);
        } else {
          setUserData(result.data);
        }
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  const userDataForSidebar: UserData = {
    firstName: user?.firstName || userData.firstName || "",
    fullName: user?.fullName || userData.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || userData.email || "",
    profileImage:
      user?.imageUrl ||
      userData.profileImage ||
      "/images/placeholder-avatar.png",
    balance: userData.balance,
    leverage: userData.leverage,
    credit: userData.credit,
    totalDeposits: userData.totalDeposits,
  };

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
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-[600px] lg:grid-cols-2">
                <StatCard
                  title="Total Balance"
                  value={`$${userData.balance.toFixed(2)}`}
                  icon="wallet"
                  note="* using current exchange rate"
                />
                <StatCard
                  title="Total PNL"
                  value={`$${userData.pnl.toFixed(2)}`}
                  icon="coins"
                  note="* using current exchange rate"
                />
                <StatCard
                  title="Profitable Orders"
                  value={userData.profitableOrders}
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
                <SuccessRateChart
                  profit={userData.profit}
                  loss={userData.loss}
                />
              </div>
            </div>
            <div className="mb-6">
              <TradingResults className="h-64 w-full overflow-x-auto" />
            </div>
            <AccountPanel
              balance={userData.balance}
              leverage={userData.leverage}
              credit={userData.credit}
              className="lg:w-[300px] w-full"
            />
          </>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white overflow-hidden">
      <Header />
      <div className="flex flex-1">
        <Sidebar onNavigate={setCurrentView} userData={userDataForSidebar} />
        <main className="flex-grow p-6 mx-20">{renderView()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
