import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, Option } from "@/components/ui/select";
import { toast } from 'react-hot-toast';

const AdminTradeCreation: React.FC = () => {
  const [userIdentifier, setUserIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState('id');
  const [instrument, setInstrument] = useState('XAU_USD');
  const [units, setUnits] = useState('');
  const [type, setType] = useState('BUY');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userIdentifier, 
          identifierType,
          instrument, 
          units: parseFloat(units), 
          type,
          openPrice: 0, // You might want to get the current market price here
          status: 'OPEN'
        }),
      });

      if (response.ok) {
        toast.success('Trade created successfully');
        // Reset form
        setUserIdentifier('');
        setUnits('');
      } else {
        const error = await response.json();
        toast.error(`Failed to create trade: ${error.message}`);
      }
    } catch (error) {
      toast.error('An error occurred while creating the trade');
    }
  };

  return (
    <div className="bg-[#1e2329] text-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Create Trade for User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="identifierType" className="block text-sm font-medium text-gray-400">Identifier Type</label>
          <Select
            id="identifierType"
            value={identifierType}
            onValueChange={setIdentifierType}
            className="mt-1"
          >
            <Option value="id">User ID</Option>
            <Option value="email">Email</Option>
          </Select>
        </div>
        <div>
          <label htmlFor="userIdentifier" className="block text-sm font-medium text-gray-400">
            {identifierType === 'id' ? 'User ID' : 'User Email'}
          </label>
          <Input
            id="userIdentifier"
            value={userIdentifier}
            onChange={(e) => setUserIdentifier(e.target.value)}
            className="mt-1 bg-[#2c3035] text-white border-none rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="instrument" className="block text-sm font-medium text-gray-400">Instrument</label>
          <Select
            id="instrument"
            value={instrument}
            onValueChange={setInstrument}
            className="mt-1"
          >
            <Option value="XAU_USD">Gold (XAU/USD)</Option>
            <Option value="EUR_USD">EUR/USD</Option>
            <Option value="GBP_USD">GBP/USD</Option>
          </Select>
        </div>
        <div>
          <label htmlFor="units" className="block text-sm font-medium text-gray-400">Units</label>
          <Input
            id="units"
            type="number"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className="mt-1 bg-[#2c3035] text-white border-none rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-400">Type</label>
          <Select
            id="type"
            value={type}
            onValueChange={setType}
            className="mt-1"
          >
            <Option value="BUY">Buy</Option>
            <Option value="SELL">Sell</Option>
          </Select>
        </div>
        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Create Trade
        </Button>
      </form>
    </div>
  );
};

export default AdminTradeCreation;