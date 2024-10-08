import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface PendingOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrice: number;
}

const PendingOrderModal: React.FC<PendingOrderModalProps> = ({ isOpen, onClose, currentPrice }) => {
  const [assetPrice, setAssetPrice] = useState<number>(currentPrice);
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    setAssetPrice(currentPrice);
    setIsPending(false);
  }, [currentPrice, isOpen]);

  if (!isOpen) return null;

  const handleChange = (value: number) => {
    const newPrice = Number((assetPrice + value).toFixed(2));
    setAssetPrice(newPrice);
    setIsPending(newPrice !== currentPrice);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);
    setAssetPrice(newPrice);
    setIsPending(newPrice !== currentPrice);
  };

  const revertToMarketPrice = () => {
    setAssetPrice(currentPrice);
    setIsPending(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-4 w-64">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-white">
            {isPending ? 'PENDING' : 'MARKET'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Asset Price</label>
            <div className="flex">
              <input
                type="number"
                value={assetPrice.toFixed(2)}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-2 py-1 focus:outline-none text-sm"
                step="0.01"
              />
              <div className="flex flex-col ml-1">
                <button type="button" onClick={() => handleChange(0.01)} className="bg-gray-600 text-white px-2 py-0.5 text-xs">+</button>
                <button type="button" onClick={() => handleChange(-0.01)} className="bg-gray-600 text-white px-2 py-0.5 text-xs mt-0.5">-</button>
              </div>
            </div>
          </div>
          <button 
            className="w-full bg-gray-700 text-white py-2 text-sm"
            onClick={revertToMarketPrice}
          >
            Revert to Market Price
          </button>
          {isPending && (
            <p className="text-gray-400 text-xs text-center">
              Position will be opened automatically when the price reaches this level
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingOrderModal;