import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "./Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TradingResultsChart: React.FC = () => {
  const [chartData, setChartData] = useState({
    weeklyData: [],
    monthlyData: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTradingResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/trading-results");
        if (!response.ok) {
          throw new Error("Failed to fetch trading results");
        }
        const data = await response.json();

        // Process the data to calculate weekly and monthly results
        const weeklyData = processWeeklyData(data);
        const monthlyData = processMonthlyData(data);

        setChartData({ weeklyData, monthlyData });
      } catch (err) {
        setError("Error fetching trading results");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTradingResults();
    const intervalId = setInterval(fetchTradingResults, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  const processWeeklyData = (data) => {
    // Implement logic to calculate weekly data
    // This is a placeholder and should be replaced with actual logic
    return data.slice(0, 7).map((trade) => trade.profitLoss);
  };

  const processMonthlyData = (data) => {
    // Implement logic to calculate monthly data
    // This is a placeholder and should be replaced with actual logic
    return data.slice(0, 30).map((trade) => trade.profitLoss);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 10,
          padding: 5,
          font: {
            size: 10,
          },
          color: "#6FC3B2", // Dark text for better contrast on light background
        },
      },
      title: {
        display: true,
        text: "Trading Results",
        font: {
          size: 14,
        },
        color: "#FFF", // Dark text for better contrast on light background
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10,
          },
          color: "#6FC3B2", // Dark text for better contrast on light background
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)", // Lighter grid lines
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
          color: "#6FC3B2", // Dark text for better contrast on light background
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)", // Lighter grid lines
        },
      },
    },
    layout: {
      padding: 10,
    },
  };

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const data = {
    labels,
    datasets: [
      {
        label: "Weekly",
        data: chartData.weeklyData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Monthly",
        data: chartData.monthlyData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-[#1E2433] rounded-[15px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center bg-[#1E2433] rounded-[15px] text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="h-64 bg-[#1E2433] rounded-[15px] overflow-hidden">
      <Line options={options} data={data} />
    </div>
  );
};

export default TradingResultsChart;
