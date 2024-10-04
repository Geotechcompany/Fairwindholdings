import React, { useState } from 'react';

const SystemSettings: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxLeverage, setMaxLeverage] = useState(100);
  const [minDeposit, setMinDeposit] = useState(100);

  const handleSaveSettings = () => {
    // Save settings to backend
    console.log('Settings saved:', { maintenanceMode, maxLeverage, minDeposit });
  };

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      <div className="space-y-4">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="mr-2"
            />
            Maintenance Mode
          </label>
        </div>
        <div>
          <label className="block mb-2">Max Leverage</label>
          <input
            type="number"
            value={maxLeverage}
            onChange={(e) => setMaxLeverage(Number(e.target.value))}
            className="bg-[#2c3035] p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Minimum Deposit</label>
          <input
            type="number"
            value={minDeposit}
            onChange={(e) => setMinDeposit(Number(e.target.value))}
            className="bg-[#2c3035] p-2 rounded w-full"
          />
        </div>
        <button
          onClick={handleSaveSettings}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;