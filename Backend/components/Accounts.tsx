'use client';

import React from 'react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';
import Loader from './Loader';

interface AccountData {
  id: string;
  balance: number;
  credit: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

const Accounts: React.FC = () => {
  const { data, error } = useSWR<AccountData>('/api/account/details', fetcher);

  if (error) {
    toast.error("Failed to load account data");
    return <div>Failed to load account data</div>;
  }

  if (!data) {
    return <Loader />;
  }

  return (
    <div className="bg-[#1e2329] text-white p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">ACCOUNTS</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-2 pr-2">ID</th>
              <th className="pb-2 px-2">CURRENCY</th>
              <th className="pb-2 px-2">BALANCE</th>
              <th className="pb-2 px-2">CREDIT</th>
              <th className="pb-2 pl-2">STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-700">
              <td className="py-4 pr-2 break-all">{data.id}</td>
              <td className="py-4 px-2">AUD</td>
              <td className="py-4 px-2">${data.balance.toFixed(2)}</td>
              <td className="py-4 px-2">${data.credit.toFixed(2)}</td>
              <td className="py-4 pl-2">
                <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs whitespace-nowrap">
                  Active
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounts;