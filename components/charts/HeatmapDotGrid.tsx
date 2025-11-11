"use client";

import { motion } from "framer-motion";
import { useHeatmapData } from "@/hooks/useHeatmapData";

interface HeatmapDotGridProps {
  animate?: boolean;
  delay?: number;
}

export function HeatmapDotGrid({ animate = true, delay = 0 }: HeatmapDotGridProps) {
  const heatmapData = useHeatmapData();

  if (!heatmapData || heatmapData.length === 0) {
    return <div className="dot-grid">No data available</div>;
  }

  return (
    <motion.div
      className="dot-grid"
      whileHover={animate ? { scale: 1.03 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {heatmapData.map((dot, index) => (
        <motion.span
          key={index}
          className="heat-dot"
          style={{
            opacity: dot.intensity,
          }}
          initial={animate ? { scale: 0.88, opacity: 0.6 } : undefined}
          animate={
            animate
              ? {
                  scale: [0.88, 1.08, 0.88],
                  opacity: [0.6, 1, 0.6],
                  transition: {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: dot.delay / 1000,
                  },
                }
              : undefined
          }
        />
      ))}
    </motion.div>
  );
}

