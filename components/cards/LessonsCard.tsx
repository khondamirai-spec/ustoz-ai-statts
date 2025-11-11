"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { useMainStats } from "@/hooks/useMainStats";

const LessonsIcon = () => (
  <motion.svg
    className="card-header-icon"
    width={36}
    height={36}
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
    focusable="false"
    whileHover={{ scale: 1.08 }}
    transition={{ duration: 0.22 }}
  >
    <rect
      x={3}
      y={3}
      width={30}
      height={30}
      rx={12}
      fill="rgba(59, 130, 246, 0.12)"
      stroke="rgba(59, 130, 246, 0.32)"
      strokeWidth={1.5}
    />
    <rect
      x={10}
      y={10}
      width={16}
      height={12}
      rx={2}
      stroke="#3b82f6"
      strokeWidth={1.6}
      fill="rgba(59, 130, 246, 0.08)"
    />
    <path
      d="M14 16L18 19L22 16"
      stroke="#3b82f6"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

interface LessonsCardProps {
  title?: string;
  animate?: boolean;
  delay?: number;
}

export function LessonsCard({
  title = "Video darslar soni",
  animate = true,
  delay = 0,
}: LessonsCardProps) {
  const { data, loading } = useMainStats();

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
        <LessonsIcon />
      </header>
      <div className="card-metric">
        <h2>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <AnimatedNumber value={data?.lessons || 0} />
          )}
        </h2>
      </div>
    </motion.div>
  );
}

