import React, { useState } from 'react';
import Image from 'next/image';

const Settings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const currencies = [
    { code: 'AUD', flag: '🇦🇺' },
    { code: 'BTC', flag: '₿' },
    { code: 'CAD', flag: '🇨🇦' },
    { code: 'ETH', flag: 'Ξ' },
    { code: 'EUR', flag: '🇪🇺' },
    { code: 'GBP', flag: '🇬🇧' },
    { code: 'PLN', flag: '🇵🇱' },
    { code: 'RUB', flag: '🇷🇺' },
    { code: 'USD', flag: '🇺🇸' },
  ];

  const languages = [
    'English', 'Русский', 'Polski', 'Čeština', 'Deutsch', 
    'Française', 'Español', 'Dansk', 'Nederlands', 'Arabic'
  ];

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change logic here
    console.log('Password change requested');
  };

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">SETTINGS</h1>
      
      <div className="bg-[#2c3035] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">UPDATE PASSWORD</h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#1e2329] p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#1e2329] p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#1e2329] p-2 rounded"
            />
          </div>
          <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded">
            Change Password
          </button>
        </form>
      </div>

      <div className="bg-[#2c3035] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">DASHBOARD CURRENCY</h2>
        <div className="flex flex-wrap gap-2">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => setSelectedCurrency(currency.code)}
              className={`flex items-center space-x-2 px-3 py-2 rounded ${
                selectedCurrency === currency.code ? 'bg-blue-500' : 'bg-[#1e2329]'
              }`}
            >
              <span>{currency.flag}</span>
              <span>{currency.code}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#2c3035] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">LANGUAGE</h2>
        <div className="flex flex-wrap gap-2">
          {languages.map((language) => (
            <button
              key={language}
              onClick={() => setSelectedLanguage(language)}
              className={`px-3 py-2 rounded ${
                selectedLanguage === language ? 'bg-blue-500' : 'bg-[#1e2329]'
              }`}
            >
              {language}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;