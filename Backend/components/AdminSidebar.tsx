import React from 'react';
import { FaChartLine, FaUsers, FaExchangeAlt, FaCog, FaChartBar, FaSignOutAlt } from 'react-icons/fa';

interface AdminSidebarProps {
  onNavigate: (view: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate }) => {
  return (
    <div className="w-64 bg-[#2c3035] flex flex-col justify-between">
      <div>
        <div className="text-center py-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Admin Panel</h3>
        </div>

        <nav className="py-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => onNavigate('dashboard')} 
                className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
              >
                <FaChartLine className="mr-3" /> Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('users')} 
                className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
              >
                <FaUsers className="mr-3" /> User Management
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('trades')} 
                className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
              >
                <FaExchangeAlt className="mr-3" /> Trade Management
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('settings')} 
                className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
              >
                <FaCog className="mr-3" /> System Settings
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('analytics')} 
                className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
              >
                <FaChartBar className="mr-3" /> Analytics
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <button 
        className="flex items-center justify-center py-4 text-gray-400 hover:text-white hover:bg-[#3a3f45] transition-colors duration-200"
      >
        <FaSignOutAlt className="mr-3" /> Log Out
      </button>
    </div>
  );
};

export default AdminSidebar;