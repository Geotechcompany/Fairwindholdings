import React, { useState } from 'react';
import { FaCloud, FaWallet, FaCreditCard, FaEllipsisH } from 'react-icons/fa';

const Deposit: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('Crypto');
  const [selectedCrypto, setSelectedCrypto] = useState('Bitcoin');

  const depositMethods = [
    { name: 'Crypto', icon: <FaCloud />, time: '5-10 minutes' },
    { name: 'XRP Wallet', icon: <FaWallet />, time: '5-10 minutes' },
    { name: 'Credit/Debit Card co-ext', icon: <FaCreditCard />, time: '5-10 minutes' },
    { name: 'Other', icon: <FaEllipsisH />, time: '5-10 minutes' },
  ];

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">DEPOSIT</h1>
      
      <div className="flex gap-6">
        <div className="w-1/3">
          <h2 className="text-xl font-semibold mb-4">METHODS</h2>
          <div className="bg-[#2c3035] rounded-lg">
            {depositMethods.map((method, index) => (
              <button
                key={index}
                className={`flex items-center w-full p-4 ${
                  selectedMethod === method.name ? 'bg-[#3a3f45]' : ''
                } hover:bg-[#3a3f45] transition-colors duration-200`}
                onClick={() => setSelectedMethod(method.name)}
              >
                <span className="text-2xl mr-3">{method.icon}</span>
                <div className="text-left">
                  <p>{method.name}</p>
                  <p className="text-sm text-gray-400">{method.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="w-2/3">
          <h2 className="text-xl font-semibold mb-4">CHOOSE CRYPTOCURRENCY</h2>
          <button
            className="bg-green-500 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={() => setSelectedCrypto('Bitcoin')}
          >
            Bitcoin
          </button>
          <div className="bg-[#2c3035] rounded-lg p-4 h-64 flex items-center justify-center">
            <p className="text-gray-400">Please wait for the address to load</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">LAST 0 DEPOSITS</h2>
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
            {/* Add table rows here when deposits are made */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deposit;