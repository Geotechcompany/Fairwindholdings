import React from "react";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  FaChartLine,
  FaUser,
  FaMoneyBillWave,
  FaIdCard,
  FaUserCircle,
  FaComments,
  FaPiggyBank,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

interface UserData {
  firstName: string;
  fullName: string;
  email: string;
  profileImage: string;
}

interface SidebarProps {
  onNavigate: (view: string) => void;
  userData: UserData;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, userData }) => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="bg-[#2c3035] text-white h-full w-64 flex flex-col">
      <div className="p-4 flex flex-col items-center">
        {userData.profileImage ? (
          <Image
            src={userData.profileImage}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full mb-2"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-600 rounded-full mb-2 flex items-center justify-center">
            <span className="text-2xl">{userData.firstName?.charAt(0) || 'U'}</span>
          </div>
        )}
        <span className="text-sm font-semibold">{userData.fullName || 'User'}</span>
        <span className="text-xs text-gray-400">{userData.email || 'No email'}</span>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onNavigate("dashboard")}
              className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
            >
              <FaChartLine className="mr-3" /> Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate("verification")}
              className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
            >
              <FaIdCard className="mr-3" /> Verification
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate("personal-info")}
              className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
            >
              <FaUser className="mr-3" /> Personal Info
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate("withdrawal")}
              className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
            >
              <FaMoneyBillWave className="mr-3" /> Withdrawal
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate("accounts")}
              className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
            >
              <FaUserCircle className="mr-3" /> Accounts
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate("live-chat")}
              className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
            >
              <FaComments className="mr-3" /> Live Chat
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate("savings")}
              className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
            >
              <FaPiggyBank className="mr-3" /> Savings
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate("settings")}
              className="flex items-center w-full py-2 px-4 hover:bg-[#3a3f45] transition-colors duration-200"
            >
              <FaCog className="mr-3" /> Settings
            </button>
          </li>
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center py-4 text-gray-400 hover:text-white hover:bg-[#3a3f45] transition-colors duration-200"
      >
        <FaSignOutAlt className="mr-3" /> Log Out
      </button>
    </div>
  );
};

export default Sidebar;