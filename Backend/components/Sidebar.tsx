import React from 'react';
import { Button } from '@mui/material';
import { FaChartLine, FaUser, FaMoneyBillWave, FaIdCard, FaUserCircle, FaComments, FaPiggyBank, FaCog, FaSignOutAlt } from 'react-icons/fa';

interface SidebarProps {
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  return (
    <div className="w-64 bg-[#2c3035] flex flex-col justify-between">
      <div>
        <div className="text-center py-6 border-b border-gray-700">
          <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold">Arthur Breck</h3>
          <p className="text-sm text-gray-400">#2047597</p>
          <p className="text-sm text-gray-400">arthurbreck417@gmail.com</p>
          <Button variant="contained" color="primary" className="mt-4 w-3/4 bg-[#4caf50] hover:bg-[#45a049]">
            Deposit
          </Button>
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
                onClick={() => onNavigate('personal-info')} 
                className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
              >
                <FaUser className="mr-3" /> Personal Info
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('withdrawal')} 
                className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
              >
                <FaMoneyBillWave className="mr-3" /> Withdrawal
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('verification')} 
                className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
              >
                <FaIdCard className="mr-3" /> Verification
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('accounts')} 
                className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
              >
                <FaUserCircle className="mr-3" /> Accounts
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('live-chat')} 
                className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
              >
                <FaComments className="mr-3" /> Live Chat
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('savings')} 
                className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
              >
                <FaPiggyBank className="mr-3" /> Savings
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('settings')} 
                className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
              >
                <FaCog className="mr-3" /> Settings
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <Button 
        variant="text" 
        color="inherit" 
        className="flex items-center justify-center py-4 text-gray-400 hover:text-white hover:bg-[#3a3f45] transition-colors duration-200"
      >
        <FaSignOutAlt className="mr-3" /> Log Out
      </Button>
    </div>
  );
};

export default Sidebar;