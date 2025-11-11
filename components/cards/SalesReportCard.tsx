"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import type { SalesReportData } from "@/hooks/useSalesReportData";

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

