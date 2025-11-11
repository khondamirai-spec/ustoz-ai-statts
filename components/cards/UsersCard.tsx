"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { useNewUsersData } from "@/hooks/useStatsData";
import { useEffect, useState } from "react";

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
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
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
          <AnimatedNumber value={data.totalUsers} />
        </h2>
        <motion.small
          initial={animate ? { opacity: 0, x: 16 } : undefined}
          animate={animate ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.52, delay: delay * 0.08 + 0.12 }}
        >
          {data.change >= 0 ? '+' : ''}{data.change}%
        </motion.small>
      </div>
    </motion.div>
  );
}

