"use client";

import React, { useState, useEffect } from "react";
import { getUserData } from "@/app/actions/getuserData";
import { useUser, UserProfile } from "@clerk/nextjs";
import { Header } from "./Header";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import TradingResults from "./TradingResults";
import AccountPanel from "./Accountpanel";
import SuccessRateChart from "./SuccessRateChart";
import Verification from "./Verification";
import Withdrawal from "./withdrawal";
import Accounts from "./Accounts";
import LiveChat from "./Livechat";
import Savings from "./Savings";
import Deposit from "./Deposit";
import { UserData as UserDataType, Stats } from "@/types/user";

export function Dashboard() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [userData, setUserData] = useState<(UserDataType & Stats) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    async function fetchUserData() {
      if (isLoaded && isSignedIn && user?.primaryEmailAddress?.emailAddress) {
        try {
          const result = await getUserData(
            user.primaryEmailAddress.emailAddress
          );
          if ("error" in result) {
            setError(result.error || "An unknown error occurred");
          } else {
            setUserData(result.data || null);
          }
        } catch (err) {
          setError("Failed to fetch user data");
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserData();
  }, [isLoaded, isSignedIn, user]);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="text-center text-white">No user data available</div>;
  }

  const userDataForSidebar: UserDataType = {
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
      case "withdrawal":
        return <Withdrawal />;
      case "accounts":
        return <Accounts />;
      case "live-chat":
        return <LiveChat />;
      case "savings":
        return <Savings />;
      case "settings":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <UserProfile routing="hash" />
          </div>
        );
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                  <h3 className="text-xl font-semibold mb-4">Trading Performance</h3>
                  <div className="h-64 overflow-hidden">
                    <TradingResults className="w-full h-full" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 h-full flex flex-col">
                  <h3 className="text-xl font-semibold mb-4">Success Rate</h3>
                  <div className="flex-grow flex items-center justify-center">
                    <SuccessRateChart
                      profit={userData.profit}
                      loss={userData.loss}
                    />
                  </div>
                </div>
              </div>
            </div>

            <AccountPanel
              balance={userData.balance}
              leverage={userData.leverage}
              credit={userData.credit}
              className="w-full"
            />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar onNavigate={setCurrentView} userData={userDataForSidebar} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;