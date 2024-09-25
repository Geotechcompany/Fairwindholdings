import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-[#1e2329] text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Image src="/images/logo-cita-white.png" alt="Cita-trading-group" width={150} height={40} />
      
      </div>
      <button className="bg-[#4caf50] hover:bg-[#45a049] text-white font-bold py-2 px-4 rounded">
        Start Trading
      </button>
    </header>
  );
};

export default Header;