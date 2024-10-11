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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AdminPanelProps {
  adminData: AdminData;
}

function AdminPanel({ adminData }: AdminPanelProps) {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, isLoaded } = useUser();
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setIsAdmin(user.publicMetadata.role === "admin");
      if (user.publicMetadata.role !== "admin") {
        toast.error("You don't have access to the admin panel");
      }
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard-stats");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }
        const data = await response.json();
        setDashboardStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to fetch dashboard stats");
      }
    };

    if (isAdmin) {
      fetchDashboardStats();
      const intervalId = setInterval(fetchDashboardStats, 60000); // Update every minute
      return () => clearInterval(intervalId);
    }
  }, [isAdmin]);

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
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Users"
                value={dashboardStats?.totalUsers.toString() || adminData.totalUsers.toString()}
                icon="bank"
              />
              <StatCard
                title="Active Users"
                value={dashboardStats?.activeUsers.toString() || "N/A"}
                icon="wallet"
              />
              <StatCard
                title="Total Trades"
                value={dashboardStats?.totalTrades.toString() || adminData.totalTrades.toString()}
                icon="money-bag"
              />
              <StatCard
                title="Total Volume"
                value={`$${(dashboardStats?.totalVolume || adminData.totalVolume).toFixed(2)}`}
                icon="coins"
              />
            </div>
            {dashboardStats?.monthlyData && (
              <div className="bg-[#1e2329] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                <div className="h-[calc(100vh-300px)] min-h-[400px]"> {/* Adjusted height */}
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardStats.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" />
                      <XAxis dataKey="month" stroke="#718096" />
                      <YAxis yAxisId="left" stroke="#718096" />
                      <YAxis yAxisId="right" orientation="right" stroke="#718096" />
                      <Tooltip contentStyle={{ backgroundColor: "#2d3748", border: "none" }} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="userGrowth"
                        stroke="#8884d8"
                        name="User Growth"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="tradeVolume"
                        stroke="#82ca9d"
                        name="Trade Volume"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
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
