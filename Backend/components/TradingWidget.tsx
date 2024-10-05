import React, { useState, useEffect } from "react";
import ProfitCalculatorModal from "./Trading/ProfitCalculatorModal";
import { FaChartLine, FaClock, FaMoneyBillTrendUp } from "react-icons/fa6";

const TradingWidget = () => {
  const [marketPrice, setMarketPrice] = useState<number>(2658.16);
  const [tradeVolume, setTradeVolume] = useState<number>(0.01);
  const [tradeType, setTradeType] = useState<"buy" | "sell" | null>(null);
  const [isProfitCalculatorOpen, setIsProfitCalculatorOpen] = useState(false);

  useEffect(() => {
    const fetchMarketPrice = async () => {
      const price = 2658.16 + Math.random() * 2;
      setMarketPrice(price);
    };

    fetchMarketPrice();
    const intervalId = setInterval(fetchMarketPrice, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleVolumeChange = (value: number) => {
    if (tradeVolume + value >= 0.01) setTradeVolume(tradeVolume + value);
  };

  const handlePlaceTrade = (type: "buy" | "sell") => {
    setTradeType(type);
    alert(`Trade placed: ${type.toUpperCase()} at ${marketPrice}`);
  };

  return (
    <div className="flex flex-col p-2 bg-gray-900 text-white shadow-lg h-full">
      <div className="flex flex-row lg:flex-col">
        {/* Left column (smaller screens) / Top section (wider screens) */}
        <div className="w-1/2 lg:w-full pr-2 lg:pr-0 mb-0 lg:mb-2 flex flex-col justify-between">
          {/* Volume */}
          <div className="mb-2">
            <label className="text-xs text-gray-400">Volume</label>
            <div className="flex items-center bg-gray-800 py-3 p-1 lg:p-2 relative">
              <input
                type="text"
                className="bg-transparent text-lg lg:text-xl text-white border-none focus:outline-none w-full"
                value={tradeVolume}
                onChange={(e) => setTradeVolume(parseFloat(e.target.value) || 0)}
              />
              <div className="absolute right-1 flex flex-col">
                <button className="bg-gray-600 p-0.5 lg:p-1 text-sm lg:text-base mb-0.5" onClick={() => handleVolumeChange(0.01)}>+</button>
                <button className="bg-gray-600 p-0.5 lg:p-1 text-sm lg:text-base" onClick={() => handleVolumeChange(-0.01)}>-</button>
              </div>
            </div>
          </div>
          {/* Take Profit & Stop Loss */}
          <button className="bg-gray-700 py-2 px-2 text-xs lg:text-sm w-full mb-2 flex items-center justify-center">
            <FaChartLine className="mr-1" /> Take Profit & Stop Loss
          </button>
          {/* Pending Market */}
          <button className="bg-gray-700 py-2 px-2 text-xs lg:text-sm w-full flex items-center justify-center">
            <FaClock className="mr-1" /> Pending Market
          </button>
        </div>

        {/* Right column (smaller screens) / Bottom section (wider screens) */}
        <div className="w-1/2 lg:w-full pl-2 lg:pl-0 flex flex-col justify-between">
          {/* Contract details */}
          <div className="mb-2 text-xs lg:text-sm">
            {["Contract size", "Position", "Margin", "Free Margin", "Spread", "Leverage"].map((item, index) => (
              <div className="flex justify-between" key={index}>
                <span>{item}:</span>
                <span className="text-green-500">
                  {index === 0 ? "1,000" :
                   index === 1 ? "10" :
                   index === 2 ? "$528.58" :
                   index === 3 ? "$0.00" :
                   index === 4 ? "0.15" :
                   "1:50"}
                </span>
              </div>
            ))}
          </div>

          {/* Profit Calculator button */}
          <button
            className="bg-gray-600 py-1 lg:py-2 px-2 text-xs lg:text-sm w-full mb-2 flex items-center justify-center"
            onClick={() => setIsProfitCalculatorOpen(true)}
          >
            <FaMoneyBillTrendUp className="mr-1" /> Profit Calculator
          </button>
          
          {/* Buy and Sell buttons */}
          <div className="grid grid-cols-2 gap-1">
            <button
              className="bg-green-600 py-1 lg:py-2 text-xs lg:text-sm"
              onClick={() => handlePlaceTrade("buy")}
            >
              BUY<br />{marketPrice.toFixed(2)}
            </button>
            <button
              className="bg-red-600 py-1 lg:py-2 text-xs lg:text-sm"
              onClick={() => handlePlaceTrade("sell")}
            >
              SELL<br />{marketPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      <ProfitCalculatorModal
        isOpen={isProfitCalculatorOpen}
        onClose={() => setIsProfitCalculatorOpen(false)}
      />
    </div>
  );
};

export default TradingWidget;