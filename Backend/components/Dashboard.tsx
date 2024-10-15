"use client";

import React, { useState, useEffect } from "react";
import { getUserData } from "@/app/actions/getuserData";
import { useUser, UserProfile } from "@clerk/nextjs";
import { Header } from "./Header";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
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
import Loader from "./Loader"; // Import the Loader component
import { UserData as UserDataType, Stats, UserData } from "@/types/user";

export function Dashboard() {
  const [currentView, setCurrentView] = useState("main");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
    return <Loader />; // Use the Loader component for loading state
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
          <div className="w-full max-w-4xl mx-auto bg-[#1e2433] rounded-lg p-4 sm:p-6 shadow-lg">
            <UserProfile
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "bg-transparent shadow-none",
                  card: "bg-transparent shadow-none",
                  navbar: "hidden",
                  pageScrollBox: "bg-transparent",
                  formButtonPrimary:
                    "bg-green-400 hover:bg-green-500 text-black",
                  formFieldInput:
                    "bg-gray-800 bg-opacity-50 text-white border-gray-600",
                  formFieldLabel: "text-gray-300",
                  headerTitle: "text-green-400 text-xl sm:text-2xl",
                  headerSubtitle: "text-gray-300 text-sm sm:text-base",
                  profileSectionTitleText: "text-green-400 text-lg sm:text-xl",
                  profileSectionContent:
                    "bg-gray-800 bg-opacity-50 rounded-lg p-3 sm:p-4",
                  accordionTriggerButton: "text-gray-300 hover:text-green-400",
                  formFieldAction: "text-green-400",
                  formFieldInputShowPasswordButton: "text-green-400",
                  formResendCodeLink: "text-green-400 hover:text-green-300",
                  userPreviewMainIdentifier: "text-white",
                  userPreviewSecondaryIdentifier: "text-gray-300",
                  userButtonPopoverActionButton:
                    "text-gray-300 hover:text-green-400 hover:bg-gray-800",
                  userButtonPopoverActionButtonIcon: "text-green-400",
                  userButtonPopoverFooter: "hidden",
                  badge: "bg-green-400 text-black",
                  navbarMobileMenuButton: "text-green-400",
                  headerSubtitle: "hidden",
                  footerActionLink: "hidden",
                  footer: "hidden",
                },
                layout: {
                  socialButtonsPlacement: "bottom",
                  socialButtonsVariant: "iconButton",
                },
                variables: {
                  colorPrimary: "#4ADE80",
                  colorBackground: "transparent",
                  colorText: "#ffffff",
                  colorTextSecondary: "#d1d5db",
                  borderRadius: "0.375rem",
                },
              }}
            />
          </div>
        );
      case "deposit":
        return <Deposit />;
      default:
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  icon="money-bag"
                />
                <StatCard
                  title="Total Deposits"
                  value={`$${userData.totalDeposits.toFixed(2)}`}
                  icon="bank"
                  note="* using current exchange rate"
                />
              </div>
              <div className="lg:col-span-2">
                <SuccessRateChart
                  profit={userData.profit}
                  loss={userData.loss}
                  className="h-full"
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
    <div className="flex flex-col min-h-screen bg-[#111827] text-white">
      <Header
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        className="fixed top-0 left-0 right-0 z-10 border-b border-gray-700"
      />
      <div className="flex flex-1 pt-16">
        <Sidebar
          onNavigate={setCurrentView}
          userData={userDataForSidebar}
          className="hidden lg:block fixed left-0 top-0 bottom-0 w-72 overflow-y-auto z-10 border-r border-gray-700"
        />
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onNavigate={(view) => {
            setCurrentView(view);
            setIsMobileSidebarOpen(false);
          }}
          userData={userDataForSidebar}
        />
        <main className="flex-grow lg:ml-72 p-6 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
