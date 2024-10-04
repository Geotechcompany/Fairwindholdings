import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analytics: React.FC = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'User Growth',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Trade Volume',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category' as const,
      },
      y: {
        type: 'linear' as const,
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <Line data={data} options={options} />
    </div>
  );
};

export default Analytics;