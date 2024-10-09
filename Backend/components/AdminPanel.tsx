"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
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
import AdminMobileSidebar from "./AdminComponents/AdminMobileSidebar";

interface AdminPanelProps {
  adminData: AdminData;
}

function AdminPanel({ adminData }: AdminPanelProps) {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      setIsAdmin(user.publicMetadata.role === "admin");
      if (user.publicMetadata.role !== "admin") {
        toast.error("You don't have access to the admin panel");
      }
    }
  }, [isLoaded, user]);

  if (!isLoaded) return <div>Loading...</div>;

  if (!isAdmin) return null;

  function renderView() {
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
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-[600px]">
                <StatCard
                  title="Total Users"
                  value={adminData.totalUsers.toString()}
                  icon="bank"
                />
                <StatCard
                  title="Total Trades"
                  value={adminData.totalTrades.toString()}
                  icon="money-bag"
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
              <div className="flex-grow mt-6 lg:mt-0">
                <Analytics />
              </div>
            </div>
          </>
        );
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white">
      <Header 
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        isAdminDashboard={true}
      />
      <div className="flex flex-1 pt-16">
        <AdminSidebar
          onNavigate={setCurrentView}
          className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 overflow-y-auto z-10 border-r border-gray-700"
        />
        <AdminMobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onNavigate={(view) => {
            setCurrentView(view);
            setIsMobileSidebarOpen(false);
          }}
        />
        <main className="flex-grow lg:ml-64 p-6 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;
