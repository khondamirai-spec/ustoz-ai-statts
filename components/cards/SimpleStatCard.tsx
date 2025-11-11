"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";

interface SimpleStatCardProps {
  title: string;
  value: number;
  change: number;
  animate?: boolean;
  delay?: number;
}

const SimpleStatIcon = () => (
  <motion.svg
    className="card-header-icon"
    width={36}
    height={36}
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
    focusable="false"
    whileHover={{ scale: 1.08, rotate: 2 }}
    transition={{ duration: 0.22 }}
  >
    <rect
      x={3}
      y={3}
      width={30}
      height={30}
      rx={12}
      fill="rgba(14, 165, 233, 0.12)"
      stroke="rgba(14, 165, 233, 0.36)"
      strokeWidth={1.5}
    />
    <path
      d="M9 22.5L13.2 16.2L17.8 21.1L24 11"
      stroke="#0ea5e9"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx={13.4} cy={16} r={1.4} fill="#0ea5e9" />
    <circle cx={18} cy={21.2} r={1.3} fill="#0ea5e9" />
    <circle cx={24} cy={11} r={1.6} fill="#38bdf8" />
  </motion.svg>
);

export function SimpleStatCard({
  title,
  value,
  change,
  animate = true,
  delay = 0,
}: SimpleStatCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.48,
        ease: [0.22, 1, 0.36, 1] as const,
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
      className="card card-bottom"
      variants={animate ? { ...cardVariants, ...(hoverVariants || {}) } : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "visible" : undefined}
      whileHover={animate ? "hover" : undefined}
    >
      <header className="card-header">
        <div>
          <span className="card-title">{title}</span>
        </div>
        <SimpleStatIcon />
      </header>
      <div className="card-metric">
        <h2>
          <AnimatedNumber value={value} />
        </h2>
        <motion.small
          initial={animate ? { opacity: 0, x: 16 } : undefined}
          animate={animate ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.52, delay: delay * 0.08 + 0.12 }}
        >
          {change >= 0 ? '+' : ''}{change}%
        </motion.small>
      </div>
    </motion.div>
  );
}

