"use client";

import { motion } from "framer-motion";
import { useLineChartData } from "@/hooks/useLineChartData";

interface LineSparkChartProps {
  animate?: boolean;
  delay?: number;
}

export function LineSparkChart({ animate = true, delay = 0 }: LineSparkChartProps) {
  const lineData = useLineChartData();

  if (!lineData || lineData.length === 0) {
    return <div className="line-card">No data available</div>;
  }

  // Convert points to SVG path
  const pathD = lineData
    .map((point, index) => {
      if (index === 0) return `M${point.x} ${point.y}`;
      const prevPoint = lineData[index - 1];
      const cp1x = prevPoint.x + (point.x - prevPoint.x) / 3;
      const cp1y = prevPoint.y;
      const cp2x = point.x - (point.x - prevPoint.x) / 3;
      const cp2y = point.y;
      return `C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
    })
    .join(" ");

  return (
    <div className="line-card">
      <svg viewBox="0 0 400 120">
        <motion.path
          className="line-path"
          d={pathD}
          strokeWidth={1}
          initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{
            pathLength: { duration: 1.4, ease: "easeInOut", delay: delay * 0.08 },
            opacity: { duration: 0.5, delay: delay * 0.08 },
          }}
        />
      </svg>
      <motion.div
        className="line-glow"
        initial={animate ? { opacity: 0.1 } : undefined}
        animate={
          animate
            ? {
                opacity: [0.1, 0.45, 0.1],
                transition: {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
            : undefined
        }
      />
    </div>
  );
}

