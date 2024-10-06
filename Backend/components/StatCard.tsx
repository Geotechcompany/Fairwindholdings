import React from "react";
import Image from "next/image";

type StatCardProps = {
  title: string;
  value: string;
  icon: string;
  note?: string;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, note }) => {
  return (
    <div className="bg-[#1e2433] rounded-lg shadow-lg flex items-center justify-between h-full p-6">
      <div className="flex items-center justify-center w-1/3">
        <Image
          src={`/images/${icon}.png`}
          alt={title}
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col items-end justify-center w-2/3">
        <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-green-400">{value}</p>
        {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
      </div>
    </div>
  );
};

export default StatCard;