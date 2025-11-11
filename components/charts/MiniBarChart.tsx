"use client";

import { useState, useEffect } from "react";
import { useMiniBarData } from "@/hooks/useMiniBarData";

interface MiniBarChartProps {
  animate?: boolean;
  delay?: number;
}

function getLast7Days(): { day: string; date: number }[] {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString('uz-UZ', { weekday: 'short' });
    const dayNumber = date.getDate();
    days.push({ day: dayName, date: dayNumber });
  }

  return days;
}

export function MiniBarChart({ animate = true, delay = 0 }: MiniBarChartProps) {
  const miniBarData = useMiniBarData();
  const [dates, setDates] = useState<{ day: string; date: number }[]>([]);

  useEffect(() => {
    setDates(getLast7Days());
  }, []);

  if (!miniBarData || miniBarData.length === 0) {
    return <div className="bar-vertical-grid">No data available</div>;
  }

  return (
    <div>
      <div className="bar-vertical-grid">
        {miniBarData.map((bar) => (
          <div key={bar.label} className="bar-vertical-wrapper">
            <div
              className="bar-vertical"
              style={{ height: `${bar.height}px` }}
            >
              <span className="bar-value-text">{bar.height}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bar-vertical-dates">
        {dates.length > 0 && dates.map((item, index) => (
          <div key={index} className="bar-date-label">
            <span className="bar-date-day">{item.day}</span>
            <span className="bar-date-number">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

