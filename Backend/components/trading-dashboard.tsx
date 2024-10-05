import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
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
        hide_top_toolbar: true,
        hide_side_toolbar: true,
        container_id: "tradingview_chart",
        library_path: "/charting_library/",
        custom_css_url: "/tradingview-custom.css",
        disabled_features: [
          "use_localstorage_for_settings",
          "volume_force_overlay",
          "header_symbol_search",
          "header_settings",
          "header_chart_type",
          "header_compare",
          "header_undo_redo",
          "header_screenshot",
          "header_fullscreen_button",
          "timeframes_toolbar",
          "left_toolbar",
          "legend_widget",
          "header_widget",
          "header_saveload",
          "control_bar",
          "timeline_indicator",
          "header_indicators",
          "header_interval_dialog_button",
          "show_interval_dialog_on_key_press",
          "header_resolutions",
          "display_market_status",
          "widget_logo",
          "countdown",
        ],
        enabled_features: ["hide_left_toolbar_by_default"],
        overrides: {
          "paneProperties.background": "#131722",
          "paneProperties.vertGridProperties.color": "#363c4e",
          "paneProperties.horzGridProperties.color": "#363c4e",
          "symbolWatermarkProperties.transparency": 90,
          "scalesProperties.textColor": "#AAA",
          "mainSeriesProperties.candleStyle.wickUpColor": '#336854',
          "mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
        },
        studies_overrides: {
          "volume.volume.color.0": "#3a3e5e",
          "volume.volume.color.1": "#3a3e5e",
          "volume.volume.transparency": 70,
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
    setActiveWidget(prev => prev === widget ? null : widget);
  };

  const renderActiveWidget = () => {
    switch (activeWidget) {
      case "marketWatch":
        return <MarketWatch />;
      case "economicCalendar":
        return <EconomicCalendar showCalendar={true} />;
      case "marketNews":
        return <MarketNews />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1e2329] text-white min-h-screen flex flex-col">
      <header className="bg-[#2c3035] p-2 sm:p-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-0">
            <Image src="/images/logo-cita-white.png" alt="CITA TRADING GROUP" width={150} height={45} className="w-24 sm:w-auto" />
            <button className="hidden sm:flex bg-blue-600 text-white px-3 py-1 rounded items-center text-sm">
              <Image src="/images/gold-icon.png" alt="Gold" width={40} height={40} className="w-8 h-8" />
              <span className="ml-2">Gold metals</span>
              <FaChevronDown className="ml-2" />
            </button>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
            <button className="border-2 border-green-500 text-green-500 px-2 py-1 sm:px-4 sm:py-2 rounded flex items-center text-xs sm:text-sm hover:bg-green-500 hover:text-white transition-colors duration-300 mb-2 sm:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm3 2a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Deposit
            </button>
            <div className="flex flex-col items-end mb-2 sm:mb-0">
              <span className="text-green-500 text-xs sm:text-sm">STANDARD ACCOUNT</span>
              <span className="text-green-500 text-sm sm:text-xl font-bold">$0.00</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Image src="/images/mvp-badge.png" alt="MVP" width={50} height={50} className="w-6 h-6 sm:w-10 sm:h-10" />
              <Link href="/">
                <button className="bg-gray-700 p-1 sm:p-3 rounded-full text-gray-400 hover:text-white transition-colors duration-300">
                  <FaUser size={16} className="sm:w-6 sm:h-6" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className="flex w-16 sm:w-20 bg-[#2c3035] flex-shrink-0 flex-col py-2 sm:py-4">
          <button
            className="flex flex-col items-center justify-center mb-6 text-gray-400 hover:text-white"
            onClick={() => toggleWidget("marketWatch")}
          >
            <FaChartLine size={16} className="sm:text-xl md:text-2xl" />
            <span className="mt-1 text-[8px] sm:text-xs md:text-sm">MARKET WATCH</span>
          </button>
          <button className="flex flex-col items-center justify-center mb-6 text-gray-400 hover:text-white">
            <FaShoppingCart size={16} className="sm:text-xl md:text-2xl" />
            <span className="mt-1 text-[8px] sm:text-xs md:text-sm">ACTIVE ORDERS</span>
          </button>
          <button className="flex flex-col items-center justify-center mb-6 text-gray-400 hover:text-white">
            <FaHistory size={16} className="sm:text-xl md:text-2xl" />
            <span className="mt-1 text-[8px] sm:text-xs md:text-sm">TRADING HISTORY</span>
          </button>
          <button
            className="flex flex-col items-center justify-center mb-6 text-gray-400 hover:text-white"
            onClick={() => toggleWidget("economicCalendar")}
          >
            <FaCalendarAlt size={16} className="sm:text-xl md:text-2xl" />
            <span className="mt-1 text-[8px] sm:text-xs md:text-sm">ECONOMIC CALENDAR</span>
          </button>
          <button
            className="flex flex-col items-center justify-center mb-6 text-gray-400 hover:text-white"
            onClick={() => toggleWidget("marketNews")}
          >
            <FaNewspaper size={16} className="sm:text-xl md:text-2xl" />
            <span className="mt-1 text-[8px] sm:text-xs md:text-sm">MARKET NEWS</span>
          </button>
        </aside>

        <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
          {/* Active Widget for larger screens */}
          {activeWidget && (
            <div className="hidden lg:block lg:w-1/4 bg-gray-800 overflow-y-auto">
              <div className="flex justify-between items-center p-2 bg-gray-700">
                <h2 className="text-base font-semibold">{activeWidget}</h2>
                <button onClick={() => setActiveWidget(null)} className="text-gray-400 hover:text-white">
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="p-2 h-[calc(100vh-10rem)] overflow-y-auto">
                {renderActiveWidget()}
              </div>
            </div>
          )}

          <main className={`flex-grow flex flex-col overflow-hidden ${activeWidget ? 'lg:w-1/2' : 'lg:w-3/4'}`}>
            <div className="flex flex-wrap items-center space-x-1 sm:space-x-2 p-2">
              <h2 className="text-base sm:text-lg font-semibold whitespace-nowrap mb-1 sm:mb-0">{selectedMarket}</h2>
              <div className="flex flex-wrap space-x-1 mb-1 sm:mb-0">
                {(["1m", "5m", "15m", "1h", "4h", "1d"] as const).map((tf) => (
                  <button
                    key={tf}
                    className={`px-1 py-0.5 rounded text-xs ${timeframe === timeframesMap[tf] ? "bg-blue-500" : "bg-[#2c3035]"}`}
                    onClick={() => setTimeframe(timeframesMap[tf])}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <button className="text-gray-400 text-xs whitespace-nowrap mb-1 sm:mb-0">Indicators</button>
              <div className="flex space-x-1 ml-auto">
                <FaCog className="text-gray-400 w-4 h-4" />
                <FaExpand className="text-gray-400 w-4 h-4" />
                <FaCamera className="text-gray-400 w-4 h-4" />
              </div>
            </div>
            <div id="tradingview_chart" className="flex-grow lg:h-[calc(50vh-5rem)] h-[calc(30vh-3rem)]" />

            {/* TradingWidget for smaller screens */}
            <div className="lg:hidden">
              <TradingWidget />
            </div>

            <div className="p-2 overflow-y-auto flex-shrink-0" style={{ maxHeight: 'calc(30vh - 2rem)' }}>
              <div className="flex flex-wrap space-x-2 mb-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap mb-1 sm:mb-0">
                  Active Orders
                </button>
                <button className="bg-[#2c3035] text-white px-2 py-1 rounded text-xs whitespace-nowrap mb-1 sm:mb-0">
                  Orders History
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
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
            </div>
          </main>

          {/* TradingWidget for larger screens */}
          <aside className="hidden lg:block w-full lg:w-1/4 bg-gray-800 overflow-y-auto">
            <TradingWidget />
          </aside>
        </div>

        {/* Active Widget for smaller screens */}
        {activeWidget && (
          <div className="lg:hidden fixed inset-0 bg-gray-800 z-50 overflow-y-auto">
            <div className="flex justify-between items-center p-2 bg-gray-700">
              <h2 className="text-base font-semibold">{activeWidget}</h2>
              <button onClick={() => setActiveWidget(null)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-2">
              {renderActiveWidget()}
            </div>
          </div>
        )}
      </div>

      <footer className="bg-[#2c3035] p-2 flex flex-wrap justify-between items-center text-xs fixed bottom-0 left-0 right-0">
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