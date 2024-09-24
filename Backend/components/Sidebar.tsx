import React from 'react';
import { Button } from '@mui/material';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 flex flex-col justify-between p-6">
      <div>
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4"></div>
          <h3>Arthur Breck</h3>
          <p>ID #2047597</p>
          <p>arthurbreck417@gmail.com</p>
        </div>
        <Button variant="contained" color="success" className="mt-4 w-full">
          Deposit
        </Button>

        <nav className="mt-6">
          <ul className="space-y-4">
            <li>Dashboard</li>
            <li>Personal Info</li>
            <li>Withdrawal</li>
            <li>Verification</li>
            <li>Accounts</li>
            <li>Live Chat</li>
            <li>Savings</li>
            <li>Settings</li>
          </ul>
        </nav>
      </div>

      <Button variant="outlined" color="error" className="w-full">
        Log Out
      </Button>
    </div>
  );
};

export default Sidebar;
