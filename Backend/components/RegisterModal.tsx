import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { registerUser } from "@/lib/api/auth";

interface RegisterModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isStandalone?: boolean;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  isStandalone = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    password: '',
    country: '',
    promoCode: '',
    currency: 'AUD', // Defaulting to AUD, can be changed by user
  });

  if (!isOpen && !isStandalone) return null; // Close modal if not open

  const handleClose = () => {
    if (onClose && !isStandalone) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      toast.success("Registration successful!");
      handleClose(); // Close modal after successful registration
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred during registration");
      }
    }
  };

  const modalContent = (
    <div className="bg-[#1e2329] p-8 rounded-lg shadow-lg w-[500px] max-w-full">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
        CREATE A NEW ACCOUNT
        <button onClick={handleClose} className="text-gray-400 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email and Phone */}
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
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
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
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-[#2c3035] text-white rounded p-2"
              required
            />
          </div>
        </div>

        {/* First Name and Last Name */}
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
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
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
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full bg-[#2c3035] text-white rounded p-2"
              required
            />
          </div>
        </div>

        {/* Country and Password */}
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
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
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
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-[#2c3035] text-white rounded p-2 pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        {/* Promo Code and Currency */}
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
                value={formData.promoCode}
                onChange={(e) => setFormData({...formData, promoCode: e.target.value})}
                className="w-full bg-[#2c3035] text-white rounded p-2 pr-10"
              />
              <button
                type="button"
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
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
              className="w-full bg-[#2c3035] text-white rounded p-2"
              required
            >
              <option value="AUD">AUD</option>
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
      {modalContent}
    </div>
  );
};

export default RegisterModal;
