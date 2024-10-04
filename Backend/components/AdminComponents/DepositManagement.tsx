import React, { useState, useEffect } from 'react';

interface Deposit {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
}

const DepositManagement: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  useEffect(() => {
    // Fetch deposits from API
    // setDeposits(fetchedDeposits);
  }, []);

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Deposit Management</h1>
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
          {deposits.map((deposit) => (
            <tr key={deposit.id} className="border-t border-gray-700">
              <td className="py-4">{deposit.id}</td>
              <td className="py-4">{deposit.userId}</td>
              <td className="py-4">{deposit.amount}</td>
              <td className="py-4">{deposit.currency}</td>
              <td className="py-4">{deposit.status}</td>
              <td className="py-4">{deposit.date}</td>
              <td className="py-4">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">View</button>
                <button className="bg-green-500 text-white px-2 py-1 rounded">Approve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepositManagement;