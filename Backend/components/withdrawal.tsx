import React, { useState } from 'react';

const Withdrawal: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [iban, setIban] = useState('');
  const [swiftCode, setSwiftCode] = useState('');

  const handleWithdrawalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle withdrawal request logic here
    console.log('Withdrawal requested');
  };

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">WITHDRAWAL</h1>
      
      <h2 className="text-xl font-semibold mb-4">REQUEST A NEW WITHDRAWAL</h2>
      <form onSubmit={handleWithdrawalRequest}>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#2c3035] p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Withdrawal Details</label>
            <select
              value={withdrawalMethod}
              onChange={(e) => setWithdrawalMethod(e.target.value)}
              className="w-full bg-[#2c3035] p-2 rounded"
            >
              <option value="Bank">Bank</option>
              {/* Add other withdrawal methods as needed */}
            </select>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">WITHDRAWAL DETAILS</h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full bg-[#2c3035] p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account Holder Name</label>
            <input
              type="text"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              className="w-full bg-[#2c3035] p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">IBAN</label>
            <input
              type="text"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="w-full bg-[#2c3035] p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bank SWIFT code</label>
            <input
              type="text"
              value={swiftCode}
              onChange={(e) => setSwiftCode(e.target.value)}
              className="w-full bg-[#2c3035] p-2 rounded"
              required
            />
          </div>
        </div>

        <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded">
          Request Withdrawal
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-8 mb-4">WITHDRAWAL REQUESTS</h3>
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
          {/* Add table rows here when withdrawal requests are made */}
        </tbody>
      </table>
    </div>
  );
};

export default Withdrawal;