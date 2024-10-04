"use client";
import React, { useState } from "react";
import { Header } from "./Header";
import AdminSidebar from "./AdminSidebar";
import StatCard from "./StatCard";
import UserManagement from "./AdminComponents/UserManagement";
import TradeManagement from "./AdminComponents/TradeManagement";
import SystemSettings from "./AdminComponents/SystemSettings";
import Analytics from "./AdminComponents/Analytics";
import KYCManagement from "./AdminComponents/KYCManagement";
import DepositManagement from "./AdminComponents/DepositManagement";
import WithdrawalManagement from "./AdminComponents/WithdrawalManagement";
import Support from "./AdminComponents/Support";
import Security from "./AdminComponents/Security";
import { AdminData } from "@/types/admin";

interface AdminPanelProps {
  adminData: AdminData;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ adminData }) => {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "users":
        return <UserManagement />;
      case "trades":
        return <TradeManagement />;
      case "kyc":
        return <KYCManagement />;
      case "deposits":
        return <DepositManagement />;
      case "withdrawals":
        return <WithdrawalManagement />;
      case "support":
        return <Support />;
      case "settings":
        return <SystemSettings />;
      case "security":
        return <Security />;
      case "analytics":
        return <Analytics />;
      default:
        return (
          <>
            <div className="flex gap-6 mb-6">
              <div className="grid grid-cols-2 gap-4 w-[600px]">
                <StatCard
                  title="Total Users"
                  value={adminData.totalUsers.toString()}
                  icon="user"
                />
                <StatCard
                  title="Total Trades"
                  value={adminData.totalTrades.toString()}
                  icon="chart"
                />
                <StatCard
                  title="Total Volume"
                  value={`$${adminData.totalVolume.toFixed(2)}`}
                  icon="coins"
                />
                <StatCard
                  title="Revenue"
                  value={`$${adminData.revenue.toFixed(2)}`}
                  icon="wallet"
                />
              </div>
              <div className="flex-grow">
                <Analytics />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar onNavigate={setCurrentView} />
        <main className="flex-grow p-6 mx-20">{renderView()}</main>
      </div>
    </div>
  );
};

export default AdminPanel;
