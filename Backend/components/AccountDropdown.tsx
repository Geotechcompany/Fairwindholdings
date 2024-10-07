import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface AccountDetails {
  accountType: string;
  accountNumber: string;
  balance: string;
  credit: string;
  invested: string;
  profit: string;
  equity: string;
  margin: string;
  marginLevel: string;
  freeMargin: string;
}

const AccountDropdown: React.FC<{ accountDetails: AccountDetails }> = ({ accountDetails }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-gray-800 p-2 rounded text-white"
      >
        <span>Account</span>
        {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
      </button>
      {isOpen && (
        <div className="absolute w-64 bg-gray-800 mt-1 rounded-md shadow-lg z-10 right-0">
          <div className="p-3 border-b border-gray-700">
            <div className="text-green-500 text-sm font-semibold">{accountDetails.accountType} ACCOUNT</div>
            <div className="text-green-500 text-sm">#{accountDetails.accountNumber}</div>
            <div className="text-green-500 text-sm mt-1">Status: Active</div>
          </div>
          <div className="p-3 space-y-2">
            {Object.entries(accountDetails).map(([key, value]) => (
              key !== 'accountType' && key !== 'accountNumber' && (
                <div key={key} className="flex items-baseline text-sm">
                  <span className="text-gray-400 capitalize flex-shrink-0">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className="flex-grow mx-2 border-b border-gray-600 border-dotted"></div>
                  <span className="text-white font-medium flex-shrink-0">${value}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;