import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface AccountDetails {
  accountType: string;
  accountNumber: string;
  balance: number;
  credit: number;
  invested: number;
  profit: number;
  equity: number;
  margin: number;
  marginLevel: number;
  freeMargin: number;
}

const AccountDropdown: React.FC<{ accountDetails: AccountDetails }> = ({ accountDetails }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-2 rounded text-white"
      >
        <div className="flex flex-col items-start">
          <span className="text-green-500 text-xs font-semibold">STANDARD ACCOUNT</span>
          <span className="text-green-500 text-xl font-bold self-end">A${accountDetails.balance.toFixed(2)}</span>
        </div>
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
                  <span className="text-white font-medium flex-shrink-0">${typeof value === 'number' ? value.toFixed(2) : value}</span>
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