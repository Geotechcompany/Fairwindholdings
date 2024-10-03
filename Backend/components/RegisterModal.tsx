import React, { useState } from "react";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { registerUser } from "@/lib/api/auth";
import { useRouter } from 'next/navigation';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    password: '',
    country: '',
    promoCode: '',
    currency: 'AUD',
  });
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      toast.success("Registration successful!");
      onClose();
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred during registration");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1e2433] p-8 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo-cita-white.png"
            alt="CITA TRADING GROUP"
            width={150}
            height={45}
          />
        </div>
        <h2 className="text-xl font-semibold mb-6 text-white text-center">
          CREATE A NEW ACCOUNT
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-[#2c3035] p-2 rounded text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-[#2c3035] p-2 rounded text-white"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full bg-[#2c3035] p-2 rounded text-white"
                placeholder="First name"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full bg-[#2c3035] p-2 rounded text-white"
                placeholder="Last name"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-[#2c3035] p-2 rounded text-white pr-10"
                placeholder="Your password"
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
          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-1">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="w-full bg-[#2c3035] p-2 rounded text-white"
              placeholder="Your country"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="promoCode" className="block text-sm font-medium text-gray-400 mb-1">
              Promo Code (Optional)
            </label>
            <input
              type="text"
              id="promoCode"
              value={formData.promoCode}
              onChange={(e) => setFormData({...formData, promoCode: e.target.value})}
              className="w-full bg-[#2c3035] p-2 rounded text-white"
              placeholder="Enter promo code"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-400 mb-1">
              Currency
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
              className="w-full bg-[#2c3035] p-2 rounded text-white"
              required
            >
              <option value="AUD">AUD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
          >
            CREATE ACCOUNT
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;