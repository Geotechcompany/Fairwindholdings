import React from 'react';
import Image from 'next/image';

interface AccountPanelProps {
  balance: number;
  leverage: string;
  credit: number;
  className?: string;
}

const AccountPanel: React.FC<AccountPanelProps> = ({ balance, leverage, credit, className }) => {
  return (
    <div className={`bg-[#1e2433] rounded-lg p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Account</h3>
        <Image src="/us-flag.png" alt="US Flag" width={24} height={16} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Balance</span>
          <span className="text-green-400">${balance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Leverage</span>
          <span>{leverage}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Credit</span>
          <span className="text-green-400">${credit.toFixed(2)}</span>
        </div>
      </div>
      <button className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded mt-4">
        Trade Now
      </button>
    </div>
  );
};

export default AccountPanel;