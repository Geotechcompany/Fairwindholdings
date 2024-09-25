import React from 'react';
import { WalletIcon, CoinsIcon, FlaskIcon, ChartIcon } from '../components/ui/icons';

type StatCardProps = {
  title: string;
  value: string;
  icon: 'wallet' | 'coins' | 'flask' | 'chart';
  note?: string;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, note }) => {
  const IconComponent = {
    wallet: WalletIcon,
    coins: CoinsIcon,
    flask: FlaskIcon,
    chart: ChartIcon
  }[icon];

  return (
    <div className="bg-[#1e2433] rounded-lg p-4 shadow-lg flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center mb-2">
          <IconComponent className="w-6 h-6 mr-2 text-[#4caf50]" />
          <h3 className="text-sm text-gray-400">{title}</h3>
        </div>
        <p className="text-2xl font-bold text-green-400">{value}</p>
      </div>
      {note && <p className="text-xs text-gray-400 mt-2">{note}</p>}
    </div>
  );
};

export default StatCard;