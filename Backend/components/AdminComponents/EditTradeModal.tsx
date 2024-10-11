import React, { useState } from "react";
import { Trade } from "@/types/trade";

interface EditTradeModalProps {
  trade: Trade;
  onSave: (updatedTrade: Trade) => void;
  onClose: () => void;
}

const EditTradeModal: React.FC<EditTradeModalProps> = ({
  trade,
  onSave,
  onClose,
}) => {
  const [editedTrade, setEditedTrade] = useState<Trade>(trade);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTrade((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTrade);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#2c3035] p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Trade</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="instrument"
            >
              Instrument
            </label>
            <input
              type="text"
              id="instrument"
              name="instrument"
              value={editedTrade.instrument}
              onChange={handleChange}
              className="w-full p-2 bg-[#1e2329] rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="type">
              Type
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={editedTrade.type}
              onChange={handleChange}
              className="w-full p-2 bg-[#1e2329] rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="units">
              Volume
            </label>
            <input
              type="number"
              id="units"
              name="units"
              value={editedTrade.units}
              onChange={handleChange}
              className="w-full p-2 bg-[#1e2329] rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="openPrice">
              Open Price
            </label>
            <input
              type="number"
              id="openPrice"
              name="openPrice"
              value={editedTrade.openPrice}
              onChange={handleChange}
              className="w-full p-2 bg-[#1e2329] rounded"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="closePrice"
            >
              Close Price
            </label>
            <input
              type="number"
              id="closePrice"
              name="closePrice"
              value={editedTrade.closePrice || ""}
              onChange={handleChange}
              className="w-full p-2 bg-[#1e2329] rounded"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="profitLoss"
            >
              Profit/Loss
            </label>
            <input
              type="number"
              id="profitLoss"
              name="profitLoss"
              value={editedTrade.profitLoss || ""}
              onChange={handleChange}
              className="w-full p-2 bg-[#1e2329] rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTradeModal;
