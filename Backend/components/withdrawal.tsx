import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";

const withdrawalSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  bank: z.string().min(1, "Bank is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  iban: z.string().min(1, "IBAN is required"),
  swiftCode: z.string().min(1, "SWIFT code is required"),
  email: z.string().email("Invalid email address"), // Add this line
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

interface WithdrawalData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  bank: string;
  accountNumber: string;
  accountHolderName: string;
}

const Withdrawal: React.FC = () => {
  const { user } = useUser();
  const [withdrawals, setWithdrawals] = useState<WithdrawalData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          email: user?.primaryEmailAddress?.emailAddress, // Add this line
        }),
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
      if (error instanceof Error) {
        toast.error(`Failed to submit withdrawal request: ${error.message}`);
      } else {
        toast.error("An unknown error occurred while submitting the withdrawal request");
      }
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
    <div className="p-6 bg-[#1e2329] text-white">
      <h1 className="text-2xl font-bold mb-6">WITHDRAWAL</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">REQUEST A NEW WITHDRAWAL</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              {...register("amount", { valueAsNumber: true })}
              className="w-full p-2 bg-[#2a2f35] rounded"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="bank" className="block mb-1">
              Bank
            </label>
            <input
              type="text"
              id="bank"
              {...register("bank")}
              className="w-full p-2 bg-[#2a2f35] rounded"
            />
            {errors.bank && (
              <p className="text-red-500 text-sm mt-1">{errors.bank.message}</p>
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
              className="w-full p-2 bg-[#2a2f35] rounded"
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
              className="w-full p-2 bg-[#2a2f35] rounded"
            />
            {errors.accountHolderName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.accountHolderName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="iban" className="block mb-1">
              IBAN
            </label>
            <input
              type="text"
              id="iban"
              {...register("iban")}
              className="w-full p-2 bg-[#2a2f35] rounded"
            />
            {errors.iban && (
              <p className="text-red-500 text-sm mt-1">{errors.iban.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="swiftCode" className="block mb-1">
              SWIFT Code
            </label>
            <input
              type="text"
              id="swiftCode"
              {...register("swiftCode")}
              className="w-full p-2 bg-[#2a2f35] rounded"
            />
            {errors.swiftCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.swiftCode.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
              readOnly
              className="w-full p-2 bg-[#2a2f35] rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Request Withdrawal
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Withdrawal Requests</h2>
        {isLoading ? (
          <p>Loading withdrawals...</p>
        ) : withdrawals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Currency</th>
                  <th className="px-4 py-2 text-left">Bank</th>
                  <th className="px-4 py-2 text-left">Account Number</th>
                  <th className="px-4 py-2 text-left">Account Holder</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-gray-700">
                    <td className="px-4 py-2">
                      {format(new Date(withdrawal.createdAt), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td className="px-4 py-2">{withdrawal.amount}</td>
                    <td className="px-4 py-2">{withdrawal.currency}</td>
                    <td className="px-4 py-2">{withdrawal.bank}</td>
                    <td className="px-4 py-2">{withdrawal.accountNumber}</td>
                    <td className="px-4 py-2">{withdrawal.accountHolderName}</td>
                    <td className="px-4 py-2">
                      <Badge className={`${getStatusColor(withdrawal.status)} text-white`}>
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