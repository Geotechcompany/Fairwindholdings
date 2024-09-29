import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaChartLine,
  FaHistory,
  FaCalendarAlt,
  FaNewspaper,
  FaCog,
  FaExpand,
  FaCamera,
  FaChevronDown,
  FaPlus,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import MarketWatch from "./MarketWatch";
import EconomicCalendar from "./EconomicCalendar";
import MarketNews from "./MarketNews";
import TradingWidget from "./TradingWidget";

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingDashboard: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState("GOLD");
  const [timeframe, setTimeframe] = useState("1D");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfitCalculatorOpen, setIsProfitCalculatorOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new window.TradingView.widget({
        autosize: true,
        symbol: "OANDA:XAUUSD",
        interval: timeframe,
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        allow_symbol_change: false,
        calendar: false,
        hide_volume: true,
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        container_id: "tradingview_chart",
        support_host: "https://www.tradingview.com",
        studies: ["Volume@tv-basicstudies"],
        disabled_features: ["use_localstorage_for_settings"],
        enabled_features: ["study_templates"],
        overrides: {
          "paneProperties.background": "#131722",
          "paneProperties.vertGridProperties.color": "#363c4e",
          "paneProperties.horzGridProperties.color": "#363c4e",
          "symbolWatermarkProperties.transparency": 90,
          "scalesProperties.textColor": "#AAA",
        },
      });
    };

    document.getElementById("tradingview_chart")!.innerHTML = "";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [timeframe]);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeframesMap: { [key: string]: string } = {
    "1m": "1",
    "5m": "5",
    "15m": "15",
    "1h": "60",
    "4h": "240",
    "1d": "D",
  };

  const toggleWidget = (widget: string) => {
    setActiveWidget((prev) => (prev === widget ? null : widget));
  };

  return (
    <div className="bg-[#1e2329] text-white h-screen flex flex-col">
      <header className="bg-[#2c3035] p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image
            src="/images/logo-cita-white.png"
            alt="CITA TRADING GROUP"
            width={150}
            height={45}
          />
          <button className="bg-blue-600 text-white px-3 py-1 rounded flex items-center">
            <Image
              src="/images/gold-icon.png"
              alt="Gold"
              width={40}
              height={40}
            />
            <span className="ml-2">Gold metals</span>
            <FaChevronDown className="ml-2" />
          </button>
          <button className="text-gray-400">
            <FaPlus />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="border-2 border-green-500 text-green-500 px-6 py-3 rounded flex items-center hover:bg-green-500 hover:text-white transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm3 2a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Deposit
          </button>
          <div className="flex flex-col items-end">
            <span className="text-green-500 text-sm">STANDARD ACCOUNT</span>
            <span className="text-green-500 text-xl font-bold">$0.00</span>
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/images/mvp-badge.png"
              alt="MVP"
              width={50}
              height={50}
              className="w-10 h-10"
            />
            <button className="bg-gray-700 p-3 rounded-full text-gray-400 hover:text-white">
              <FaUser size={25} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className="w-20 bg-[#2c3035] flex-shrink-0 flex flex-col py-4">
          <button
            className="flex flex-col items-center justify-center mb-6 text-gray-400 hover:text-white"
            onClick={() => toggleWidget("marketWatch")}
          >
            <FaChartLine size={20} />
            <span className="mt-1 text-xs">MARKET WATCH</span>
          </button>
          <button className="flex flex-col items-center justify-center mb-6 text-gray-400 hover:text-white">
            <FaShoppingCart size={20} />
            <span className="mt-1 text-xs">ACTIVE ORDERS</span>
          </button>
          <button className="flex flex-col items-center justify-center mb-6 text-gray-400 hover:text-white">
            <FaHistory size={20} />
            <span className="mt-1 text-xs">TRADING HISTORY</span>
          </button>
          <button
            className="flex flex-col items-center justify-center mb-6 text-gray-400 hover:text-white"
            onClick={() => toggleWidget("economicCalendar")}
          >
            <FaCalendarAlt size={20} />
            <span className="mt-1 text-xs">ECONOMIC CALENDAR</span>
          </button>
          <button
            className="flex flex-col items-center justify-center mb-6 text-gray-400 hover:text-white"
            onClick={() => toggleWidget("marketNews")}
          >
            <FaNewspaper size={20} />
            <span className="mt-1 text-xs">MARKET NEWS</span>
          </button>
        </aside>

        <section className="bg-[#2c3035] flex-shrink-0 p-4">
          {activeWidget === "marketWatch" && <MarketWatch />}
          {activeWidget === "economicCalendar" && (
            <EconomicCalendar showCalendar={true} />
          )}{" "}
          {/* Pass showCalendar prop */}
          {activeWidget === "marketNews" && <MarketNews />}{" "}
          {/* News Component */}
        </section>

        <div className="flex-grow overflow-hidden">
  <div className="flex flex-col lg:flex-row h-full relative">
    <main className={`flex-grow flex flex-col lg:w-2/3 transition-all duration-300 ${isSidebarOpen ? 'ml-1/3' : ''}`}>
      <div className="flex items-center space-x-4 p-4">
        <h2 className="text-xl font-semibold">{selectedMarket}</h2>
        <div className="flex space-x-2">
          {(["1m", "5m", "15m", "1h", "4h", "1d"] as const).map((tf) => (
            <button
              key={tf}
              className={`px-2 py-1 rounded ${timeframe === timeframesMap[tf] ? "bg-blue-500" : "bg-[#2c3035]"} `}
              onClick={() => setTimeframe(timeframesMap[tf])}
            >
              {tf}
            </button>
          ))}
        </div>
        <button className="text-gray-400">Indicators</button>
        <div className="flex space-x-2 ml-auto">
          <FaCog className="text-gray-400" />
          <FaExpand className="text-gray-400" />
          <FaCamera className="text-gray-400" />
        </div>
      </div>
      <div id="tradingview_chart" className="flex-grow" />
      <div className="p-4">
        <div className="flex space-x-4 mb-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Active Orders
          </button>
          <button className="bg-[#2c3035] text-white px-4 py-2 rounded">
            Orders History
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400">
              <th className="text-left">Symbol</th>
              <th className="text-left">ID</th>
              <th className="text-left">Type</th>
              <th className="text-left">Volume</th>
              <th className="text-left">Open Price</th>
              <th className="text-left">Open Time</th>
              <th className="text-left">SL</th>
              <th className="text-left">TP</th>
              <th className="text-left">Price</th>
              <th className="text-left">Commission</th>
              <th className="text-left">Swap</th>
              <th className="text-left">PnL</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>{/* Add table rows here for active orders */}</tbody>
        </table>
      </div>
    </main>

    <aside
      className={`absolute top-0 right-0 h-full flex-shrink-0 bg-gray-800 transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="h-full flex flex-col justify-between relative">
        {/* Chevron Button, hidden on large screens */}
        <button
          className={`absolute top-1/2 transform -translate-y-1/2 -left-10 p-2 rounded-full bg-gray-700 transition-transform duration-300 lg:hidden ${
            isSidebarOpen ? 'rotate-180' : ''
          }`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaChevronRight className="text-white" /> : <FaChevronLeft className="text-white" />}
        </button>
        <div className="flex-grow">
          <TradingWidget /> {/* Your widget beside the chart */}
        </div>
      </div>
      <div className="border-t border-gray-600 mt-2" /> {/* Thin line between widget and bottom */}
    </aside>
  </div>
</div>

      </div>
      <footer className="bg-[#2c3035] p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span>Balance: $0.00</span>
          <span>Credit: $0.00</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-blue-500">LIVE CHAT</button>
          <span>CURRENT TIME: {currentTime}</span>
        </div>
      </footer>
    </div>
  );
};

export default TradingDashboard;
