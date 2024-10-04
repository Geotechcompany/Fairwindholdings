"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type SuccessRateChartProps = {
  profit: number;
  loss: number;
  className?: string;
};

const SuccessRateChart: React.FC<SuccessRateChartProps> = ({
  profit,
  loss,
  className,
}) => {
  const data = [
    { name: "Profit", value: profit },
    { name: "Loss", value: loss },
  ];

  const COLORS = ["#4caf50", "#f44336"];

  const successRate = (profit / (profit + loss)) * 100 || 0;

  return (
    <div
      className={`bg-[#1e2433] rounded-lg p-4 shadow-lg ${className} h-full flex flex-col w-[800px]`}
    >
      <h3 className="text-lg font-semibold mb-4">Success Rate</h3>
      <div className="flex-grow relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-3xl font-bold">{successRate.toFixed(0)}%</p>
        </div>
      </div>
      <div className="mt-4 text-sm">
        <div className="flex items-center justify-center">
          <span className="w-3 h-3 rounded-full bg-green-400 mr-2"></span>
          <span className="mr-4">Closed with Profit</span>
          <span className="w-3 h-3 rounded-full bg-red-400 mr-2"></span>
          <span>Closed with Loss</span>
        </div>
      </div>
    </div>
  );
};

export default SuccessRateChart;
