"use client";

import { motion } from "framer-motion";
import { useBarData } from "@/hooks/useBarData";
import type { CSSProperties } from "react";

interface BarChartGradientProps {
  animate?: boolean;
  delay?: number;
}

export function BarChartGradient({ animate = true, delay = 0 }: BarChartGradientProps) {
  const barData = useBarData();

  if (!barData || barData.length === 0) {
    return <div className="bar-chart">No data available</div>;
  }

  return (
    <>
      <div className="bar-chart">
        {barData.map((bar, index) => (
          <motion.div
            key={bar.label}
            className="bar"
            style={
              {
                "--bar-height": `${bar.height}px`,
                "--bar-delay": `${index * 80}ms`,
              } as CSSProperties
            }
            initial={animate ? { height: 0 } : undefined}
            animate={animate ? { height: bar.height } : undefined}
            transition={{
              duration: 0.88,
              ease: "easeOut",
              delay: delay * 0.08 + index * 0.08,
            }}
            whileHover={animate ? { y: -4 } : undefined}
          >
            <motion.span
              className="bar-value"
              initial={animate ? { opacity: 0, y: 12 } : undefined}
              animate={animate ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.4, delay: delay * 0.08 + index * 0.08 + 0.3 }}
            >
              {bar.amount}
            </motion.span>
          </motion.div>
        ))}
      </div>
      <div className="baseline">
        {barData.map((bar) => (
          <span key={bar.label}>{bar.label}</span>
        ))}
      </div>
    </>
  );
}

