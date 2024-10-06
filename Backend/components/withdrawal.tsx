import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { z } from "zod";
import { getWithdrawals, postWithdrawal } from "@/lib/api/route";
import crypto from "crypto"; // Import crypto for random UUID generation

const withdrawalSchema = z.object({
  amount: z.number().positive(),
  currency: z.string(), // Add this line if not already present
  withdrawalMethod: z.string().min(1),
  accountNumber: z.string().min(1),
  accountHolderName: z.string().min(1),
  iban: z.string().optional(),
  swiftCode: z.string().optional(),
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

interface WithdrawalRequest {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

function Withdrawal() {
  const [formData, setFormData] = useState<WithdrawalFormData>({
    amount: 0,
    currency: "USD",
    withdrawalMethod: "Bank",
    accountNumber: "",
    accountHolderName: "",
    iban: "",
    swiftCode: "",
  });
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WithdrawalRequest[]
  >([]);

  useEffect(() => {
    fetchWithdrawalRequests();
  }, []);

  async function fetchWithdrawalRequests() {
    try {
      const data = await getWithdrawals();
      setWithdrawalRequests(data);
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      toast.error("Failed to load withdrawal requests");
    }
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  }

  async function handleWithdrawalRequest(e: React.FormEvent) {
    e.preventDefault();

    try {
      const validatedData = withdrawalSchema.parse(formData);
      await postWithdrawal({
        ...validatedData,
        id: crypto.randomUUID(),
        status: "PENDING",
        createdAt: new Date().toISOString(),
        iban: "", // Provide a default value or ensure it's set before this point
        swiftCode: "", // Provide a default value or ensure it's set before this point
      });
      toast.success("Withdrawal request submitted successfully");
      setFormData({
        amount: 0,
        currency: "USD",
        withdrawalMethod: "Bank",
        accountNumber: "",
        accountHolderName: "",
        iban: "",
        swiftCode: "",
      });
      fetchWithdrawalRequests();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error("Error submitting withdrawal request:", error);
        toast.error(
          "An error occurred while submitting the withdrawal request"
        );
      }
    }
  }

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">WITHDRAWAL</h1>

      <h2 className="text-xl font-semibold mb-4">REQUEST A NEW WITHDRAWAL</h2>
      <form onSubmit={handleWithdrawalRequest}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm text-gray-400 mb-1"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full bg-[#2c3035] p-2 rounded"
              required
            />
          </div>
          <div>
            <label
              htmlFor="withdrawalMethod"
              className="block text-sm text-gray-400 mb-1"
            >
              Withdrawal Details
            </label>
            <select
              id="withdrawalMethod"
              name="withdrawalMethod"
              value={formData.withdrawalMethod}
              onChange={handleInputChange}
              className="w-full bg-[#2c3035] p-2 rounded"
            >
              <option value="Bank">Bank</option>
              {/* Add other withdrawal methods as needed */}
            </select>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">WITHDRAWAL DETAILS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm text-gray-400 mb-1"
            >
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className="w-full bg-[#2c3035] p-2 rounded"
              required
            />
          </div>
          <div>
            <label
              htmlFor="accountHolderName"
              className="block text-sm text-gray-400 mb-1"
            >
              Account Holder Name
            </label>
            <input
              type="text"
              id="accountHolderName"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleInputChange}
              className="w-full bg-[#2c3035] p-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="iban" className="block text-sm text-gray-400 mb-1">
              IBAN
            </label>
            <input
              type="text"
              id="iban"
              name="iban"
              value={formData.iban}
              onChange={handleInputChange}
              className="w-full bg-[#2c3035] p-2 rounded"
            />
          </div>
          <div>
            <label
              htmlFor="swiftCode"
              className="block text-sm text-gray-400 mb-1"
            >
              Bank SWIFT code
            </label>
            <input
              type="text"
              id="swiftCode"
              name="swiftCode"
              value={formData.swiftCode}
              onChange={handleInputChange}
              className="w-full bg-[#2c3035] p-2 rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white font-bold py-2 px-4 rounded"
        >
          Request Withdrawal
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-8 mb-4">WITHDRAWAL REQUESTS</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-2">TIME</th>
              <th className="pb-2">AMOUNT</th>
              <th className="pb-2">CURRENCY</th>
              <th className="pb-2">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {withdrawalRequests.map((request) => (
              <tr key={request.id}>
                <td>
                  {format(new Date(request.createdAt), "dd/MM/yyyy HH:mm")}
                </td>
                <td>{request.amount.toFixed(2)}</td>
                <td>{request.currency}</td>
                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Withdrawal;
