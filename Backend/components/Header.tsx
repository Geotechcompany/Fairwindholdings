import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-[#1e2329] text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Image 
          src="/images/logo-cita-white.png" 
          alt="Cita-trading-group" 
          width={150} 
          height={40} 
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