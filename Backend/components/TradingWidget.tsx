import React, { useState, useEffect, useRef } from "react";
import ProfitCalculatorModal from "./Trading/ProfitCalculatorModal";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

const TradingWidget = () => {
  const [marketPrice, setMarketPrice] = useState<number>(2658.16);
  const [tradeVolume, setTradeVolume] = useState<number>(0.01);
  const [tradeType, setTradeType] = useState<"buy" | "sell" | null>(null);
  const [tradeSL, setTradeSL] = useState<number | null>(marketPrice - 5); // Initialize around market price
  const [tradeTP, setTradeTP] = useState<number | null>(marketPrice + 5); // Initialize around market price
  const [tradePendingOrder, setTradePendingOrder] = useState<number | null>(
    null
  ); // Pending order price
  const [isProfitCalculatorOpen, setIsProfitCalculatorOpen] = useState(false);
  const [isTPSLModalOpen, setIsTPSLModalOpen] = useState(false); // Combined TP/SL Modal State
  const [isPendingOrderModalOpen, setIsPendingOrderModalOpen] = useState(false); // Pending Order Modal State
  const modalRef = useRef(null);

  // Simulate fetching the market price
  useEffect(() => {
    const fetchMarketPrice = async () => {
      const price = 2658.16 + Math.random() * 2; // Simulate minor price fluctuation
      setMarketPrice(price);
    };

    fetchMarketPrice();
    const intervalId = setInterval(fetchMarketPrice, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsTPSLModalOpen(false);
        setIsPendingOrderModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const handleVolumeChange = (value: number) => {
    if (tradeVolume + value >= 0.01) setTradeVolume(tradeVolume + value);
  };

  const handlePlaceTrade = (type: "buy" | "sell") => {
    setTradeType(type);

    if (type === "buy") {
      if (tradeTP !== null && tradeTP <= marketPrice) {
        alert(
          "Take Profit must be greater than the market price for Buy orders."
        );
        return;
      }
      if (tradeSL !== null && tradeSL >= marketPrice) {
        alert("Stop Loss must be less than the market price for Buy orders.");
        return;
      }
    } else if (type === "sell") {
      if (tradeTP !== null && tradeTP >= marketPrice) {
        alert(
          "Take Profit must be less than the market price for Sell orders."
        );
        return;
      }
      if (tradeSL !== null && tradeSL <= marketPrice) {
        alert(
          "Stop Loss must be greater than the market price for Sell orders."
        );
        return;
      }
    }

    alert(`Trade placed: ${type.toUpperCase()} at ${marketPrice}`);
  };

  const handleTPChange = (value: number) => {
    setTradeTP((prevTP) => Math.max(0, (prevTP || 0) + value));
  };

  const handleSLChange = (value: number) => {
    setTradeSL((prevSL) => Math.max(0, (prevSL || 0) + value));
  };

  const handlePendingOrderChange = (value: number) => {
    setTradePendingOrder((prev) => (prev !== null ? prev + value : value));
  };

  return (
    <div className="flex flex-col items-start justify-start p-4 bg-gray-900 text-white shadow-lg max-w-lg mx-auto lg:max-w-none lg:w-[300px] relative">
      {/* Volume & Buttons Section */}
      <div className="flex flex-col space-y-2 w-full mb-4">
        {/* Volume Label and Input */}
        <div className="flex items-center bg-gray-800 p-2 w-full relative mb-0">
          <div className="flex flex-col">
            <label className="text-xs  text-gray-400">Volume</label>
            <input
              type="text"
              className="bg-transparent text-2xl text-white border-none focus:outline-none w-16 mt-1"
              value={tradeVolume}
              onChange={(e) => setTradeVolume(parseFloat(e.target.value) || 0)}
            />
          </div>
          {/* Volume Increment/Decrement Buttons */}
          <div className="absolute right-2 flex flex-col items-center justify-center border-l border-gray-700">
            <button
              className="bg-gray-600 p-2 h-8 w-8 flex items-center justify-center text-lg text-white border-b border-gray-700"
              onClick={() => handleVolumeChange(0.01)}
            >
              +
            </button>
            <button
              className="bg-gray-600 p-2 h-8 w-8 flex items-center justify-center text-lg text-white"
              onClick={() => handleVolumeChange(-0.01)}
            >
              -
            </button>
          </div>
        </div>

        {/* Lots, Units, Currency Buttons */}
        <div className="flex items-center justify-between bg-gray-800 p-2  w-full">
          <button className="bg-gray-600 py-0 w-full text-sm text-white border-r border-gray-700">
            lots
          </button>
          <button className="bg-gray-600 py-0 w-full text-sm text-gray-400 border-r border-gray-700">
            units
          </button>
          <button className="bg-gray-600 py-0 w-full text-sm text-gray-400">
            currency
          </button>
        </div>

        {/* Contract Size, Position, Margin, Free Margin, Spread, Leverage */}
        <div className="flex flex-col space-y-1">
          {[
            "Contract size",
            "Position",
            "Margin",
            "Free Margin",
            "Spread",
            "Leverage",
          ].map((item, index) => (
            <div className="text-sm flex justify-between" key={index}>
              <span className=" text-left">{item}:</span>
              <span className="text-green-500 text-right">
                {index === 2
                  ? "$531.63"
                  : index === 3
                  ? "$0.00"
                  : index === 4
                  ? "0.48"
                  : index === 5
                  ? "1:50"
                  : "1,000"}
              </span>
            </div>
          ))}
        </div>

        {/* Profit Calculator, TP/SL, and Trade Section */}
        <div className="flex flex-col space-y-4 w-full mb-0 mt-0">
          {/* Profit Calculator */}
          <button
            className="bg-gray-600 py-2 px-4  text-sm  w-auto ml-auto flex items-center space-x-2"
            onClick={() => setIsProfitCalculatorOpen(true)}
          >
            <FaMoneyBillTrendUp />
            <span>Profit Calculator</span>
          </button>

          {/* TP/SL Trigger Button */}
          <button
            className="bg-gray-700 py-2 px-4  text-sm"
            onClick={() => setIsTPSLModalOpen(!isTPSLModalOpen)}
          >
            Take Profit / Stop Loss
          </button>

          {/* TP/SL Modal */}
          {isTPSLModalOpen && (
            <div className="absolute left-[-220px] top-auto z-10 flex items-start justify-start">
              <div
                ref={modalRef}
                className="bg-gray-800 p-4  shadow-lg w-60 mt-2"
              >
                <div className="flex flex-col space-y-4">
                  {/* Take Profit - Distinct area */}
                  <div className="flex items-center bg-gray-700 p-2 w-full relative">
                    <div className="flex flex-col">
                      <label
                        htmlFor="takeProfit"
                        className="text-xs text-gray-400"
                      >
                        Take Profit
                      </label>
                      <input
                        id="takeProfit"
                        type="text"
                        className="bg-transparent text-2xl text-white border-none focus:outline-none w-16 mt-1"
                        value={tradeTP || ""}
                        onChange={(e) =>
                          setTradeTP(parseFloat(e.target.value) || null)
                        }
                        aria-label="Take Profit"
                      />
                    </div>
                    <div className="absolute right-2 flex flex-col items-center justify-center border-l border-gray-600">
                      <button
                        className="bg-gray-600 p-2 h-8 w-8 flex items-center justify-center text-lg text-white border-b border-gray-600"
                        onClick={() => setTradeTP((tradeTP || 0) + 0.1)}
                        aria-label="Increase Take Profit"
                      >
                        +
                      </button>
                      <button
                        className="bg-gray-600 p-2 h-8 w-8 flex items-center justify-center text-lg text-white"
                        onClick={() => setTradeTP((tradeTP || 0) - 0.1)}
                        aria-label="Decrease Take Profit"
                      >
                        -
                      </button>
                    </div>
                  </div>

                  {/* Stop Loss - Distinct area */}
                  <div className="flex items-center bg-gray-600 p-2  w-full relative">
                    <div className="flex flex-col">
                      <label className="text-xs  text-gray-300">
                        Stop Loss
                      </label>
                      <input
                        type="text"
                        className="bg-transparent text-2xl text-white border-none focus:outline-none w-16 mt-1"
                        value={tradeSL || ""}
                        onChange={(e) =>
                          setTradeSL(parseFloat(e.target.value) || null)
                        }
                      />
                    </div>
                    <div className="absolute right-2 flex flex-col items-center justify-center border-l border-gray-500">
                      <button
                        className="bg-gray-500 p-2 h-8 w-8 flex items-center justify-center text-lg text-white border-b border-gray-500"
                        onClick={() => setTradeSL((tradeSL || 0) + 0.01)}
                      >
                        +
                      </button>
                      <button
                        className="bg-gray-500 p-2 h-8 w-8 flex items-center justify-center text-lg text-white"
                        onClick={() => setTradeSL((tradeSL || 0) - 0.01)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pending Order Trigger Button */}
          <button
            className="bg-gray-700 py-2 px-4  text-sm  mt-0 mb-0"
            onClick={() => setIsPendingOrderModalOpen(!isPendingOrderModalOpen)}
          >
            Set Pending Order
          </button>

          {/* Pending Order Modal */}
          {isPendingOrderModalOpen && (
            <div className="absolute left-[-220px] top-auto z-10 flex items-start justify-start">
              <div
                ref={modalRef}
                className="bg-gray-800 p-4  shadow-lg w-60 mt-2"
              >
                <div className="flex flex-col space-y-4">
                  {/* Pending Order Price Input */}
                  <div className="flex items-center bg-gray-700 p-2  w-full relative">
                    <div className="flex flex-col">
                      <label className="text-xs  text-gray-400">
                        Pending Order Price
                      </label>
                      <input
                        type="text"
                        className="bg-transparent text-2xl text-white border-none focus:outline-none w-16 mt-1"
                        value={
                          tradePendingOrder !== null ? tradePendingOrder : ""
                        }
                        readOnly // Keep it read-only initially
                      />
                    </div>
                    <div className="absolute right-2 flex flex-col items-center justify-center border-l border-gray-700">
                      <button
                        className="bg-gray-600 p-2 h-8 w-8 flex items-center justify-center text-lg text-white border-b border-gray-700"
                        onClick={() => handlePendingOrderChange(1)}
                      >
                        +
                      </button>
                      <button
                        className="bg-gray-600 p-2 h-8 w-8 flex items-center justify-center text-lg text-white"
                        onClick={() => handlePendingOrderChange(-1)}
                      >
                        -
                      </button>
                    </div>
                  </div>

                  {/* Revert to Market Price Button */}
                  <button
                    className="bg-blue-600 py-2  text-sm  w-full"
                    onClick={() => setTradePendingOrder(marketPrice)} // Revert to market price
                  >
                    Revert to Market Price
                  </button>

                  {/* Info Message */}
                  <p className="text-xs text-gray-400">
                    The order will be executed automatically once the price
                    reaches this level.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buy & Sell Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              className="bg-green-600 py-2  text-sm "
              onClick={() => handlePlaceTrade("buy")}
            >
              BUY
              <br />
              {marketPrice.toFixed(2)}
            </button>
            <button
              className="bg-red-600 py-2  text-sm "
              onClick={() => handlePlaceTrade("sell")}
            >
              SELL
              <br />
              {marketPrice.toFixed(2)}
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
