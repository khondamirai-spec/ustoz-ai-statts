"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { MiniBarChart } from "@/components/charts/MiniBarChart";
import type { VideoViewsData } from "@/hooks/useVideoViewsData";
import { useDailyViews } from "@/hooks/useDailyViews";

const TallSalesIcon = () => (
  <motion.svg
    className="card-header-icon"
    width={36}
    height={36}
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
    focusable="false"
    whileHover={{ scale: 1.08, rotate: 1.5 }}
    transition={{ duration: 0.22 }}
  >
    <rect
      x={3}
      y={3}
      width={30}
      height={30}
      rx={12}
      fill="rgba(16, 185, 129, 0.12)"
      stroke="rgba(16, 185, 129, 0.32)"
      strokeWidth={1.5}
    />
    <rect x={12} y={12} width={3.5} height={12} rx={1.5} fill="#10b981" />
    <rect x={17.5} y={9} width={3.5} height={15} rx={1.5} fill="#34d399" />
    <rect x={23} y={14.5} width={3.5} height={9.5} rx={1.5} fill="#6ee7b7" />
    <path
      d="M9.5 24.5C11.1 19.5 19 14.5 24 14.5"
      stroke="#10b981"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

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
  const { today, chart, loading } = useDailyViews();
  
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
        <TallSalesIcon />
      </header>
      <div>
        <p className="card-subtitle" style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
          Bugun
        </p>
        <div className="card-metric">
          <h2>
            {loading ? (
              <span>Loading...</span>
            ) : (
              <AnimatedNumber value={today} />
            )}
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
      <MiniBarChart chartData={chart} animate={animate} delay={delay} />
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

