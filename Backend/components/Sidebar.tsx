import React from 'react';
import { Button } from '@mui/material';

const Sidebar = () => {
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
            <li className="py-2 px-4 bg-[#1e2329] border-l-4 border-[#4caf50]">Dashboard</li>
            <li className="py-2 px-4">Personal Info</li>
            <li className="py-2 px-4">Withdrawal</li>
            <li className="py-2 px-4">Verification</li>
            <li className="py-2 px-4">Accounts</li>
            <li className="py-2 px-4">Live Chat</li>
            <li className="py-2 px-4">Savings</li>
            <li className="py-2 px-4">Settings</li>
          </ul>
        </nav>
      </div>

      <Button variant="text" color="inherit" className="py-4 text-gray-400 hover:text-white">
        Log Out
      </Button>
    </div>
  );
};

export default Sidebar;