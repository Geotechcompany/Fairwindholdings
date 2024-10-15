import React from "react";
import { FaTimes } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Image from "next/image";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  userData: any;
  className?: string; // Add this line

}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  onNavigate,
  userData,
}) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`absolute top-0 left-0 w-72 h-full bg-[#1e2433] transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <Image
            src="/images/cita_white logo.png"
            alt="Cita-trading-group"
            width={120}
            height={32}
          />
          <button onClick={onClose} className="text-white">
            <FaTimes size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          <Sidebar
            onNavigate={onNavigate}
            userData={userData}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
