import React, { useState } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

// Define the schema for withdrawal form validation
const withdrawalSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  bank: z.string().min(1, "Bank is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  iban: z.string().min(1, "IBAN is required"),
  swiftCode: z.string().min(1, "SWIFT code is required"),
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

interface WithdrawalRequest {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  accountNumber: string;
  accountHolderName: string;
  bank: string;
}

const Withdrawal: React.FC = () => {
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetcher = async (url: string) => {
    const token = await getToken();
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    return res.json();
  };

  const {
    data: withdrawalRequests,
    error,
    mutate,
  } = useSWR<WithdrawalRequest[]>("/api/user-withdrawals", fetcher);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
  });

  const onSubmit = async (data: WithdrawalFormData) => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Withdrawal request submitted successfully");
        reset();
        mutate();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to submit withdrawal request");
      }
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      toast.error("An error occurred while submitting the request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    toast.error("Failed to load withdrawal requests");
  }

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

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : "Request Withdrawal"}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">YOUR WITHDRAWAL REQUESTS</h2>
        {error ? (
          <p className="text-red-500">Error loading withdrawal requests.</p>
        ) : !withdrawalRequests ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading withdrawal requests...</span>
          </div>
        ) : withdrawalRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Currency</th>
                  <th className="pb-2">Bank</th>
                  <th className="pb-2">Account Number</th>
                  <th className="pb-2">Account Holder</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalRequests.map((request) => (
                  <tr key={request.id} className="border-t border-gray-700">
                    <td className="py-2">
                      {format(new Date(request.createdAt), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td className="py-2">{request.amount}</td>
                    <td className="py-2">{request.currency}</td>
                    <td className="py-2">{request.bank}</td>
                    <td className="py-2">{request.accountNumber}</td>
                    <td className="py-2">{request.accountHolderName}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-500 text-black">
                        {request.status}
                      </span>
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