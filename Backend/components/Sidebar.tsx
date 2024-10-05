import React, { useState } from 'react';
import Link from 'next/link';
import { FaChartLine, FaWallet, FaExchangeAlt, FaUserCog, FaSignOutAlt, FaQuestionCircle, FaBars, FaTimes, FaUser, FaComments } from 'react-icons/fa';
import { UserData } from '@/types/user';
import { FaIdCard } from 'react-icons/fa6';

interface SidebarProps {
  onNavigate: (view: string) => void;
  userData: UserData;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, userData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { icon: FaChartLine, label: 'Dashboard', view: 'dashboard' },
    { icon: FaWallet, label: 'Deposit', view: 'deposit' },
    { icon: FaExchangeAlt, label: 'Withdrawal', view: 'withdrawal' },
    { icon: FaUserCog, label: 'Settings', view: 'settings' },
    { icon: FaIdCard, label: 'Verification', view: 'verification' },
    { icon: FaUser, label: 'Accounts', view: 'accounts' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-4">
        <div className="flex items-center mb-6">
          <img
            src={userData.profileImage}
            alt={userData.fullName}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <h2 className="text-lg font-semibold text-white">{userData.email.split('@')[0]}</h2>
            <p className="text-sm text-gray-400">{userData.email}</p>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">Balance</p>
          <p className="text-2xl font-bold text-white">${userData.balance.toFixed(2)}</p>
        </div>
      </div>
      <nav>
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => {
              onNavigate(item.view);
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4">
        <button
          onClick={() => onNavigate("live-chat")}
          className="flex items-center text-gray-300 hover:text-white mb-4">
          <FaComments className="w-5 h-5 mr-3" />
          Live Chat
        </button>
        <button
        onClick={() => {
          // Implement logout logic here
          // For example: signOut() from your authentication library
          console.log('Logout clicked');
        }}
        className="flex items-center text-gray-300 hover:text-white">
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-16 left-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} w-64 bg-gray-800 text-gray-300 overflow-y-auto transition duration-200 ease-in-out z-40`}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block bg-gray-800 text-gray-300 w-64 flex-shrink-0 overflow-y-auto">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;