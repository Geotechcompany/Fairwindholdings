import React, { useEffect, useRef } from "react";

const MarketNews = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: "symbol",
      symbol: "OANDA:XAUUSD",
      isTransparent: false,
      displayMode: "adaptive",
      width: "100%",
      height: "100%",
      colorTheme: "dark",
      locale: "en",
    });

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full" style={{ minHeight: "100%" }} />
  );
};

export default MarketNews;
