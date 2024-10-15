"use client";

import React from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';
import Loader from '../Loader';

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
  const { data: withdrawals, error, mutate } = useSWR<Withdrawal[]>('/api/admin/withdrawals', fetcher);

  if (error) {
    toast.error("Failed to load withdrawals");
    return <div>Failed to load withdrawals</div>;
  }

  if (!withdrawals) {
    return <Loader />;
  }

  async function handleStatusChange(
    withdrawalId: string,
    newStatus: "APPROVED" | "REJECTED"
  ) {
    try {
      const response = await fetch(`/api/admin/withdrawals/${withdrawalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ withdrawalId, newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update withdrawal status');
      }

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        // Refresh the withdrawals data
        mutate();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
      toast.error('Failed to update withdrawal status');
    }
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
                  <td className="py-4 px-2">{withdrawal.id}</td>
                  <td className="py-4 px-2">{withdrawal.userId}</td>
                  <td className="py-4 px-2">{withdrawal.amount}</td>
                  <td className="py-4 px-2">{withdrawal.currency}</td>
                  <td className="py-4 px-2">{withdrawal.status}</td>
                  <td className="py-4 px-2">{new Date(withdrawal.createdAt).toLocaleString()}</td>
                  <td className="py-4 px-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2 mb-2 sm:mb-0">View</button>
                    <button 
                      onClick={() => handleStatusChange(withdrawal.id, "APPROVED")}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2 mb-2 sm:mb-0"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleStatusChange(withdrawal.id, "REJECTED")}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
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