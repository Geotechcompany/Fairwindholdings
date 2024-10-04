import React, { useState } from 'react';

interface ProfitCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfitCalculatorModal: React.FC<ProfitCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [volume, setVolume] = useState(1000);
  const [entryPrice, setEntryPrice] = useState(2657.15);
  const [takeProfit, setTakeProfit] = useState(2658.15);
  const [stopLoss, setStopLoss] = useState(2656.15);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2c3035] p-6 rounded-lg w-[600px]">
        <h2 className="text-xl font-semibold mb-4 text-white">Profit Calculator</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Volume</label>
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full bg-[#1e2329] p-2 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Entry Price</label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(Number(e.target.value))}
              className="w-full bg-[#1e2329] p-2 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Take Profit</label>
            <input
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(Number(e.target.value))}
              className="w-full bg-[#1e2329] p-2 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Stop Loss</label>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
              className="w-full bg-[#1e2329] p-2 rounded text-white"
            />
          </div>
        </div>
        <div className="mt-4 bg-[#1e2329] p-4 rounded">
          <h3 className="text-lg font-semibold mb-2 text-white">Calculations for Gold</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-400">Leverage</div>
            <div className="text-white">1:50</div>
            <div className="text-gray-400">Required Margin</div>
            <div className="text-white">53143.00 USD</div>
            <div className="text-gray-400">Profit from TP</div>
            <div className="text-white">1000.00 USD</div>
            <div className="text-gray-400">Loss from SL</div>
            <div className="text-white">1000 USD</div>
            <div className="text-gray-400">ROE</div>
            <div className="text-white">+1.88 %</div>
            <div className="text-gray-400">PIP</div>
            <div className="text-white">10 USD</div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfitCalculatorModal;