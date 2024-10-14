"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Modal from '../Modal';
import Loader from '../Loader';

interface Account {
  id: string;
  userId: string;
  balance: number;
  equity: number;
  leverage: string;
  credit: number;
  status: "ACTIVE" | "DISABLED";
}

const AccountManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/accounts");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      } else {
        toast.error("Failed to fetch accounts");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("An error occurred while fetching accounts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleToggleAccountStatus = async (account: Account) => {
    try {
      const newStatus = account.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
      const response = await fetch(`/api/admin/accounts/${account.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedAccount = await response.json();
        setAccounts(
          accounts.map((acc) =>
            acc.id === updatedAccount.id ? updatedAccount : acc
          )
        );
        toast.success(`Account ${newStatus.toLowerCase()} successfully`);
      } else {
        throw new Error("Failed to update account status");
      }
    } catch (error) {
      console.error("Error updating account status:", error);
      toast.error("Failed to update account status");
    }
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    try {
      const { id, balance, equity, leverage, credit } = selectedAccount;
      const response = await fetch(`/api/admin/accounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance, equity, leverage, credit }),
      });

      if (response.ok) {
        const updatedAccount = await response.json();
        setAccounts(accounts.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
        setSelectedAccount(null);
        setIsModalOpen(false);
        toast.success('Account updated successfully');
      } else {
        throw new Error('Failed to update account');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Account Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full mb-4">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-2">User ID</th>
              <th className="pb-2">Balance</th>
              <th className="pb-2">Equity</th>
              <th className="pb-2">Leverage</th>
              <th className="pb-2">Credit</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className="border-t border-gray-700">
                <td className="py-2">{account.userId}</td>
                <td className="py-2">${account.balance.toFixed(2)}</td>
                <td className="py-2">${account.equity.toFixed(2)}</td>
                <td className="py-2">{account.leverage}</td>
                <td className="py-2">${account.credit.toFixed(2)}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    account.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {account.status}
                  </span>
                </td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 text-sm"
                    onClick={() => handleEditAccount(account)}
                  >
                    Edit
                  </button>
                  <button
                    className={`${
                      account.status === "ACTIVE" ? "bg-red-500" : "bg-green-500"
                    } text-white px-2 py-1 rounded text-sm`}
                    onClick={() => handleToggleAccountStatus(account)}
                  >
                    {account.status === "ACTIVE" ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedAccount && (
          <form onSubmit={handleSaveAccount} className="space-y-4">
            <h3 className="text-xl font-bold mb-2">Edit Account</h3>
            <div>
              <label className="block mb-1">Balance</label>
              <input
                type="number"
                value={selectedAccount.balance}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, balance: parseFloat(e.target.value) })}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Equity</label>
              <input
                type="number"
                value={selectedAccount.equity}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, equity: parseFloat(e.target.value) })}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Leverage</label>
              <input
                type="text"
                value={selectedAccount.leverage}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, leverage: e.target.value })}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Credit</label>
              <input
                type="number"
                value={selectedAccount.credit}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, credit: parseFloat(e.target.value) })}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AccountManagement;