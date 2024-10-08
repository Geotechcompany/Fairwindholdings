import React, { useEffect, useRef } from "react";

interface EconomicCalendarProps {
  showCalendar: boolean;
}

const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ showCalendar }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !showCalendar) return;

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

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [showCalendar]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ backgroundColor: "#2c3035", borderRadius: "8px", minHeight: "100%" }}
    />
  );
};

export default EconomicCalendar;
