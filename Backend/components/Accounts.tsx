import React from 'react';

interface AccountData {
  account: string;
  currency: string;
  balance: number;
  credit: number;
  status: string;
}

const Accounts: React.FC = () => {
  const accounts: AccountData[] = [
    {
      account: '1645519',
      currency: 'USD',
      balance: 0.00,
      credit: 0.00,
      status: 'Active',
    },
    // Add more account data as needed
  ];

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Your Accounts</h1>
      
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="pb-2">ACCOUNT</th>
            <th className="pb-2">CURRENCY</th>
            <th className="pb-2">BALANCE</th>
            <th className="pb-2">CREDIT</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={index} className="border-t border-gray-700">
              <td className="py-4">{account.account}</td>
              <td className="py-4">{account.currency}</td>
              <td className="py-4">${account.balance.toFixed(2)}</td>
              <td className="py-4">${account.credit.toFixed(2)}</td>
              <td className="py-4">
                <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">
                  {account.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Accounts;