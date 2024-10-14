"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import Loader from './Loader';

const withdrawalSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  bank: z.string().min(1, "Bank name is required"),
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

interface WithdrawalData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

const Withdrawal: React.FC = () => {
  const { user } = useUser();
  const [withdrawals, setWithdrawals] = useState<WithdrawalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
  });

  useEffect(() => {
    if (user) {
      fetchWithdrawals();
    }
  }, [user]);

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/withdrawals");
      if (!response.ok) {
        throw new Error("Failed to fetch withdrawals");
      }
      const data = await response.json();
      setWithdrawals(data);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      toast.error("Failed to fetch withdrawals");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: WithdrawalFormData) => {
    try {
      const response = await fetch("/api/withdrawals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit withdrawal request: ${errorText}`);
      }

      toast.success("Withdrawal request submitted successfully");
      reset();
      fetchWithdrawals();
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to submit withdrawal request: ${errorMessage}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">WITHDRAWAL</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block mb-1">
              Amount (AUD)
            </label>
            <input
              type="number"
              id="amount"
              {...register("amount", { valueAsNumber: true })}
              className="w-full p-2 bg-[#2c3035] rounded"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="accountNumber" className="block mb-1">
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              {...register("accountNumber")}
              className="w-full p-2 bg-[#2c3035] rounded"
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.accountNumber.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="accountHolderName" className="block mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              id="accountHolderName"
              {...register("accountHolderName")}
              className="w-full p-2 bg-[#2c3035] rounded"
            />
            {errors.accountHolderName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.accountHolderName.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="bank" className="block mb-1">
              Bank Name
            </label>
            <input
              type="text"
              id="bank"
              {...register("bank")}
              className="w-full p-2 bg-[#2c3035] rounded"
            />
            {errors.bank && (
              <p className="text-red-500 text-sm mt-1">{errors.bank.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Submit Withdrawal Request
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Withdrawal Requests</h2>
        {isLoading ? (
          <Loader />
        ) : withdrawals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Currency</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-gray-700">
                    <td className="px-4 py-2">
                      {new Date(withdrawal.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{withdrawal.amount}</td>
                    <td className="px-4 py-2">{withdrawal.currency}</td>
                    <td className="px-4 py-2">
                      <Badge
                        className={`${getStatusColor(
                          withdrawal.status
                        )} text-white`}
                      >
                        {withdrawal.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No withdrawal requests found.</p>
        )}
      </div>
    </div>
  );
};

export default Withdrawal;