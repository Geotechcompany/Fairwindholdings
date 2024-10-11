'use client';

import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface AccountData {
  balance: number;
  leverage: number;
  credit: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

function AccountPanel() {
  const router = useRouter();
  const { data: accountData, error } = useSWR<AccountData>('/api/account', fetcher);

  if (error) {
    toast.error("Failed to load account data");
    return <div>Failed to load account data</div>;
  }

  if (!accountData) {
    return <div>Loading account data...</div>;
  }

  const { balance, leverage, credit } = accountData;

  const handleTradeNow = () => {
    router.push('/trading-dashboard');
  };

  return (
    <div className="bg-[#2c3035] rounded-lg shadow-lg overflow-hidden w-64 animate-pulse-border-green">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-white">Account</h2>
          <div className="flex space-x-2 items-center">
            <FaEnvelope className="text-gray-400 hover:text-white cursor-pointer text-sm" />
            <Image src="/images/us-flag.png" alt="US Flag" width={20} height={13} />
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Balance</span>
            <span className="text-green-400 font-semibold">${balance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Leverage</span>
            <span className="text-white font-semibold">{leverage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Credit</span>
            <span className="text-green-400 font-semibold">${credit.toFixed(2)}</span>
          </div>
        </div>
        <button 
          onClick={handleTradeNow}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-3 rounded mt-3 transition duration-300 text-sm"
        >
          Trade Now
        </button>
      </div>
    </div>
  );
}

export default AccountPanel;