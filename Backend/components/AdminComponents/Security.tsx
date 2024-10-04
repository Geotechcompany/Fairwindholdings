import React, { useState } from 'react';

const Security: React.FC = () => {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState('');
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  });

  const handleTwoFAToggle = () => {
    setTwoFAEnabled(!twoFAEnabled);
    // Update two-factor authentication settings in the backend
  };

  const handleIpWhitelistChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIpWhitelist(e.target.value);
    // Update IP whitelist in the backend
  };

  const handlePasswordPolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPasswordPolicy({
      ...passwordPolicy,
      [name]: type === 'checkbox' ? checked : parseInt(value, 10),
    });
    // Update password policy in the backend
  };

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Security Settings</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Two-Factor Authentication</h2>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={twoFAEnabled}
            onChange={handleTwoFAToggle}
            className="mr-2"
          />
          Enable Two-Factor Authentication for all users
        </label>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">IP Whitelist</h2>
        <textarea
          value={ipWhitelist}
          onChange={handleIpWhitelistChange}
          placeholder="Enter whitelisted IP addresses (one per line)"
          className="w-full h-32 bg-[#2c3035] p-2 rounded"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Password Policy</h2>
        <div className="space-y-2">
          <label className="flex items-center">
            <span className="mr-2">Minimum Length:</span>
            <input
              type="number"
              name="minLength"
              value={passwordPolicy.minLength}
              onChange={handlePasswordPolicyChange}
              className="bg-[#2c3035] p-1 rounded w-16"
            />
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="requireUppercase"
              checked={passwordPolicy.requireUppercase}
              onChange={handlePasswordPolicyChange}
              className="mr-2"
            />
            Require Uppercase Letters
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="requireLowercase"
              checked={passwordPolicy.requireLowercase}
              onChange={handlePasswordPolicyChange}
              className="mr-2"
            />
            Require Lowercase Letters
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="requireNumbers"
              checked={passwordPolicy.requireNumbers}
              onChange={handlePasswordPolicyChange}
              className="mr-2"
            />
            Require Numbers
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="requireSpecialChars"
              checked={passwordPolicy.requireSpecialChars}
              onChange={handlePasswordPolicyChange}
              className="mr-2"
            />
            Require Special Characters
          </label>
        </div>
      </div>
    </div>
  );
};

export default Security;