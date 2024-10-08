import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface TakeProfitStopLossModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrice: number;
}

const TakeProfitStopLossModal: React.FC<TakeProfitStopLossModalProps> = ({ isOpen, onClose, currentPrice }) => {
  const [takeProfit, setTakeProfit] = useState<number | ''>('');
  const [stopLoss, setStopLoss] = useState<number | ''>('');

  if (!isOpen) return null;

  const handleChange = (setter: React.Dispatch<React.SetStateAction<number | ''>>, value: number) => {
    setter((prev) => {
      const newValue = typeof prev === 'number' ? prev + value : value;
      return Math.max(0, newValue);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-4 w-64">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-white">TAKE PROFIT & STOP LOSS</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Take Profit</label>
            <div className="flex">
              <input
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-gray-700 text-white px-2 py-1 focus:outline-none text-sm"
                step="0.01"
              />
              <div className="flex flex-col ml-1">
                <button type="button" onClick={() => handleChange(setTakeProfit, 0.01)} className="bg-gray-600 text-white px-2 py-0.5 text-xs">+</button>
                <button type="button" onClick={() => handleChange(setTakeProfit, -0.01)} className="bg-gray-600 text-white px-2 py-0.5 text-xs mt-0.5">-</button>
              </div>
            </div>
          </div>
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Stop Loss</label>
            <div className="flex">
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-gray-700 text-white px-2 py-1 focus:outline-none text-sm"
                step="0.01"
              />
              <div className="flex flex-col ml-1">
                <button type="button" onClick={() => handleChange(setStopLoss, 0.01)} className="bg-gray-600 text-white px-2 py-0.5 text-xs">+</button>
                <button type="button" onClick={() => handleChange(setStopLoss, -0.01)} className="bg-gray-600 text-white px-2 py-0.5 text-xs mt-0.5">-</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeProfitStopLossModal;