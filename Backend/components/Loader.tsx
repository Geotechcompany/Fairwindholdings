import React from 'react';

function Loader() {
  return (
    <div className="bg-[#1e2329] text-white flex h-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default Loader;