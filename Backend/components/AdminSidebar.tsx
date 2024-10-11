'use client'

import React from 'react';
import { FaChartLine, FaUsers, FaExchangeAlt, FaCog, FaChartBar, FaSignOutAlt, FaIdCard, FaMoneyBillWave, FaComments, FaShieldAlt } from 'react-icons/fa';

interface AdminSidebarProps {
  onNavigate: (view: string) => void;
  className?: string;
}

function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  const menuItems = [
    { icon: FaChartLine, label: "Dashboard", view: "dashboard" },
    { icon: FaUsers, label: "User Management", view: "users" },
    { icon: FaExchangeAlt, label: "Trade Management", view: "trades" },
    { icon: FaIdCard, label: "KYC Management", view: "kyc" },
    { icon: FaMoneyBillWave, label: "Deposits", view: "deposits" },
    { icon: FaMoneyBillWave, label: "Withdrawals", view: "withdrawals" },
    { icon: FaComments, label: "Support", view: "support" },
    { icon: FaCog, label: "System Settings", view: "settings" },
    { icon: FaShieldAlt, label: "Security", view: "security" },
    { icon: FaChartBar, label: "Analytics", view: "analytics" },
  ];

  return (
    <aside className={`w-64 bg-[#2c3035] flex flex-col min-h-screen pt-20 ${className}`}>
      <div className="text-center py-6 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-white">Admin Panel</h3>
      </div>

      <nav className="flex-grow py-4">
        <ul className="space-y-2">
          {menuItems.map(({ icon: Icon, label, view }) => (
            <li key={view}>
              <button 
                onClick={() => onNavigate(view)} 
                className="flex items-center w-full py-3 px-6 hover:bg-[#3a3f45] transition-colors duration-200 text-gray-300 hover:text-white"
              >
                <Icon className="w-6 h-6 mr-4" />
                <span className="text-base">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pb-6 pt-4 flex justify-center">
        <button 
          onClick={() => onNavigate('logout')}
          className="flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#3a3f45] transition-colors duration-200 text-base w-3/4 py-3 px-4 rounded"
        >
          <FaSignOutAlt className="w-6 h-6 mr-3" /> Log Out
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;