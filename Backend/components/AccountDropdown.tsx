import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaDollarSign } from 'react-icons/fa';

export interface AccountDetails {
  accountType: string;
  accountNumber: string;
  balance: number;
  credit: number;
  invested: number;
  profit: number;
  equity: number;
  margin: number;
  marginLevel: number | string;
  freeMargin: number | string;
}

const AccountDropdown: React.FC<{ accountDetails: AccountDetails }> = ({ accountDetails }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 py-1 px-2 rounded text-white bg-[#181F2D]"
      >
        <div className="flex flex-col items-end">
          <span className="text-[#4CAF50] text-xs font-semibold">LIVE ACCOUNT</span>
          <span className="text-[#4CAF50] text-xl font-bold leading-tight">${accountDetails.balance.toFixed(2)}</span>
        </div>
        <div className="flex items-center">
          {isOpen ? (
            <FaChevronUp size={10} className="text-[#4CAF50]" />
          ) : (
            <FaChevronDown size={10} className="text-[#4CAF50]" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="absolute w-full sm:w-[700px] bg-[#1E2530] mt-1 rounded shadow-lg z-10 right-0 flex flex-col sm:flex-row">
          <div className="w-full sm:flex-grow p-4 bg-[#1E2530] flex items-start order-1 sm:order-2">
            <div className="bg-[#242D3C] w-full p-3 rounded flex items-center">
              <FaDollarSign className="text-[#4CAF50] mr-3" size={24} />
              <div className="flex-grow">
                <div className="text-white text-sm font-bold">LIVE ACCOUNT</div>
                <div className="text-gray-400 text-xs mb-1">#{accountDetails.accountNumber}</div>
                <div className="text-[#4CAF50] text-lg font-bold">${accountDetails.balance.toFixed(2)}</div>
              </div>
              <span className="text-[#4CAF50] text-xs absolute bottom-1 right-1 sm:static">Active</span>
            </div>
          </div>
          <div className="w-full sm:w-[300px] p-4 bg-[#242D3C] order-2 sm:order-1">
            <div className="text-white text-sm font-semibold mb-3">LIVE ACCOUNT</div>
            <div className="text-gray-400 text-xs mb-3">#{accountDetails.accountNumber}</div>
            {Object.entries(accountDetails).map(([key, value]) => (
              key !== 'accountType' && key !== 'accountNumber' && (
                <div key={key} className="flex items-baseline text-sm mb-2">
                  <span className="text-gray-400 capitalize flex-shrink-0 w-24">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className="flex-grow border-b border-gray-600 border-dotted mx-2"></div>
                  <span className="text-white font-medium flex-shrink-0">
                    {typeof value === 'number' ? `$${value.toFixed(2)}` : (value || '-')}
                  </span>
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
