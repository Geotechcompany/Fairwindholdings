import React, { useState, useEffect } from "react";
import ProfitCalculatorModal from "./Trading/ProfitCalculatorModal";
import TakeProfitStopLossModal from "./Trading/TakeProfitStopLossModal";
import PendingOrderModal from "./Trading/PendingOrderModal";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaChartLine, FaClock, FaMoneyBillTrendUp } from "react-icons/fa6";

const TradingWidget = () => {
  const [buyPrice, setBuyPrice] = useState<number | null>(null);
  const [sellPrice, setSellPrice] = useState<number | null>(null);
  const [tradeVolume, setTradeVolume] = useState<number>(0.01);
  const [tradeType, setTradeType] = useState<"buy" | "sell" | null>(null);
  const [isProfitCalculatorOpen, setIsProfitCalculatorOpen] = useState(false);
  const [isTakeProfitStopLossOpen, setIsTakeProfitStopLossOpen] = useState(false);
  const [isPendingOrderOpen, setIsPendingOrderOpen] = useState(false);
  const [takeProfitValue, setTakeProfitValue] = useState<number | null>(null);
  const [stopLossValue, setStopLossValue] = useState<number | null>(null);
  const [pendingOrderValue, setPendingOrderValue] = useState<number | null>(null);


  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('https://marketdata.tradermade.com/api/v1/live', {
          params: {
            currency: 'XAUUSD',
            api_key: process.env.NEXT_PUBLIC_TRADERMADE_API_KEY
          }
        });
        
        console.log('API Response:', response.data); // Log the response for debugging

        if (response.data && response.data.quotes && response.data.quotes.length > 0) {
          const { ask, bid } = response.data.quotes[0];
          setBuyPrice(parseFloat(ask));
          setSellPrice(parseFloat(bid));
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error fetching market price:', error);
        toast.error("Failed to fetch market prices");
      }
    };

    fetchPrices();
    const intervalId = setInterval(fetchPrices, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleVolumeChange = (value: number) => {
    if (tradeVolume + value >= 0.01) setTradeVolume(tradeVolume + value);
  };

  const handlePlaceTrade = (type: "buy" | "sell") => {
    setTradeType(type);
    const price = type === 'buy' ? buyPrice : sellPrice;
    if (price) {
      toast.success(`Trade placed: ${type.toUpperCase()} at ${price.toFixed(5)}`);
    } else {
      toast.error('Failed to place trade');
    }
  };

  return (
    <div className="flex flex-col p-1 bg-gray-900 text-white shadow-lg h-full text-xs">
      <div className="flex flex-row lg:flex-col">
        {/* Left column (smaller screens) / Top section (wider screens) */}
        <div className="w-1/2 lg:w-full pr-1 lg:pr-0 mb-0 lg:mb-1 flex flex-col justify-between">
          {/* Volume */}
          <div className="mb-1">
            <label className="text-gray-400">Volume</label>
            <div className="flex items-center bg-gray-800 p-1 relative">
              <input
                type="text"
                className="bg-transparent text-white border-none focus:outline-none w-full py-2 pr-6"
                value={tradeVolume}
                onChange={(e) => setTradeVolume(parseFloat(e.target.value) || 0)}
              />
              <div className="absolute right-1 flex flex-col h-full">
                <button 
                  className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-0.5 px-1 text-[8px] border-b border-gray-700"
                  onClick={() => handleVolumeChange(0.01)}
                >
                  +
                </button>
                <button 
                  className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-0.5 px-1 text-[8px]"
                  onClick={() => handleVolumeChange(-0.01)}
                >
                  -
                </button>
              </div>
            </div>
          </div>
          {/* Take Profit & Stop Loss */}
          <button 
            className="bg-gray-700 py-1 px-2 w-full mb-1 flex flex-col items-center justify-center"
            onClick={() => setIsTakeProfitStopLossOpen(true)}
          >
            <span>Take Profit & Stop Loss</span>
            <div className="text-gray-400 text-xs mt-1">
              <span>{takeProfitValue ? `$${takeProfitValue.toFixed(2)}` : 'Not Set'}</span>
              <span className="mx-1">&</span>
              <span>{stopLossValue ? `$${stopLossValue.toFixed(2)}` : 'Not Set'}</span>
            </div>
          </button>
          {/* Pending Market */}
          <button 
            className="bg-gray-700 py-1 px-2 w-full flex flex-col items-center justify-center"
            onClick={() => setIsPendingOrderOpen(true)}
          >
            <span>Pending Market</span>
            <div className="text-gray-400 text-xs mt-1">
              {pendingOrderValue ? `$${pendingOrderValue.toFixed(2)}` : 'Not Set'}
            </div>
          </button>
        </div>

        {/* Right column (smaller screens) / Bottom section (wider screens) */}
        <div className="w-1/2 lg:w-full pl-1 lg:pl-0 flex flex-col justify-between">
          {/* Contract details */}
          <div className="mb-1">
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
            className="bg-gray-600 py-1 px-2 w-full mb-1 flex items-center justify-center"
            onClick={() => setIsProfitCalculatorOpen(true)}
          >
            <FaMoneyBillTrendUp className="mr-1" /> Profit Calculator
          </button>
          
          {/* Buy and Sell buttons */}
          <div className="grid grid-cols-2 gap-1">
            <button
              className="bg-green-600 py-1"
              onClick={() => handlePlaceTrade("buy")}
            >
              BUY<br />{buyPrice ? buyPrice.toFixed(5) : 'Loading...'}
            </button>
            <button
              className="bg-red-600 py-1"
              onClick={() => handlePlaceTrade("sell")}
            >
              SELL<br />{sellPrice ? sellPrice.toFixed(5) : 'Loading...'}
            </button>
          </div>
        </div>
      </div>

      <ProfitCalculatorModal
        isOpen={isProfitCalculatorOpen}
        onClose={() => setIsProfitCalculatorOpen(false)}
      />

      <TakeProfitStopLossModal
        isOpen={isTakeProfitStopLossOpen}
        onClose={() => setIsTakeProfitStopLossOpen(false)}
        currentPrice={buyPrice || 0}
      />

      <PendingOrderModal
        isOpen={isPendingOrderOpen}
        onClose={() => setIsPendingOrderOpen(false)}
        currentPrice={buyPrice || 0}
      />
    </div>
  );
};

export default TradingWidget;