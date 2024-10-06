import Image from 'next/image';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  isAdminDashboard?: boolean;
  className?: string; // Add this line
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  return (
    <header className="bg-[#1e2433] text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-20 border-b border-gray-700">
      <div className="flex items-center">
        <button
          className="lg:hidden text-white mr-4"
          onClick={onOpenMobileSidebar}
        >
          <FaBars size={24} />
        </button>
        <Image 
          src="/images/logo-cita-white.png" 
          alt="Cita-trading-group" 
          width={150} 
          height={40}
          className="hidden lg:block"
        />
      </div>
      <Link href="/trading-dashboard">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Start Trading
        </button>
      </Link>
    </header>
  );
}