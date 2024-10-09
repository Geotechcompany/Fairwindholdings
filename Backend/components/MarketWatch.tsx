import React, { useEffect, useRef } from "react";

const MarketWatch = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
            colorTheme: "dark",
            dateRange: "12M",
            showChart: false,
            locale: "en",
            largeChartUrl: "",
            isTransparent: false,
            showSymbolLogo: true,
            showFloatingTooltip: false,
            width: "100%",
            height: "100%",
            tabs: [
                {
                    title: "Forex",
                    symbols: [
                        { s: "OANDA:XAUUSD", d: "XAU to USD" }
                    ],
                    originalTitle: "Forex"
                }
            ]
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

export default MarketWatch;