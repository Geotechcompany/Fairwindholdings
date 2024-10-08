import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  FaChartLine,
  FaHistory,
  FaCalendarAlt,
  FaNewspaper,
  FaCog,
  FaExpand,
  FaCamera,
  FaChevronDown,
  FaUser,
  FaShoppingCart,
  FaTimes,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import MarketWatch from "./MarketWatch";
import EconomicCalendar from "./EconomicCalendar";
import MarketNews from "./MarketNews";
import TradingWidget from "./TradingWidget";
import AccountDropdown from "./AccountDropdown";
import OrdersDropdown from './OrdersDropdown';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingDashboardProps {
  userData: any;
  stats: any;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

export function TradingDashboard({
  userData,
  stats,
}: {
  userData: any;
  stats: any;
}) {
  const { user } = useUser();
  const [selectedMarket, setSelectedMarket] = useState("GOLD");
  const [timeframe, setTimeframe] = useState("1D");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfitCalculatorOpen, setIsProfitCalculatorOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "OANDA:XAUUSD",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      calendar: false,
      hide_volume: true,
      support_host: "https://www.tradingview.com",
      container_id: "tradingview_chart",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      hide_popup_button: true,
      overrides: {
        "paneProperties.background": "#131722",
        "paneProperties.vertGridProperties.color": "#363c4e",
        "paneProperties.horzGridProperties.color": "#363c4e",
        "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#AAA",
        "mainSeriesProperties.candleStyle.wickUpColor": "#336854",
        "mainSeriesProperties.candleStyle.wickDownColor": "#7f323f",
      },
    });

    const container = document.getElementById("tradingview_chart");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

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
    setActiveWidgets((prev) => {
      if (prev.includes(widget)) {
        // If the widget is already open, close it
        return prev.filter((w) => w !== widget);
      } else {
        // If the widget is not open
        if (prev.length === 0) {
          // If no widgets are open, open this one
          return [widget];
        } else if (prev.length === 1) {
          // If one widget is open, add this one (max 2 widgets)
          return [...prev, widget];
        } else {
          // If two widgets are already open, replace the second one
          return [prev[0], widget];
        }
      }
    });
  };

  const renderActiveWidgets = () => {
    return (
      <div className="bg-gray-800 overflow-hidden flex flex-col h-full">
        {activeWidgets.map((widget) => (
          <div
            key={widget}
            className="flex-1 border-gray-700 flex flex-col"
          >
            <div className="flex justify-between items-center p-2 bg-gray-700">
              <h2 className="text-base font-semibold">{widget}</h2>
              <button
                onClick={() => toggleWidget(widget)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex-grow overflow-hidden">
              {renderWidget(widget)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWidget = (widgetName: string) => {
    switch (widgetName) {
      case "MARKET WATCH":
        return <MarketWatch />;
      case "ECONOMIC CALENDAR":
        return <EconomicCalendar showCalendar={true} />;
      case "MARKET NEWS":
        return <MarketNews />;
      // Add cases for other widgets as needed
      default:
        return null;
    }
  };

  const renderSidebarButton = (
    icon: React.ReactNode,
    label: string,
    widgetName: string
  ) => {
    const isActive = activeWidgets.includes(widgetName);
    return (
      <button
        className={`flex flex-col items-center justify-center mb-6 text-gray-400 hover:text-white relative group`}
        onClick={() => toggleWidget(widgetName)}
      >
        <div className="absolute top-0 right-0 bg-blue-500 rounded-full p-1 text-white text-xs">
          {isActive ? <FaMinus size={8} /> : <FaPlus size={8} />}
        </div>
        <div className={`sm:text-xl md:text-2xl ${isActive ? 'text-white' : ''}`}>{icon}</div>
        <span className={`mt-1 text-[8px] sm:text-xs md:text-sm ${isActive ? 'text-white' : ''}`}>
          {label}
        </span>
        {isActive && (
          <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-lg"></div>
        )}
      </button>
    );
  };

  const accountDetails = {
    accountType: "STANDARD",
    accountNumber: "1645520",
    balance: "0.00",
    credit: "0.00",
    invested: "0.00",
    profit: "0.00",
    equity: "0.00",
    margin: "0.00",
    marginLevel: "-",
    freeMargin: "-",
  };

  return (
    <div className="bg-[#1e2329] text-white h-screen flex flex-col">
      <header className="bg-[#2c3035] p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/logo-cita-white.png"
              alt="CITA TRADING GROUP"
              width={100}
              height={30}
              className="w-20 sm:w-24"
            />
            <button className="hidden md:flex bg-blue-600 text-white px-2 py-1 rounded text-xs items-center">
              <Image
                src="/images/gold-icon.png"
                alt="Gold"
                width={16}
                height={16}
                className="w-4 h-4 mr-1"
              />
              Gold metals <FaChevronDown className="ml-1" size={10} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="border border-green-500 text-green-500 px-2 py-1 rounded flex items-center text-xs hover:bg-green-500 hover:text-white transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
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

            <div className="w-28 sm:w-32">
              <AccountDropdown accountDetails={accountDetails} />
            </div>

            <div className="flex items-center space-x-1">
              <Image
                src="/images/mvp-badge.png"
                alt="MVP"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <Link href="/">
                <button className="bg-gray-750 p-1 rounded-full text-gray-400 hover:text-white transition-colors duration-300">
                  {user?.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt="User Profile"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <FaUser className="text-white" size={16} />
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className="flex w-16 sm:w-20 md:w-24 bg-[#2c3035] flex-shrink-0 flex-col py-2 sm:py-4">
          {renderSidebarButton(<FaChartLine size={16} />, "MARKET WATCH", "MARKET WATCH")}
          {renderSidebarButton(<FaShoppingCart size={16} />, "ACTIVE ORDERS", "ACTIVE ORDERS")}
          {renderSidebarButton(<FaHistory size={16} />, "TRADING HISTORY", "TRADING HISTORY")}
          {renderSidebarButton(<FaCalendarAlt size={16} />, "ECONOMIC CALENDAR", "ECONOMIC CALENDAR")}
          {renderSidebarButton(<FaNewspaper size={16} />, "MARKET NEWS", "MARKET NEWS")}
        </aside>

        <div className="flex-grow flex flex-col overflow-hidden relative">
          {/* Active Widgets */}
          {activeWidgets.length > 0 && (
            <div className="lg:w-64 bg-gray-800 overflow-hidden absolute left-0 top-0 bottom-0 z-10">
              {renderActiveWidgets()}
            </div>
          )}

          <main className="flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow flex flex-col lg:flex-row relative">
              {/* Chart */}
              <div id="tradingview_chart" className="flex-grow" />

              {/* TradingWidget */}
              <div className="lg:w-64 bg-gray-800 overflow-hidden">
                <TradingWidget />
              </div>
            </div>

            {/* Orders Dropdown */}
            <div className={`transition-all duration-300 ${isOrdersOpen ? 'h-48' : 'h-10'} overflow-hidden`}>
              <OrdersDropdown 
                isOpen={isOrdersOpen} 
                onToggle={() => setIsOrdersOpen(!isOrdersOpen)} 
              />
            </div>
          </main>
        </div>
      </div>

      <footer className="bg-[#2c3035] p-2 flex flex-wrap justify-between items-center text-xs">
        <div className="flex items-center space-x-2 mb-1 sm:mb-0">
          <span>Balance: $0.00</span>
          <span>Credit: $0.00</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-blue-500">LIVE CHAT</button>
          <span>CURRENT TIME: {currentTime}</span>
        </div>
      </footer>
    </div>
  );
}

export default TradingDashboard;