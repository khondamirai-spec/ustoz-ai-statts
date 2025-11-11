"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import type { SalesReportData } from "@/hooks/useSalesReportData";

const SalesReportIcon = () => (
  <motion.svg
    className="card-header-icon"
    width={36}
    height={36}
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
    focusable="false"
    whileHover={{ scale: 1.08, rotate: -2 }}
    transition={{ duration: 0.22 }}
  >
    <rect
      x={3}
      y={3}
      width={30}
      height={30}
      rx={12}
      fill="rgba(99, 102, 241, 0.12)"
      stroke="rgba(99, 102, 241, 0.35)"
      strokeWidth={1.5}
    />
    <path
      d="M12 10H23C23.5523 10 24 10.4477 24 11V25C24 25.5523 23.5523 26 23 26H12C11.4477 26 11 25.5523 11 25V11C11 10.4477 11.4477 10 12 10Z"
      stroke="#6366f1"
      strokeWidth={1.6}
      strokeLinejoin="round"
      fill="rgba(99, 102, 241, 0.18)"
    />
    <path
      d="M14 18.5L16.5 15.5L19 19.2L21.5 16"
      stroke="#a5b4fc"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1={14}
      y1={21.5}
      x2={21}
      y2={21.5}
      stroke="#c7d2fe"
      strokeWidth={1.4}
      strokeLinecap="round"
    />
  </motion.svg>
);

interface SalesReportCardProps {
  data: SalesReportData;
  title?: string;
  variant?: "default" | "gauge" | "mini-bars" | "line" | "heat";
  children?: React.ReactNode;
  animate?: boolean;
  delay?: number;
  className?: string;
  image?: string;
}

export function SalesReportCard({
  data,
  title = "Sales Report",
  variant = "default",
  children,
  animate = true,
  delay = 0,
  className = "",
  image,
}: SalesReportCardProps) {
  const safeData = {
    value: data?.value ?? 0,
    change: data?.change ?? 0,
    avgScore: data?.avgScore ?? 0,
    monthly: data?.monthly,
    yearly: data?.yearly,
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

  const defaultGridClass = variant === "line" || variant === "heat" ? "card-bottom" : "card-top";
  // If className contains a grid class (card-full, card-bottom, etc.), use it instead
  const gridClass = className.includes("card-full") || className.includes("card-bottom") || className.includes("card-top") || className.includes("card-large") || className.includes("card-tall")
    ? ""
    : defaultGridClass;
  
  // Check if this is the empty full-width card (but not if it has an image)
  const isEmptyCard = className.includes("card-full") && variant === "line" && !image;
  
  const hasImage = !!image;
  
  return (
    <motion.div
      className={`card ${gridClass} ${className} ${hasImage ? 'card-with-image' : ''}`.trim()}
      variants={animate ? { ...cardVariants, ...(hoverVariants || {}) } : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "visible" : undefined}
      whileHover={animate ? "hover" : undefined}
    >
      {!isEmptyCard && (
        <>
          {hasImage && (
            <div className="card-image-wrapper">
              <img 
                src={image} 
                alt={title || "Card image"} 
                className="card-image"
              />
            </div>
          )}
          {hasImage && className.includes("card-full") ? (
            // Image-only card: just show the image
            null
          ) : (
            <div className={`card-content ${hasImage ? 'card-content-with-image' : ''}`}>
              <header className="card-header">
                <div>
                  <span className="card-title">{title}</span>
                </div>
                <SalesReportIcon />
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
              {variant !== "default" && variant !== "gauge" && children}
              {variant === "mini-bars" && safeData.monthly && safeData.yearly && (
                <div className="card-footer">
                  <div>
                    <span className="card-title">Monthly</span>
                    <strong> {safeData.monthly.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="card-title">Yearly</span>
                    <strong> {safeData.yearly.toLocaleString()}</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

