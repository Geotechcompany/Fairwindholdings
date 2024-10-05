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
        } catch {
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
