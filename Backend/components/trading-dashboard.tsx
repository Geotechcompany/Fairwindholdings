import React, { useState, useEffect, Suspense, lazy } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  FaChartLine,
  FaHistory,
  FaCalendarAlt,
  FaNewspaper,
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
import AccountDropdown from "./AccountDropdown";
import OrdersDropdown from "./OrdersDropdown";
import { getOpenTrades, getPricing } from "@/lib/oandaClient/route";
import ProfitCalculator from "./Trading/ProfitCalculatorModal";
import ActiveOrders from "./ActiveOrders";
import TradingHistory from "./TradingHistory";

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingDashboardProps {
  userData: any;
  stats: any;
}

export function TradingDashboard({
  userData,
  stats,
}: {
  userData: any;
  stats: any;
}) {
  const { user } = useUser();
  const [accountSummary, setAccountSummary] = useState<any>(null);
  const [openTrades, setOpenTrades] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [isOrdersOpen, setIsOrdersOpen] = useState(true);
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    accountType: "STANDARD",
    accountNumber: "Loading...",
    balance: 0,
    credit: 0,
    invested: 0,
    profit: 0,
    equity: 0,
    margin: 0,
    marginLevel: 0,
    freeMargin: 0,
  });
  const [activeOrders, setActiveOrders] = useState([]);
  const [tradingHistory, setTradingHistory] = useState([]);
  const [userTrades, setUserTrades] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const trades = await getOpenTrades();
        console.log("Fetched open trades:", trades); // Add this line
        const instruments = trades.trades.map((trade: any) => trade.instrument);
        const pricing = await getPricing(instruments);

        const updatedTrades = trades.trades.map((trade: any) => ({
          ...trade,
          currentPrice: pricing[trade.instrument]?.price?.ask || trade.price,
        }));

        console.log("Updated trades:", updatedTrades); // Add this line
        setOpenTrades(updatedTrades);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };

    fetchAccountData();
    const intervalId = setInterval(fetchAccountData, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await fetch("/api/account/details");
        if (!response.ok) {
          throw new Error("Failed to fetch account details");
        }
        const data = await response.json();
        setAccountDetails({
          accountType: "STANDARD",
          accountNumber: data.id,
          balance: data.balance,
          credit: data.credit,
          invested: data.totalDeposits,
          profit: stats.pnl,
          equity: data.balance + stats.pnl,
          margin: 0, // You may need to calculate this based on your business logic
          marginLevel: 0, // You may need to calculate this based on your business logic
          freeMargin: data.balance, // Assuming free margin is the same as balance for simplicity
        });
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    fetchAccountDetails();
  }, [stats.pnl]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
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
      save_image: true,
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

  useEffect(() => {
    fetchActiveOrders();
    fetchTradingHistory();
  }, []);

  const fetchActiveOrders = async () => {
    const response = await fetch("/api/trade/active");
    if (response.ok) {
      const data = await response.json();
      setActiveOrders(data);
    }
  };

  const fetchTradingHistory = async () => {
    const response = await fetch("/api/trade/history");
    if (response.ok) {
      const data = await response.json();
      setTradingHistory(data);
    }
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
          <div key={widget} className="flex-1 border-gray-700 flex flex-col">
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
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            Loading...
          </div>
        }
      >
        {(() => {
          switch (widgetName) {
            case "MARKET WATCH":
              return <MarketWatch />;
            case "ECONOMIC CALENDAR":
              return <EconomicCalendar showCalendar={true} />;
            case "MARKET NEWS":
              return <MarketNews />;
            case "ACTIVE ORDERS":
              return <ActiveOrders orders={activeOrders} />;

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
        <div
          className={`sm:text-xl md:text-2xl ${isActive ? "text-white" : ""}`}
        >
          {icon}
        </div>
        <span
          className={`mt-1 text-[8px] sm:text-xs md:text-sm text-center leading-tight${
            isActive ? "text-white" : ""
          }`}
        >
          {label}
        </span>
        {isActive && (
          <div className="absolute inset-0 bg-gray-700 opacity-20"></div>
        )}
      </button>
    );
  };

  return (
    <div className="bg-[#181F2D]  text-white h-screen flex flex-col">
      <header className="bg-[#181F2D] p-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Image
            src="/images/logo-cita-white.png"
            alt="CITA TRADING GROUP"
            width={120}
            height={36}
            className="w-24 sm:w-32 hidden sm:inline"
          />
          <button className="bg-#181F2D text-white px-9 py-2 rounded text-sm items-center hidden sm:flex border border-gray-400">
            <Image
              src="/images/gold-icon.png"
              alt="Gold"
              width={50}
              height={50}
              className="w-9 h-9 mr-2"
            />
            GOLD <br></br>metal
          </button>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-3">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard?view=deposit" passHref>
              <button className="bg-[#181F2D] hover:bg-[#4CAF50] text-[#4CAF50] hover:text-white font-semibold py-3 px-6 rounded transition-all duration-300 border border-[#4CAF50] flex items-center space-x-3 text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm3 2a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Deposit</span>
              </button>
            </Link>

            <div className="w-56">
              <AccountDropdown accountDetails={accountDetails} />
            </div>
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
        <aside className="flex flex-col w-16 sm:w-20 md:w-24 bg-[#181F2D] flex-shrink-0">
          {renderSidebarButton(
            <FaChartLine size={20} />,
            "MARKET WATCH",
            "MARKET WATCH"
          )}
          {renderSidebarButton(
            <FaShoppingCart size={20} />,
            "ACTIVE ORDERS",
            "ACTIVE ORDERS"
          )}
          {renderSidebarButton(
            <FaHistory size={20} />,
            "TRADING HISTORY",
            "TRADING HISTORY"
          )}
          {renderSidebarButton(
            <FaCalendarAlt size={20} />,
            "ECONOMIC CALENDAR",
            "ECONOMIC CALENDAR"
          )}
          {renderSidebarButton(
            <FaNewspaper size={20} />,
            "MARKET NEWS",
            "MARKET NEWS"
          )}
        </aside>

        <div className="flex-grow flex overflow-hidden relative">
          {/* Active Widgets */}
          {activeWidgets.length > 0 && (
            <div className="absolute inset-y-0 left-0 z-10 bg-gray-800 overflow-hidden lg:relative lg:w-64">
              {renderActiveWidgets()}
            </div>
          )}

          <main
            className={`flex-grow flex flex-col overflow-hidden ${
              activeWidgets.length > 0 ? "lg:ml-4" : ""
            }`}
          >
            <div className="flex-grow flex">
              <div id="tradingview_chart" className="w-full h-full flex-grow" />
            </div>

            {/* Orders Dropdown */}
            <div
              className={`transition-all duration-300 ${
                isOrdersOpen ? "h-48" : "h-10"
              } overflow-hidden`}
            >
              <OrdersDropdown
                isOpen={isOrdersOpen}
                onToggle={() => setIsOrdersOpen(!isOrdersOpen)}
              />
            </div>
          </main>

          {/* TradingWidget */}
          <div
            className={`hidden lg:block lg:w-96 bg-gray-800 overflow-hidden transition-all duration-300 ${
              isOrdersOpen ? "h-[calc(100%-12rem)]" : "h-[calc(100%-2.5rem)]"
            }`}
          >
            <ActiveOrders orders={activeOrders} />
          </div>
        </div>
      </div>

      <footer className="bg-[#181F2D] p-2 flex flex-wrap justify-between items-center text-xs border-t border-gray-700">
        <div className="flex items-center space-x-2 mb-1 sm:mb-0">
          <span>Balance: ${parseFloat(accountDetails.balance).toFixed(2)}</span>
          <span>Credit: ${accountDetails.credit}</span>
        </div>
        <div className="flex items-center space-x-2 mb-1 sm:mb-0">
          <span>
            Lifetime PnL: ${parseFloat(accountDetails.profit).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard?view=live-chat" passHref>
            <button className="text-blue-500 hover:text-blue-600 transition-colors duration-300">
              LIVE CHAT
            </button>
          </Link>
          <span>CURRENT TIME: {currentTime}</span>
        </div>
      </footer>
    </div>
  );
}

export default TradingDashboard;
