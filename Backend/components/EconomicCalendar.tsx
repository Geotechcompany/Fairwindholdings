import React, { useEffect } from "react";

interface EconomicCalendarProps {
  showCalendar: boolean;
}

const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ showCalendar }) => {
  useEffect(() => {
    const widgetContainer = document.getElementById("economicCalendarWidget");

    if (showCalendar) {
      if (widgetContainer) {
        widgetContainer.innerHTML = "";
      }

      const script = document.createElement("script");
      script.async = true;
      script.type = "text/javascript";
      script.src = "https://www.tradays.com/c/js/widgets/calendar/widget.js?v=13";
      script.dataset.type = "calendar-widget";

      script.innerHTML = JSON.stringify({
        width: "100%",
        height: "100%",
        mode: "2",
        lang: "en",
        theme: 1,  
      });

      if (widgetContainer) {
        widgetContainer.appendChild(script);
      }

      return () => {
        if (widgetContainer) {
          while (widgetContainer.firstChild) {
            widgetContainer.removeChild(widgetContainer.firstChild);
          }
        }
      };
    }
  }, [showCalendar]);

  return (
    <div
      id="economicCalendarWidget"
      style={{ height: "100%", backgroundColor: "#2c3035", borderRadius: "8px" }}
    >
      {/* Economic calendar will be injected here */}
    </div>
  );
};

export default EconomicCalendar;
