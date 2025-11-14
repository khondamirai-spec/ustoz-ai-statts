"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { useMainStats } from "@/hooks/useMainStats";

const CertificatesIcon = () => (
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
      fill="rgba(34, 197, 94, 0.12)"
      stroke="rgba(34, 197, 94, 0.32)"
      strokeWidth={1.5}
    />
    <path
      d="M12 14L18 10L24 14V22C24 23.1 23.1 24 22 24H14C12.9 24 12 23.1 12 22V14Z"
      stroke="#22c55e"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="rgba(34, 197, 94, 0.08)"
    />
    <path
      d="M16 18L18 20L20 18"
      stroke="#22c55e"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx={18} cy={19} r={1} fill="#22c55e" />
  </motion.svg>
);

interface CertificatesCardProps {
  title?: string;
  animate?: boolean;
  delay?: number;
}

export function CertificatesCard({
  title = "Sertifikat olganlar soni",
  animate = true,
  delay = 0,
}: CertificatesCardProps) {
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
        <CertificatesIcon />
      </header>
      <div className="card-metric">
        <h2>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <AnimatedNumber value={data?.certificates || 0} />
          )}
        </h2>
      </div>
    </motion.div>
  );
}




