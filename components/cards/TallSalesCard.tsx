"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { MiniBarChart } from "@/components/charts/MiniBarChart";
import type { VideoViewsData } from "@/hooks/useVideoViewsData";

interface TallSalesCardProps {
  data: VideoViewsData;
  title?: string;
  animate?: boolean;
  delay?: number;
}

export function TallSalesCard({ 
  data, 
  title = "Kunlik ko'rilgan videodarslar soni",
  animate = true, 
  delay = 0 
}: TallSalesCardProps) {
  const safeData = {
    value: data?.value ?? 0,
    change: data?.change ?? 0,
    avgScore: data?.avgScore ?? 0,
    monthly: data?.monthly ?? 0,
    yearly: data?.yearly ?? 0,
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
      className="card card-tall"
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
      <div>
        <p className="card-subtitle" style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
          Bugun
        </p>
        <div className="card-metric">
          <h2>
            <AnimatedNumber value={safeData.value} />
          </h2>
          <motion.small
          initial={animate ? { opacity: 0, x: 16 } : undefined}
          animate={animate ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.52, delay: delay * 0.08 + 0.12 }}
          >
            {safeData.change > 0 ? '+' : ''}{safeData.change}%
          </motion.small>
        </div>
      </div>
      <MiniBarChart animate={animate} delay={delay} />
      <div className="card-total-label">
        <div className="stat-main">
          <span className="stat-label">JAMI KO'RGANALAR</span>
          <strong className="stat-value">{safeData.avgScore.toLocaleString()}</strong>
        </div>
        <svg className="stat-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="rgba(46, 212, 122, 0.2)" stroke="rgba(46, 212, 122, 0.4)" strokeWidth="1.5"/>
          <path d="M2 17L12 22L22 17" stroke="rgba(46, 212, 122, 0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="rgba(46, 212, 122, 0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </motion.div>
  );
}

