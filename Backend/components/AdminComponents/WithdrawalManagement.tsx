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
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const WithdrawalManagement: React.FC = () => {
  const { data, error } = useSWR<Withdrawal[] | { error: string }>('/api/admin/withdrawals', fetcher);

  if (error) {
    toast.error("Failed to load withdrawals");
    return <div>Failed to load withdrawals</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  if ('error' in data) {
    toast.error(data.error);
    return <div>{data.error}</div>;
  }

  const withdrawals = Array.isArray(data) ? data : [];

  if (withdrawals.length === 0) {
    return <div>No withdrawals found</div>;
  }

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Withdrawal Management</h1>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="pb-2">ID</th>
            <th className="pb-2">User ID</th>
            <th className="pb-2">Amount</th>
            <th className="pb-2">Currency</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Date</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((withdrawal) => (
            <tr key={withdrawal.id} className="border-t border-gray-700">
              <td className="py-4">{withdrawal.id}</td>
              <td className="py-4">{withdrawal.userId}</td>
              <td className="py-4">{withdrawal.amount}</td>
              <td className="py-4">{withdrawal.currency}</td>
              <td className="py-4">{withdrawal.status}</td>
              <td className="py-4">{new Date(withdrawal.createdAt).toLocaleString()}</td>
              <td className="py-4">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">View</button>
                <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">Approve</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawalManagement;
