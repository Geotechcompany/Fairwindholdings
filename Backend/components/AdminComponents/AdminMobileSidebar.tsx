import React from "react";
import { FaTimes } from "react-icons/fa";
import AdminSidebar from "../AdminSidebar";
import Image from "next/image";

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

const AdminMobileSidebar: React.FC<AdminMobileSidebarProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`absolute top-0 left-0 w-64 h-full bg-[#2c3035] transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <Image
            src="/images/logo-cita-white.png"
            alt="Cita-trading-group"
            width={120}
            height={32}
          />
          <button onClick={onClose} className="text-white">
            <FaTimes size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          <AdminSidebar onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

export default AdminMobileSidebar;