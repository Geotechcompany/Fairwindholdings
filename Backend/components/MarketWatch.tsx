import React, { useEffect } from "react";

const MarketWatch = () => {
    useEffect(() => {
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
            width: "400",
            height: "465",
            tabs: [
                {
                    title: "Forex",
                    symbols: [
                        { s: "OANDA:XAUUSD", d: "XAU to USD" },
                        { s: "FX:EURUSD", d: "EUR to USD" },
                        { s: "FX:GBPUSD", d: "GBP to USD" },
                        { s: "FX:USDJPY", d: "USD to JPY" },
                        { s: "FX:AUDUSD", d: "AUD to USD" },
                        { s: "FX:USDCAD", d: "USD to CAD" }
                    ],
                    originalTitle: "Forex"
                },
                {
                    title: "Indices",
                    symbols: [
                        { s: "FOREXCOM:SPXUSD", d: "S&P 500 Index" },
                        { s: "FOREXCOM:NSXUSD", d: "US 100 Cash CFD" },
                        { s: "FOREXCOM:DJI", d: "Dow Jones Industrial Average Index" },
                        { s: "INDEX:NKY", d: "Nikkei 225" },
                        { s: "INDEX:DEU40", d: "DAX Index" },
                        { s: "FOREXCOM:UKXGBP", d: "FTSE 100 Index" }
                    ],
                    originalTitle: "Indices"
                },
                {
                    title: "Futures",
                    symbols: [
                        { s: "CME_MINI:ES1!", d: "S&P 500" },
                        { s: "CME:6E1!", d: "Euro" },
                        { s: "COMEX:GC1!", d: "Gold" },
                        { s: "NYMEX:CL1!", d: "WTI Crude Oil" },
                        { s: "NYMEX:NG1!", d: "Gas" },
                        { s: "CBOT:ZC1!", d: "Corn" }
                    ],
                    originalTitle: "Futures"
                },
                {
                    title: "Bonds",
                    symbols: [
                        { s: "CBOT:ZB1!", d: "T-Bond" },
                        { s: "CBOT:UB1!", d: "Ultra T-Bond" },
                        { s: "EUREX:FGBL1!", d: "Euro Bund" },
                        { s: "EUREX:FBTP1!", d: "Euro BTP" },
                        { s: "EUREX:FGBM1!", d: "Euro BOBL" }
                    ],
                    originalTitle: "Bonds"
                }
            ]
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
            <div className="tradingview-widget-copyright">
            </div>
        </div>
    );
};

export default MarketWatch;
