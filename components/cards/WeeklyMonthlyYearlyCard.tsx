"use client";

import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MouseEvent } from "react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { useDailyUsers } from "@/hooks/useDailyUsers";

interface ChartPoint {
  x: number;
  y: number;
  dataIndex: number;
}

const formatCoordinate = (value: number) =>
  Number.parseFloat(value.toFixed(2)).toString();

const buildSmoothCommands = (points: ChartPoint[]) => {
  if (points.length === 0) {
    return [] as string[];
  }

  if (points.length === 1) {
    return [`M ${formatCoordinate(points[0].x)},${formatCoordinate(points[0].y)}`];
  }

  const commands: string[] = [
    `M ${formatCoordinate(points[0].x)},${formatCoordinate(points[0].y)}`,
  ];

  // For each segment, ensure we connect smoothly to the next point
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Calculate distance between points to determine if we need smooth curve
    const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    
    // If points are very close, use straight line to avoid gaps
    if (dist < 0.5) {
      commands.push(`L ${formatCoordinate(p2.x)},${formatCoordinate(p2.y)}`);
      continue;
    }

    // Calculate control points using Catmull-Rom spline approach
    // This ensures smooth, continuous curves
    const tension = 0.3; // Reduced tension for tighter curves
    const t = tension;
    
    // Control point 1: based on previous and current point
    const cp1x = p1.x + (p2.x - p0.x) * t;
    const cp1y = p1.y + (p2.y - p0.y) * t;
    
    // Control point 2: based on current and next point  
    const cp2x = p2.x - (p3.x - p1.x) * t;
    const cp2y = p2.y - (p3.y - p1.y) * t;

    // Always connect to the next point - guaranteed continuity
    // The curve ends exactly at p2, ensuring no gaps
    commands.push(
      `C ${formatCoordinate(cp1x)},${formatCoordinate(cp1y)} ${formatCoordinate(
        cp2x
      )},${formatCoordinate(cp2y)} ${formatCoordinate(p2.x)},${formatCoordinate(
        p2.y
      )}`
    );
  }

  return commands;
};

const buildSmoothLinePath = (points: ChartPoint[]) => {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M ${formatCoordinate(points[0].x)},${formatCoordinate(points[0].y)}`;
  }
  if (points.length === 2) {
    return `M ${formatCoordinate(points[0].x)},${formatCoordinate(points[0].y)} L ${formatCoordinate(points[1].x)},${formatCoordinate(points[1].y)}`;
  }
  
  // Build smooth path ensuring continuity
  const path = buildSmoothCommands(points).join(" ");
  
  // Verify path starts at first point and ends at last point
  const firstX = formatCoordinate(points[0].x);
  const firstY = formatCoordinate(points[0].y);
  const lastX = formatCoordinate(points[points.length - 1].x);
  const lastY = formatCoordinate(points[points.length - 1].y);
  
  // Ensure path starts correctly
  if (!path.startsWith(`M ${firstX},${firstY}`)) {
    return `M ${firstX},${firstY} ${path}`;
  }
  
  // Ensure path ends at the last point (it should from our algorithm, but verify)
  if (!path.includes(`${lastX},${lastY}`)) {
    return `${path} L ${lastX},${lastY}`;
  }
  
  return path;
};

const buildSmoothAreaPath = (points: ChartPoint[], chartHeight: number) => {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${formatCoordinate(points[0].x)},${formatCoordinate(chartHeight)} L ${formatCoordinate(points[0].x)},${formatCoordinate(points[0].y)} L ${formatCoordinate(points[0].x)},${formatCoordinate(chartHeight)} Z`;
  }

  const commands = buildSmoothCommands(points);
  const lineCommands = commands.slice(1); // Skip the initial M command
  
  return [
    `M ${formatCoordinate(points[0].x)},${formatCoordinate(chartHeight)}`,
    `L ${formatCoordinate(points[0].x)},${formatCoordinate(points[0].y)}`,
    ...lineCommands,
    `L ${formatCoordinate(points[points.length - 1].x)},${formatCoordinate(
      chartHeight
    )}`,
    "Z",
  ].join(" ");
};

interface WeeklyMonthlyYearlyCardProps {
  animate?: boolean;
  delay?: number;
}

export function WeeklyMonthlyYearlyCard({
  animate = true,
  delay = 0,
}: WeeklyMonthlyYearlyCardProps) {
  // Use undefined initially to avoid hydration mismatch, then set in useEffect
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDateStr, setStartDateStr] = useState<string>("");
  const [endDateStr, setEndDateStr] = useState<string>("");
  
  // Set dates on client side only to avoid hydration mismatch
  useEffect(() => {
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = new Date();
    setStartDate(start);
    setEndDate(end);
    setStartDateStr(start.toISOString().split("T")[0]);
    setEndDateStr(end.toISOString().split("T")[0]);
  }, []);
  
  const dailyUsersData = useDailyUsers(startDateStr, endDateStr);
  
  // Transform API data to match the component's expected format
  const data = useMemo(() => {
    const chartData = dailyUsersData.data.map((item) => {
      const date = new Date(item.date);
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        axisLabel: date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
        }),
        isoDate: date.toISOString(),
        users: item.count,
      };
    });
    
    return {
      totalUsers: dailyUsersData.total,
      change: dailyUsersData.growth,
      chartData,
    };
  }, [dailyUsersData]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.48,
        ease: [0.22, 1, 0.36, 1],
        delay: delay * 0.08,
      },
    },
  };

  const hoverVariants = animate ? {
    hover: {
      y: -6,
      scale: 1.02,
      transition: { duration: 0.22 },
    },
  } : undefined;

  const hasData = data.chartData.length > 0;
  const maxUsers = hasData
    ? Math.max(...data.chartData.map((d) => d.users))
    : 0;
  const chartWidth = 100;
  const chartHeight = 200;
  const chartEffectiveHeight = 160;
  const chartTop = chartHeight - chartEffectiveHeight;
  const normalizedMaxUsers = hasData
    ? Math.max(100, Math.ceil(maxUsers / 100) * 100)
    : 100;
  const horizontalPositions = (index: number) => {
    if (data.chartData.length <= 1) {
      return chartWidth / 2;
    }
    return (index / (data.chartData.length - 1)) * chartWidth;
  };
  const verticalPosition = (users: number) => {
    if (normalizedMaxUsers === 0) {
      return chartHeight;
    }
    return chartHeight - (users / normalizedMaxUsers) * chartEffectiveHeight;
  };

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const points = useMemo<ChartPoint[]>(() => {
    const mapped = data.chartData.map((d, i) => {
      const x = horizontalPositions(i);
      const y = verticalPosition(d.users);
      if (!isFinite(x) || !isFinite(y) || isNaN(x) || isNaN(y)) {
        return null;
      }
      return { x, y, dataIndex: i };
    });

    return mapped.filter((point): point is ChartPoint => point !== null);
  }, [data.chartData, maxUsers]);

  const linePath = useMemo(
    () => (points.length ? buildSmoothLinePath(points) : ""),
    [points]
  );

  const areaPath = useMemo(
    () => (points.length ? buildSmoothAreaPath(points, chartHeight) : ""),
    [points, chartHeight]
  );

  const yAxisTicks = useMemo(() => {
    const segments = 4;
    return Array.from({ length: segments + 1 }, (_, index) => {
      const ratio = index / segments;
      const value = Math.round(normalizedMaxUsers * (1 - ratio));
      const y = chartTop + ratio * chartEffectiveHeight;
      return { value, y };
    });
  }, [chartEffectiveHeight, chartTop, normalizedMaxUsers]);

  const xAxisLabels = useMemo(() => {
    if (!hasData || points.length === 0) {
      return [] as { label: string; x: number; percent: number }[];
    }

    const labelSlots = Math.min(8, data.chartData.length);

    if (labelSlots === 1) {
      const point = points[0];
      const label =
        data.chartData[0]?.axisLabel ?? data.chartData[0]?.date ?? "";
      return [
        {
          label,
          x: point?.x ?? chartWidth / 2,
          percent: (point?.x ?? chartWidth / 2) / chartWidth,
        },
      ];
    }

    const denominator = Math.max(labelSlots - 1, 1);
    const step = (data.chartData.length - 1) / denominator;

    return Array.from({ length: labelSlots }, (_, slot) => {
      const dataIndex = Math.round(slot * step);
      const point = points.find((pt) => pt.dataIndex === dataIndex);
      const label =
        data.chartData[dataIndex]?.axisLabel ??
        data.chartData[dataIndex]?.date ??
        "";
      const x = point?.x ?? (slot / denominator) * chartWidth;
      return {
        label,
        x,
        percent: x / chartWidth,
      };
    });
  }, [chartWidth, data.chartData, hasData, points]);

  const horizontalGridLines = useMemo(
    () => yAxisTicks.map((tick) => tick.y),
    [yAxisTicks]
  );

  const verticalGridLines = useMemo(
    () => xAxisLabels.map((axis) => axis.x),
    [xAxisLabels]
  );

  const rawGradientId = useId();
  const baseGradientId = useMemo(
    () => rawGradientId.replace(/:/g, "-"),
    [rawGradientId]
  );
  const lineGradientId = `${baseGradientId}-line`;
  const areaGradientId = `${baseGradientId}-area`;
  const handleMouseMove = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current || points.length === 0) {
        return;
      }

      const rect = svgRef.current.getBoundingClientRect();
      const relativeX =
        ((event.clientX - rect.left) / rect.width) * chartWidth;

      let closestIndex = 0;
      let minDistance = Number.MAX_VALUE;

      points.forEach((point, index) => {
        const distance = Math.abs(point.x - relativeX);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setHoveredIndex(closestIndex);
    },
    [chartWidth, points]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  const dailyAverage = dailyUsersData.dailyAvg;
  const peakUsers = dailyUsersData.peakDay;

  const hoveredPoint =
    hoveredIndex !== null ? points[hoveredIndex] : null;
  const hoveredData = hoveredPoint
    ? data.chartData[hoveredPoint.dataIndex]
    : null;

  const tooltipStyle = hoveredPoint
    ? {
        left: `${(hoveredPoint.x / chartWidth) * 100}%`,
        top: `${(hoveredPoint.y / chartHeight) * 100}%`,
      }
    : undefined;

  return (
    <motion.div
      className="card card-large new-users-card"
      variants={animate ? { ...cardVariants, ...(hoverVariants || {}) } : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "visible" : undefined}
      whileHover={animate ? "hover" : undefined}
    >
      <div className="new-users-header">
        <div>
          <h3 className="new-users-title">Daily Lesson Activity</h3>
          <p className="new-users-subtitle">New Users Registration Overview</p>
        </div>
        
        {/* Clean Date Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="date"
              value={startDateStr}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : undefined;
                setStartDate(date);
                setStartDateStr(e.target.value);
              }}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all cursor-pointer"
            />
          </div>
          <span className="text-slate-400 font-semibold text-lg">—</span>
          <div className="relative">
            <input
              type="date"
              value={endDateStr}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : undefined;
                setEndDate(date);
                setEndDateStr(e.target.value);
              }}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>

      {dailyUsersData.loading ? (
        <div className="new-users-stats">
          <div className="stat-main">
            <span className="stat-label">Total New Users</span>
            <div className="stat-value-row">
              <strong className="stat-value">Loading...</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="new-users-stats">
          <div className="stat-main">
            <span className="stat-label">Total New Users</span>
            <div className="stat-value-row">
              <strong className="stat-value">
                <AnimatedNumber value={data.totalUsers} />
              </strong>
              <span
                className={`stat-change ${data.change >= 0 ? "positive" : "negative"}`}
                data-symbol={data.change >= 0 ? "↑" : "↓"}
              >
                {data.change >= 0 ? '+' : ''}{data.change}%
              </span>
            </div>
          </div>
          <div className="stat-meta">
            <span>Daily Average: {dailyAverage}</span>
            <span>Peak Day: {peakUsers}</span>
          </div>
        </div>
      )}

      <div className="lesson-activity-chart">
        <div className="lesson-axis lesson-axis--y">
          {yAxisTicks.map((tick, index) => (
            <span key={`y-axis-${index}-${tick.value}`}>
              {tick.value.toLocaleString()}
            </span>
          ))}
        </div>

        <div className="lesson-chart-wrapper">
          <svg
            ref={svgRef}
            className="lesson-chart-svg"
            role="img"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id={areaGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(34, 211, 238, 0.45)" />
                <stop offset="70%" stopColor="rgba(34, 211, 238, 0.12)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </linearGradient>
              <linearGradient id={lineGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>

            {horizontalGridLines.map((y, index) => (
              <line
                key={`grid-horizontal-${index}`}
                x1="0"
                x2={formatCoordinate(chartWidth)}
                y1={formatCoordinate(y)}
                y2={formatCoordinate(y)}
                className="lesson-grid-line"
              />
            ))}

            {verticalGridLines.map((x, index) => (
              <line
                key={`grid-vertical-${index}`}
                x1={formatCoordinate(x)}
                x2={formatCoordinate(x)}
                y1={formatCoordinate(chartTop)}
                y2={formatCoordinate(chartHeight)}
                className="lesson-grid-line lesson-grid-line--vertical"
              />
            ))}

            {areaPath && (
              <path
                d={areaPath}
                fill={`url(#${areaGradientId})`}
                className="lesson-area"
              />
            )}

            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke={`url(#${lineGradientId})`}
                className="lesson-line"
              />
            )}

            {hoveredPoint && (
              <>
                <line
                  x1={formatCoordinate(hoveredPoint.x)}
                  x2={formatCoordinate(hoveredPoint.x)}
                  y1={formatCoordinate(chartTop)}
                  y2={formatCoordinate(chartHeight)}
                  className="lesson-hover-line"
                />
                <circle
                  cx={formatCoordinate(hoveredPoint.x)}
                  cy={formatCoordinate(hoveredPoint.y)}
                  r="2.4"
                  className="lesson-hover-dot"
                />
              </>
            )}
          </svg>

          {hoveredPoint && hoveredData && (
            <div className="lesson-tooltip" style={tooltipStyle}>
              <span className="lesson-tooltip__value">
                {hoveredData.users.toLocaleString()}
              </span>
              <span className="lesson-tooltip__date">{hoveredData.date}</span>
            </div>
          )}
        </div>

        <div className="lesson-axis lesson-axis--x">
          {xAxisLabels.map((axis, index) => (
            <span
              key={`${axis.label}-${index}`}
              className="lesson-axis__label"
              style={{ left: `${axis.percent * 100}%` }}
            >
              {axis.label}
            </span>
          ))}
        </div>

        <div className="lesson-legend">
          <span className="lesson-legend__dot" />
          Lessons
        </div>
      </div>
    </motion.div>
  );
}
