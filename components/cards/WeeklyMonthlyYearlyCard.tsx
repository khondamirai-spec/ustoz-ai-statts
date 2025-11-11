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
import { useNewUsersData } from "@/hooks/useStatsData";

interface ChartPoint {
  x: number;
  y: number;
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
  
  // Set dates on client side only to avoid hydration mismatch
  useEffect(() => {
    setStartDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    setEndDate(new Date());
  }, []);
  
  const data = useNewUsersData(startDate, endDate);

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

  const formatDate = (date: Date | undefined, isStartDate: boolean = false) => {
    if (!date) {
      // Return default dates when undefined to avoid errors
      const defaultEnd = new Date('2024-01-31T00:00:00.000Z');
      const defaultStart = new Date('2024-01-01T00:00:00.000Z');
      return isStartDate ? defaultStart.toISOString().split('T')[0] : defaultEnd.toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  };

  const hasData = data.chartData.length > 0;
  const maxUsers = hasData
    ? Math.max(...data.chartData.map((d) => d.users))
    : 0;
  const chartWidth = 100;
  const chartHeight = 200;
  const chartEffectiveHeight = 160;
  const chartTop = chartHeight - chartEffectiveHeight;
  const horizontalPositions = (index: number) => {
    if (data.chartData.length <= 1) {
      return chartWidth / 2;
    }
    return (index / (data.chartData.length - 1)) * chartWidth;
  };
  const verticalPosition = (users: number) => {
    if (maxUsers === 0) {
      return chartHeight;
    }
    return chartHeight - (users / maxUsers) * chartEffectiveHeight;
  };

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const points = useMemo<ChartPoint[]>(() => {
    const mapped = data.chartData.map((d, i) => {
      const x = horizontalPositions(i);
      const y = verticalPosition(d.users);
      return { x, y };
    });
    // Ensure all points are valid and in order - this guarantees continuity
    return mapped.filter((p) => !isNaN(p.x) && !isNaN(p.y) && isFinite(p.x) && isFinite(p.y));
  }, [data.chartData, maxUsers, data.chartData.length]);

  const linePath = useMemo(
    () => (points.length ? buildSmoothLinePath(points) : ""),
    [points]
  );

  const areaPath = useMemo(
    () => (points.length ? buildSmoothAreaPath(points, chartHeight) : ""),
    [points, chartHeight]
  );

  const gridLineCount = 5;
  const gridLines = useMemo(
    () =>
      Array.from({ length: gridLineCount }, (_, i) =>
        chartTop + ((chartHeight - chartTop) * i) / (gridLineCount - 1)
      ),
    [chartHeight, chartTop, gridLineCount]
  );

  const xAxisLabels = useMemo(() => {
    if (!hasData) {
      return [] as { x: number; label: string }[];
    }

    const labelSlots = Math.min(6, data.chartData.length);

    if (labelSlots === 1) {
      return [
        {
          x: chartWidth / 2,
          label:
            data.chartData[0]?.axisLabel ?? data.chartData[0]?.date ?? "",
        },
      ];
    }

    const step = (data.chartData.length - 1) / (labelSlots - 1);

    return Array.from({ length: labelSlots }, (_, slot) => {
      const dataIndex = Math.round(slot * step);
      const point = points[dataIndex];

      return {
        x: point?.x ?? 0,
        label:
          data.chartData[dataIndex]?.axisLabel ??
          data.chartData[dataIndex]?.date ??
          "",
      };
    });
  }, [chartWidth, data.chartData, hasData, points]);

  const verticalHighlightX = useMemo(() => {
    if (!hasData) return [];
    const step = Math.max(1, Math.floor(data.chartData.length / 6));
    return points
      .map((point, index) => (index % step === 0 ? point.x : null))
      .filter((value): value is number => value !== null);
  }, [points, hasData, data.chartData.length]);

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

  const dailyAverage = hasData
    ? Math.round(data.totalUsers / data.chartData.length)
    : 0;
  const peakUsers = hasData
    ? Math.max(...data.chartData.map((d) => d.users))
    : 0;

  const hoveredPoint =
    hoveredIndex !== null ? points[hoveredIndex] : null;
  const hoveredData =
    hoveredIndex !== null ? data.chartData[hoveredIndex] : null;

  const tooltipStyle = hoveredPoint
    ? {
        left: `${(hoveredPoint.x / chartWidth) * 100}%`,
        top: `${((hoveredPoint.y / chartHeight) * 200 + 16)}px`, // Account for padding-top
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
        
        <div className="date-filter">
          <div className="date-input-group">
            <label htmlFor="start-date">From</label>
            <input
              id="start-date"
              type="date"
              value={formatDate(startDate, true)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="date-input"
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="end-date">To</label>
            <input
              id="end-date"
              type="date"
              value={formatDate(endDate, false)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="date-input"
            />
          </div>
        </div>
      </div>

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

      {/* Area Chart */}
      <div className="new-users-chart">
        <svg
          width="100%"
          height="200"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="area-chart"
          ref={svgRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id={areaGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(45, 213, 197, 0.48)" />
              <stop offset="50%" stopColor="rgba(45, 213, 197, 0.28)" />
              <stop offset="85%" stopColor="rgba(45, 213, 197, 0.12)" />
              <stop offset="100%" stopColor="rgba(45, 213, 197, 0.02)" />
            </linearGradient>
            <linearGradient id={lineGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#13c5ce" />
              <stop offset="50%" stopColor="#12b3e6" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {gridLines.map((y, index) => (
            <line
              key={`grid-horizontal-${index}`}
              x1="0"
              y1={formatCoordinate(y)}
              x2={formatCoordinate(chartWidth)}
              y2={formatCoordinate(y)}
              className="chart-grid-line"
            />
          ))}
          {verticalHighlightX.map((x, index) => (
            <line
              key={`grid-vertical-${index}`}
              x1={formatCoordinate(x)}
              y1={formatCoordinate(chartTop)}
              x2={formatCoordinate(x)}
              y2={formatCoordinate(chartHeight)}
              className="chart-grid-line chart-grid-line-vertical"
            />
          ))}
          
          {/* Generate area path */}
          <path
            d={areaPath}
            fill={`url(#${areaGradientId})`}
            className="chart-area"
          />
          
          {/* Generate line path */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={`url(#${lineGradientId})`}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              className="chart-line"
            />
          )}

          {hoveredPoint && (
            <>
              <line
                x1={formatCoordinate(hoveredPoint.x)}
                y1={formatCoordinate(chartTop)}
                x2={formatCoordinate(hoveredPoint.x)}
                y2={formatCoordinate(chartHeight)}
                className="chart-hover-line"
              />
              <circle
                cx={formatCoordinate(hoveredPoint.x)}
                cy={formatCoordinate(hoveredPoint.y)}
                r="4"
                fill="#0ea5e9"
                stroke="#fff"
                strokeWidth="1.6"
              />
            </>
          )}
        </svg>

        {xAxisLabels.length > 0 && (
          <div className="chart-x-axis">
            {xAxisLabels.map((axis, index) => (
              <div
                key={`axis-label-${index}-${axis.label}`}
                className="chart-x-tick"
                style={{
                  left: `${(axis.x / chartWidth) * 100}%`,
                }}
              >
                <span className="chart-x-tick-dot" />
                <span className="chart-x-label">{axis.label}</span>
              </div>
            ))}
          </div>
        )}

        {hoveredPoint && hoveredData && (
          <div className="chart-tooltip" style={tooltipStyle}>
            <span className="chart-tooltip-value">
              {hoveredData.users.toLocaleString()}
            </span>
            <span className="chart-tooltip-date">{hoveredData.date}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

