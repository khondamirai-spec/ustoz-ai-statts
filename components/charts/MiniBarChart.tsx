"use client";

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
  if (!chartData || chartData.length === 0) {
    return <div className="bar-vertical-grid">No data available</div>;
  }

  return (
    <div>
      <div className="bar-vertical-grid">
        {chartData.map((item, index) => (
          <div key={index} className="bar-vertical-wrapper">
            <div
              className="bar-vertical"
              style={{ height: `${item.value}px` }}
            >
              <span className="bar-value-text">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bar-vertical-dates">
        {chartData.map((item, index) => (
          <div key={index} className="bar-date-label">
            <span className="bar-date-day">{item.day}</span>
            <span className="bar-date-number">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

