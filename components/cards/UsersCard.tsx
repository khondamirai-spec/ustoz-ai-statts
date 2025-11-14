"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { useMainStats } from "@/hooks/useMainStats";

const UsersIcon = () => (
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
      fill="rgba(147, 51, 234, 0.12)"
      stroke="rgba(147, 51, 234, 0.32)"
      strokeWidth={1.5}
    />
    <circle
      cx={18}
      cy={14.5}
      r={5}
      stroke="#9333ea"
      strokeWidth={1.6}
      fill="rgba(147, 51, 234, 0.18)"
    />
    <path
      d="M11.5 26C12.4 22.8 15.1 20.5 18 20.5C20.9 20.5 23.6 22.8 24.5 26"
      stroke="#a855f7"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.4 16.5C25.3 16.8 26.8 18.5 27 20.5"
      stroke="#c084fc"
      strokeWidth={1.4}
      strokeLinecap="round"
    />
    <path
      d="M12.6 16.5C10.7 16.8 9.2 18.5 9 20.5"
      stroke="#c084fc"
      strokeWidth={1.4}
      strokeLinecap="round"
    />
  </motion.svg>
);

interface UsersCardProps {
  title?: string;
  animate?: boolean;
  delay?: number;
}

export function UsersCard({
  title = "Foydalanuvchilar",
  animate = true,
  delay = 0,
}: UsersCardProps) {
  const { data, loading } = useMainStats();

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
        <UsersIcon />
      </header>
      <div className="card-metric">
        <h2>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <AnimatedNumber value={data?.users || 0} />
          )}
        </h2>
      </div>
    </motion.div>
  );
}

