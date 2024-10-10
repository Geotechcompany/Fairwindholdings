import React, { useState, useEffect, Suspense, lazy } from "react";
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
import { FaMoneyBills } from "react-icons/fa6";
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
    return (
      <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
        {(() => {
          switch (widgetName) {
            case "MARKET WATCH":
              return <MarketWatch />;
            case "ECONOMIC CALENDAR":
              return <EconomicCalendar showCalendar={true} />;
            case "MARKET NEWS":
              return <MarketNews />;
            default:
              return null;
          }
        })()}
      </Suspense>
    );
  };

  const renderSidebarButton = (
    icon: React.ReactNode,
    label: string,
    widgetName: string
  ) => {
    const isActive = activeWidgets.includes(widgetName);
    return (
      <button
      className={`w-full aspect-square flex flex-col items-center justify-center text-gray-400 hover:text-white relative group`}
        onClick={() => toggleWidget(widgetName)}
      >
        <div className="absolute top-0 right-0 bg-gray-500 rounded-full p-1 text-white text-xs">
          {isActive ? <FaMinus size={8} /> : <FaPlus size={8} />}
        </div>
        <div className={`sm:text-xl md:text-2xl ${isActive ? 'text-white' : ''}`}>{icon}</div>
        <span className={`mt-1 text-[8px] sm:text-xs md:text-sm text-center leading-tight${isActive ? 'text-white' : ''}`}>
          {label}
        </span>
        {isActive && (
          <div className="absolute inset-0 bg-gray-700 opacity-20"></div>
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
      <header className="bg-[#2c3035] p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/images/logo-cita-white.png"
            alt="CITA TRADING GROUP"
            width={120}
            height={36}
            className="w-24 sm:w-32 hidden sm:inline"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm items-center hidden sm:flex">
            <Image
              src="/images/gold-icon.png"
              alt="Gold"
              width={30}
              height={30}
              className="w-6 h-6 mr-2"
            />
            Gold metals <FaChevronDown className="ml-2" size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-3">
          <button className="border border-green-500 text-green-500 px-3 py-2 rounded flex items-center text-sm hover:bg-green-500 hover:text-white transition-colors duration-300">
            <FaMoneyBills className="sm:hidden" />
            <span className="hidden sm:inline">Deposit</span>
          </button>

          <div className="w-40 sm:w-48">
            <AccountDropdown 
              accountDetails={accountDetails}
            />
          </div>

          <div className="flex items-center">
            <Image
              src="/images/mvp-badge.png"
              alt="MVP"
              width={12}
              height={12}
              className="w-12 h-12 mr-2 sm:mr-0"
            />

            <Link href="/">
              <button className="bg-gray-750 p-2 rounded-full text-gray-400 hover:text-white transition-colors duration-300">
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt="User Profile"
                    width={12}
                    height={12}
                    className="rounded-full w-12 h-12 hidden sm:inline"
                  />
                ) : (
                  <FaUser className="text-white" size={20} />
                )}
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className="flex flex-col w-16 sm:w-20 md:w-24 bg-[#2c3035] flex-shrink-0">
          {renderSidebarButton(<FaChartLine size={20} />, "MARKET WATCH", "MARKET WATCH")}
          {renderSidebarButton(<FaShoppingCart size={20} />, "ACTIVE ORDERS", "ACTIVE ORDERS")}
          {renderSidebarButton(<FaHistory size={20} />, "TRADING HISTORY", "TRADING HISTORY")}
          {renderSidebarButton(<FaCalendarAlt size={20} />, "ECONOMIC CALENDAR", "ECONOMIC CALENDAR")}
          {renderSidebarButton(<FaNewspaper size={20} />, "MARKET NEWS", "MARKET NEWS")}
        </aside>

        <div className="flex-grow flex overflow-hidden relative">
          {/* Active Widgets */}
          {activeWidgets.length > 0 && (
            <div className="absolute inset-y-0 left-0 z-10 bg-gray-800 overflow-hidden lg:relative lg:w-64">
              {renderActiveWidgets()}
            </div>
          )}

          <main className={`flex-grow flex flex-col overflow-hidden ${activeWidgets.length > 0 ? 'lg:ml-4' : ''}`}>
            <div className="flex-grow flex">
              <div id="tradingview_chart" className="w-full h-full flex-grow" />
            </div>

            {/* TradingWidget for small screens */}
            <div className="lg:hidden bg-gray-800 overflow-hidden">
              <TradingWidget />
            </div>

            {/* Orders Dropdown */}
            <div className={`transition-all duration-300 ${isOrdersOpen ? 'h-48' : 'h-10'} overflow-hidden`}>
              <OrdersDropdown
                isOpen={isOrdersOpen}
                onToggle={() => setIsOrdersOpen(!isOrdersOpen)}
              />
            </div>
          </main>

          {/* TradingWidget */}
          <div className={"hidden lg:block lg:w-64 bg-gray-800 overflow-hidden transition-all duration-300 ${isOrdersOpen ? 'h-[calc(100%-12)]' : 'h-[calc(100%-2.5rem)]'}"}>
            <TradingWidget />
          </div>

        </div>
      </div>

      <footer className="bg-[#2c3035] p-2 flex flex-wrap justify-between items-center text-xs">
        <div className="flex items-center space-x-2 mb-1 sm:mb-0">
          <span>Balance: $0.00</span>
          <span>Credit: $0.00</span>
        </div>
        <div className="flex items-center space-x-2 mb-1 sm:mb-0">
          <span>Lifetime PnL: $0.00</span>
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