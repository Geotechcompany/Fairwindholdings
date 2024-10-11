import React from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  accountNumber: string;
  accountHolderName: string;
  bank: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function WithdrawalManagement() {
  const { data: withdrawals, error } = useSWR<Withdrawal[]>('/api/admin/withdrawals', fetcher);

  if (error) {
    toast.error("Failed to load withdrawals");
    return <div>Failed to load withdrawals</div>;
  }

  if (!withdrawals) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#1e2329] text-white p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Withdrawal Management</h1>
      {withdrawals.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-2 px-2">ID</th>
                <th className="pb-2 px-2">User ID</th>
                <th className="pb-2 px-2">Amount</th>
                <th className="pb-2 px-2">Currency</th>
                <th className="pb-2 px-2">Status</th>
                <th className="pb-2 px-2">Date</th>
                <th className="pb-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="border-b border-gray-700">
                  <td className="py-4 px-2">{withdrawal.id.slice(0, 8)}...</td>
                  <td className="py-4 px-2">{withdrawal.userId.slice(0, 8)}...</td>
                  <td className="py-4 px-2">{withdrawal.amount}</td>
                  <td className="py-4 px-2">{withdrawal.currency}</td>
                  <td className="py-4 px-2">{withdrawal.status}</td>
                  <td className="py-4 px-2">{new Date(withdrawal.createdAt).toLocaleString()}</td>
                  <td className="py-4 px-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2 mb-2 sm:mb-0">View</button>
                    <button className="bg-green-500 text-white px-2 py-1 rounded mr-2 mb-2 sm:mb-0">Approve</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No withdrawals found.</p>
      )}
    </div>
  );
}

export default WithdrawalManagement;