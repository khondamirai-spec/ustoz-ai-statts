"use client";

import { useState, useEffect } from "react";

interface ChartDataPoint {
  day: string;
  date: number;
  value: number;
}

interface MiniBarChartProps {
  chartData?: ChartDataPoint[];
  animate?: boolean;
  delay?: number;
}

export function MiniBarChart({ chartData, animate = true, delay = 0 }: MiniBarChartProps) {
  const [containerHeight, setContainerHeight] = useState(140);

  useEffect(() => {
    // Calculate responsive container height based on viewport
    const updateHeight = () => {
      const height = Math.min(window.innerHeight * 0.15, 180);
      setContainerHeight(height);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  if (!chartData || chartData.length === 0) {
    return <div className="bar-vertical-grid">No data available</div>;
  }

  // ✅ Ensure exactly 7 days are shown (take only the last 7 items)
  const displayData = chartData.slice(-7);

  // Calculate scaling to fit within container height (responsive)
  // Ensure values are numbers
  const values = displayData.map(item => Number(item.value));
  const maxValue = Math.max(...values);
  const scaleFactor = maxValue > 0 ? containerHeight / maxValue : 1;

  return (
    <div>
      <div className="bar-vertical-grid">
        {displayData.map((item, index) => {
          const numericValue = Number(item.value);
          const scaledHeight = Math.max(3, Math.min(numericValue * scaleFactor, containerHeight));
          return (
            <div key={index} className="bar-vertical-wrapper">
              <span className="bar-value-text">{numericValue.toLocaleString()}</span>
              <div
                className="bar-vertical"
                style={{ 
                  height: `${scaledHeight}px`,
                  minHeight: '3px',
                  maxHeight: `${containerHeight}px`
                }}
                title={numericValue.toLocaleString()}
              />
              <div className="bar-date-label-inline">
                <span className="bar-date-day">{item.day}</span>
                <span className="bar-date-number">{item.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

