"use client";

import { motion } from "framer-motion";
import { useScatterData } from "@/hooks/useScatterData";

interface ScatterDotChartProps {
  animate?: boolean;
  delay?: number;
}

export function ScatterDotChart({ animate = true, delay = 0 }: ScatterDotChartProps) {
  const scatterData = useScatterData();

  if (!scatterData || scatterData.length === 0) {
    return <div className="spark-dots">No data available</div>;
  }

  return (
    <div className="spark-dots">
      {scatterData.map((_, index) => (
        <motion.span
          key={index}
          className="spark-dot"
          initial={animate ? { opacity: 0.7, scale: 1, x: -3 } : undefined}
          animate={
            animate
              ? {
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.08, 1],
                  x: [-3, 4, -3],
                  transition: {
                    duration: index % 2 === 0 ? 2.2 : 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index % 2 === 1 ? 0.6 : 0,
                  },
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}

