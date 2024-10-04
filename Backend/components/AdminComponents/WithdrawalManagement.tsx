import React, { useState, useEffect } from 'react';

interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
}

const WithdrawalManagement: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  useEffect(() => {
    // Fetch withdrawals from API
    // setWithdrawals(fetchedWithdrawals);
  }, []);

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
              <td className="py-4">{withdrawal.date}</td>
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