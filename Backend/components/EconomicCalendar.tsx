'use client';

import React, { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

interface EconomicCalendarProps {
  showCalendar: boolean;
}

function EconomicCalendar({ showCalendar }: EconomicCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !showCalendar) return;

    const widgetContainer = document.createElement("div");
    widgetContainer.id = "economicCalendarWidget";

    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.src = "https://www.tradays.com/c/js/widgets/calendar/widget.js?v=13";
    script.dataset.type = "calendar-widget";

    const config = {
      width: "100%",
      height: "100%",
      mode: "2",
      lang: "en",
      theme: 1,
    };

    script.text = JSON.stringify(config);

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(widgetContainer);
    containerRef.current.appendChild(script);

    script.onerror = () => {
      toast.error("Failed to load economic calendar widget");
    };

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [showCalendar]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-full bg-[#2c3035] rounded-lg"
    />
  );
}

export default EconomicCalendar;