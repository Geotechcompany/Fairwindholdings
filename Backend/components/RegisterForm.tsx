import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPromoCode, setShowPromoCode] = useState(false);

  return (
    <div className="bg-[#1e2329] p-8 rounded-lg shadow-lg w-[500px]">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
        CREATE A NEW ACCOUNT
        <span className="text-gray-400">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 13C3 17.9706 7.02944 22 12 22C16.9706 22 21 17.9706 21 13C21 8.02944 16.9706 4 12 4C7.02944 4 3 8.02944 3 13Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </h2>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-[#2c3035] text-white rounded p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full bg-[#2c3035] text-white rounded p-2"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full bg-[#2c3035] text-white rounded p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full bg-[#2c3035] text-white rounded p-2"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              className="w-full bg-[#2c3035] text-white rounded p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full bg-[#2c3035] text-white rounded p-2 pr-10"
                required
              />
              <button
                type="button"
                aria-label="Toggle Password Visibility"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="promoCode"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Promo code
            </label>
            <div className="relative">
              <input
                type={showPromoCode ? "text" : "password"}
                id="promoCode"
                className="w-full bg-[#2c3035] text-white rounded p-2 pr-10"
              />
              <button
                type="button"
                aria-label="Toggle Promo Code Visibility"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={() => setShowPromoCode(!showPromoCode)}
              >
                {showPromoCode ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Currency
            </label>
            <select
              id="currency"
              className="w-full bg-[#2c3035] text-white rounded p-2"
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          CREATE ACCOUNT
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
