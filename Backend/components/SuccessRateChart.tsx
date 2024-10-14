import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import useSWR from "swr";
import { motion } from "framer-motion";
import Loader from "./Loader";

type TradePerformance = {
  status: string;
  count: number;
  percentage: number;
};

const COLORS = ["#4ADE80", "#F87171"];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        filter="url(#shadow)"
      />
    </g>
  );
};

const SuccessRateChart: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const { data, error } = useSWR<TradePerformance[]>(
    "/api/trade-performance",
    fetcher
  );

  if (error) {
    console.error("Error fetching trade performance data:", error);
    return (
      <div className="text-red-500">Failed to load trade performance data</div>
    );
  }

  if (!data) return <Loader />;

  const processedData = data.map((item) => ({
    ...item,
    name: item.status === "CLOSED_WITH_PROFIT" ? "Closed With Profit" : "Closed With Loss",
    value: item.percentage,
  }));

  const profitData = processedData.find(item => item.name === "Closed With Profit") || { value: 0, count: 0 };

  if (processedData.length === 0) {
    return (
      <div className="bg-[#1e2433] rounded-lg p-6 shadow-lg flex flex-col items-center justify-center" style={{ height: "300px" }}>
        <h3 className="text-2xl font-semibold mb-6 text-center text-green-400">Success Rate</h3>
        <p className="text-gray-400">No trade performance data available. Start trading to see your success rate!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1e2433] rounded-lg p-6 shadow-lg flex flex-col"
      style={{ height: "300px" }}
    >
      <h3 className="text-2xl font-semibold mb-4 text-center text-green-400">Success Rate</h3>
      <div className="flex-grow relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodOpacity="0.5" />
              </filter>
            </defs>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              paddingAngle={0}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <span className="text-3xl font-bold text-white drop-shadow-lg">{profitData.value.toFixed(1)}%</span>
          <span className="text-sm text-gray-300">Closed With Profit</span>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        {processedData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center mx-2">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
            <span className="text-sm text-gray-300">{entry.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SuccessRateChart;
