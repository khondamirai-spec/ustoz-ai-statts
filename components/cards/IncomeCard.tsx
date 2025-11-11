"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import type { IncomeData } from "@/hooks/useIncomeData";

interface IncomeCardProps {
  data: IncomeData;
  title?: string;
  animate?: boolean;
  delay?: number;
}

export function IncomeCard({
  data,
  title = "Income",
  animate = true,
  delay = 0,
}: IncomeCardProps) {
  const safeData = {
    value: data?.value ?? 0,
    change: data?.change ?? 0,
    previousValue: data?.previousValue ?? 0,
    percentages: data?.percentages ?? [],
  };

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

  return (
    <motion.div
      className="card card-top purple-card"
      variants={animate ? { ...cardVariants, ...(hoverVariants || {}) } : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "visible" : undefined}
      whileHover={animate ? "hover" : undefined}
    >
      <header className="card-header">
        <div>
          <span className="card-title">{title}</span>
        </div>
        <motion.span
          className="floating-arrow"
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          ↗
        </motion.span>
      </header>
      <div className="card-metric">
        <h2>
          <AnimatedNumber value={safeData.value} />
        </h2>
        <motion.small
          initial={animate ? { opacity: 0, x: 16 } : undefined}
          animate={animate ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.52, delay: delay * 0.08 + 0.12 }}
        >
          +{safeData.change}%
        </motion.small>
      </div>
      <div className="purple-chart" style={{ display: 'none' }}>
        {[0, 1, 2].map((index) => (
          <motion.svg
            key={index}
            className="purple-wave"
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
            initial={animate ? { x: "-10%" } : undefined}
            animate={
              animate
                ? {
                    x: ["-10%", "10%", "-10%"],
                    transition: {
                      duration: 14 + index * 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * -3,
                    },
                  }
                : undefined
            }
          >
            <path
              fill={`url(#purpleGradient${index})`}
              d={
                index === 0
                  ? "M0 80 C40 65, 80 40, 120 52 C160 64, 200 110, 240 102 C280 94, 320 54, 360 70 C380 78, 400 90, 400 90 L400 200 L0 200 Z"
                  : index === 1
                  ? "M0 120 C40 110, 100 90, 150 105 C200 120, 240 140, 290 126 C340 112, 360 90, 400 102 L400 200 L0 200 Z"
                  : "M0 60 C60 40, 100 70, 150 60 C200 50, 240 85, 280 74 C320 63, 360 52, 400 60 L400 200 L0 200 Z"
              }
            />
            <defs>
              <linearGradient id={`purpleGradient${index}`} x1="0" x2="1" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={index === 0 ? "#a26bff" : index === 1 ? "#a26bff" : "#8b5cf6"}
                  stopOpacity={index === 0 ? 0.85 : index === 1 ? 0.45 : 0.3}
                />
                <stop
                  offset="100%"
                  stopColor={index === 0 ? "#d496ff" : index === 1 ? "#d496ff" : "#c084fc"}
                  stopOpacity={index === 0 ? 0.6 : index === 1 ? 0.2 : 0.18}
                />
              </linearGradient>
            </defs>
          </motion.svg>
        ))}
        {safeData.percentages.length > 0 && (
          <motion.div
            className="purple-tag"
            initial={animate ? { opacity: 0, y: 8 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: delay * 0.08 + 0.3 }}
          >
            {safeData.percentages.map((percent, idx) => (
              <span key={idx}>{percent}%</span>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

