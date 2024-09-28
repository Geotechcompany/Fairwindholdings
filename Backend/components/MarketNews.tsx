import React, { useEffect } from "react";

const MarketNews = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: "symbol",
      symbol: "OANDA:XAUUSD",
      isTransparent: false,
      displayMode: "adaptive",
      width: "400",
      height: "550",
      colorTheme: "dark",
      locale: "en",
    });

    const widgetContainer = document.querySelector(".tradingview-widget-container__widget");
    if (widgetContainer && !widgetContainer.firstChild) {
      widgetContainer.appendChild(script);
    }

    return () => {
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default MarketNews;
