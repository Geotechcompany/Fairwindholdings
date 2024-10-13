import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import useSWR from 'swr';

type TradePerformance = {
  status: string;
  count: number;
  percentage: number;
};

const COLORS = ["#00C49F", "#FF8042"];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SuccessRateChart: React.FC = () => {
  const { data, error } = useSWR<TradePerformance[]>('/api/trade-performance', fetcher);

  if (error) return <div>Failed to load trade performance data</div>;
  if (!data) return <div>Loading...</div>;

  // Ensure data is an array
  const chartData = Array.isArray(data) ? data : [];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm md:text-lg font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div
      className="bg-[#1e2433] rounded-lg p-6 shadow-lg flex flex-col"
      style={{ minHeight: '450px' }}
    >
      <h3 className="text-2xl font-semibold mb-6 text-center">Success Rate</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [`${props.payload.percentage.toFixed(2)}%`, name === 'CLOSED_WITH_PROFIT' ? 'Profit' : 'Loss']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconSize={12} 
              formatter={(value, entry, index) => (
                <span className="text-lg">{value === 'CLOSED_WITH_PROFIT' ? 'Closed With Profit' : 'Closed With Loss'}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SuccessRateChart;
