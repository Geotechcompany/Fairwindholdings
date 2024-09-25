import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Savings: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Locked 2 Year');
  const [amount, setAmount] = useState('0');

  const savingsPeriods = [
    { name: 'Flexible', rate: '0.0%' },
    { name: 'Locked 1 Month', rate: '0.0%' },
    { name: 'Locked 1 Quarter', rate: '0.0%' },
    { name: 'Locked 6 Months', rate: '0.0%' },
    { name: 'Locked 1 Year', rate: '0.0%' },
    { name: 'Locked 2 Year', rate: '0.0%' },
  ];

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">SAVINGS</h1>
      
      <h2 className="text-xl font-semibold mb-4">DETAILED INFORMATION</h2>
      
      <div className="flex gap-6">
        <div className="w-1/2">
          <div className="bg-[#2c3035] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                EUR
              </span>
              <span>0 % <FaChevronDown className="inline" /></span>
            </div>
            {savingsPeriods.map((period, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="savingsPeriod"
                    value={period.name}
                    checked={selectedPeriod === period.name}
                    onChange={() => setSelectedPeriod(period.name)}
                    className="mr-2"
                  />
                  {period.name}
                </label>
                <span className="text-green-400">{period.rate}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-1/2">
          <div className="bg-[#2c3035] rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Current Time:</p>
                <p>9/25/2024, 6:23:50 AM</p>
              </div>
              <div>
                <p className="text-gray-400">Release Time:</p>
                <p>9/25/2026, 6:23:50 AM</p>
              </div>
              <div>
                <p className="text-gray-400">Currency Chosen:</p>
                <p>EUR</p>
              </div>
              <div>
                <p className="text-gray-400">Period Chosen:</p>
                <p>{selectedPeriod}</p>
              </div>
              <div>
                <p className="text-gray-400">Your Rate:</p>
                <p className="text-green-400">0.0%</p>
              </div>
              <div>
                <p className="text-gray-400">Your earnings:</p>
                <p>€ 0.000000</p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-1">Account to transfer funds from:</label>
              <select className="w-full bg-[#1e2329] p-2 rounded">
                <option>0.00</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-1">Enter Amount (In EUR):</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#1e2329] p-2 rounded"
              />
            </div>
          </div>
        </div>
      </div>
      
      <button className="mt-6 bg-green-500 text-white font-bold py-2 px-4 rounded">
        Open Savings Account and invest €{amount}
      </button>
    </div>
  );
};

export default Savings;