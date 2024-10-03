import React from 'react';
import { IconType } from 'react-icons';
import { FaIdCard, FaHome, FaCreditCard, FaUser } from 'react-icons/fa';

interface UploadAreaProps {
  icon: IconType;
  title: string;
  description: string;
}

const UploadArea: React.FC<UploadAreaProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-[#1e2433] rounded-lg p-4 flex flex-col items-center justify-center h-40">
    <Icon className="text-3xl text-gray-400 mb-2" />
    <h3 className="text-sm font-semibold mb-1">{title}</h3>
    <p className="text-xs text-gray-400 text-center">{description}</p>
  </div>
);

const Verification: React.FC = () => {
  return (
    <div className="bg-[#1e2433] p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Verification</h2>
      <div className="grid grid-cols-2 gap-4">
        <UploadArea
          icon={FaIdCard}
          title="ID Card"
          description="Upload a clear image of your ID card"
        />
        <UploadArea
          icon={FaHome}
          title="Proof of Address"
          description="Upload a recent utility bill or bank statement"
        />
        <UploadArea
          icon={FaCreditCard}
          title="Credit Card"
          description="Upload a clear image of your credit card (front only)"
        />
        <UploadArea
          icon={FaUser}
          title="Selfie"
          description="Upload a clear selfie holding your ID card"
        />
      </div>
    </div>
  );
};

export default Verification;