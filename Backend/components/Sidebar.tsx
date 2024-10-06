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
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onNavigate: (view: string) => void;
  userData: {
    profileImage?: string;
    firstName?: string;
    fullName?: string;
    email?: string;
  };
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  onNavigate,
  userData,
  className,
}) => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const navigationItems = [
    { name: "Dashboard", icon: FaChartLine, view: "dashboard" },
    { name: "Withdrawal", icon: FaMoneyBillWave, view: "withdrawal" },
    { name: "Verification", icon: FaIdCard, view: "verification" },
    { name: "Accounts", icon: FaUserCircle, view: "accounts" },
    { name: "Live Chat", icon: FaComments, view: "live-chat" },
    { name: "Savings", icon: FaPiggyBank, view: "savings" },
    { name: "Settings", icon: FaCog, view: "settings" },
  ];

  return (
    <div
      className={`bg-[#1e2433] text-white flex flex-col w-64 pt-20 ${className}`}
    >
      {/* Profile section */}
      <div className="flex flex-col items-center mb-6 mt-4">
        <Image
          src={userData.profileImage}
          alt="Profile"
          width={80}
          height={80}
          className="rounded-full mb-2"
        />
        <h2 className="text-lg font-semibold">{userData.fullName}</h2>
        <p className="text-sm text-gray-400">{userData.email}</p>
      </div>
      {/* Deposit button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => onNavigate("deposit")}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-3/4 text-lg"
        >
          Deposit
        </button>
      </div>
      {/* Navigation links */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.view} className="flex justify-center">
              <button
                onClick={() => onNavigate(item.view)}
                className="flex items-center w-3/4 py-3 px-4 hover:bg-[#3a3f45] transition-colors duration-200 text-xl rounded"
              >
                <item.icon className="mr-4 text-2xl" /> {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="pb-4 pt-4 md:pt-24 flex justify-center">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#3a3f45] transition-colors duration-200 text-xl w-3/4 py-3 px-4 rounded"
        >
          <FaSignOutAlt className="mr-4 text-2xl" /> Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
