import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface OrdersDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

const OrdersDropdown: React.FC<OrdersDropdownProps> = ({ isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const renderActiveOrders = () => (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-gray-400">
          <th className="text-left p-1">Symbol</th>
          <th className="text-left p-1">ID</th>
          <th className="text-left p-1">Type</th>
          <th className="text-left p-1">Volume</th>
          <th className="text-left p-1">Open Price</th>
          <th className="text-left p-1">Open Time</th>
          <th className="text-left p-1">SL</th>
          <th className="text-left p-1">TP</th>
          <th className="text-left p-1">Price</th>
          <th className="text-left p-1">Commission</th>
          <th className="text-left p-1">Swap</th>
          <th className="text-left p-1">PnL</th>
          <th className="text-left p-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        {/* Add rows for active orders here */}
      </tbody>
    </table>
  );

  const renderOrdersHistory = () => (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-gray-400">
          <th className="text-left p-1">Symbol</th>
          <th className="text-left p-1">ID</th>
          <th className="text-left p-1">Type</th>
          <th className="text-left p-1">Volume</th>
          <th className="text-left p-1">Open Price</th>
          <th className="text-left p-1">Open Time</th>
          <th className="text-left p-1">Close Price</th>
          <th className="text-left p-1">Close Time</th>
          <th className="text-left p-1">Commission</th>
          <th className="text-left p-1">Swap</th>
          <th className="text-left p-1">PnL</th>
        </tr>
      </thead>
      <tbody>
        {/* Add rows for order history here */}
      </tbody>
    </table>
  );

  return (
    <div className="bg-gray-800 text-white">
      <div className="flex items-center justify-between p-1 bg-gray-700">
        <div className="flex">
          <button
            className={`py-1 px-2 text-xs font-medium ${activeTab === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'} rounded-l`}
            onClick={() => setActiveTab('active')}
          >
            ACTIVE ORDERS
          </button>
          <button
            className={`py-1 px-2 text-xs font-medium ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'} rounded-r`}
            onClick={() => setActiveTab('history')}
          >
            ORDERS HISTORY
          </button>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-300 hover:text-white"
        >
          {isOpen ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
        </button>
      </div>
      {isOpen && (
        <div className="p-1 overflow-x-auto max-w-full">
          <div className="min-w-max">
            {activeTab === 'active' ? renderActiveOrders() : renderOrdersHistory()}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersDropdown;