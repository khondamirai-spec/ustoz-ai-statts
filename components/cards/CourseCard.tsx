"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface CourseCardProps {
  id?: number | string;
  image: string;
  title: string;
  progress?: number;
  totalMinutes?: number;
  currentMinutes?: number;
  instructorName?: string;
  instructorAvatar?: string;
  buttonText?: string;
  users?: number;
  views?: number;
  certificates?: number;
  portfolio?: number;
  animate?: boolean;
  delay?: number;
  className?: string;
}

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getDeterministicValue = (seed: string, min: number, max: number) => {
  const range = max - min;
  if (range <= 0) return min;
  const hash = hashString(seed);
  return min + (hash % (range + 1));
};

export function CourseCard({
  id,
  image,
  title,
  progress = 12,
  totalMinutes = 46,
  currentMinutes = 12,
  instructorName = "Nodir Nizomov",
  instructorAvatar,
  buttonText = "Kursni davom ettirish",
  users,
  views,
  certificates,
  portfolio,
  animate = true,
  delay = 0,
  className = "",
}: CourseCardProps) {
  const seedKey = useMemo(() => String(id ?? title), [id, title]);

  const randomUsers = useMemo(
    () => users ?? getDeterministicValue(`${seedKey}-users`, 1200, 6200),
    [users, seedKey]
  );
  const randomViews = useMemo(
    () => views ?? getDeterministicValue(`${seedKey}-views`, 7500, 17500),
    [views, seedKey]
  );
  const randomCertificates = useMemo(
    () => certificates ?? getDeterministicValue(`${seedKey}-certificates`, 150, 650),
    [certificates, seedKey]
  );
  const randomPortfolio = useMemo(
    () => portfolio ?? getDeterministicValue(`${seedKey}-portfolio`, 70, 270),
    [portfolio, seedKey]
  );
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
      className={`course-card ${className}`.trim()}
      variants={animate ? { ...cardVariants, ...(hoverVariants || {}) } : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "visible" : undefined}
      whileHover={animate ? "hover" : undefined}
    >
      {/* Top Section - Image with Overlay */}
      <div className="course-card-header">
        <img 
          src={image} 
          alt={title} 
          className="course-card-image"
        />
        <div className="course-card-overlay">
          <h2 className="course-card-title-overlay">{title}</h2>
        </div>
      </div>

      {/* Bottom Section - Course Details */}
      <div className="course-card-content">
        <div className="course-card-progress">
          <span className="course-card-progress-icon">▶</span>
          <span className="course-card-progress-text">
            {currentMinutes} <span className="course-card-progress-separator">•</span> 
            <span className="course-card-progress-icon-small">🕐</span> {totalMinutes} daqiqa
          </span>
        </div>

        <div className="course-card-instructor">
          {instructorAvatar && (
            <img 
              src={instructorAvatar} 
              alt={instructorName}
              className="course-card-instructor-avatar"
            />
          )}
          <span className="course-card-instructor-name">Ustoz: {instructorName}</span>
        </div>

        <div className="course-card-stats">
          <div className="course-card-stat-item">
            <span className="course-card-stat-label">Foydalanuvchilar:</span>
            <span className="course-card-stat-value">{randomUsers.toLocaleString()}</span>
          </div>
          <div className="course-card-stat-item">
            <span className="course-card-stat-label">Ko'rishlar:</span>
            <span className="course-card-stat-value">{randomViews.toLocaleString()}</span>
          </div>
          <div className="course-card-stat-item">
            <span className="course-card-stat-label">Sertifikatlar:</span>
            <span className="course-card-stat-value">{randomCertificates.toLocaleString()}</span>
          </div>
          <div className="course-card-stat-item">
            <span className="course-card-stat-label">Portfolio:</span>
            <span className="course-card-stat-value">{randomPortfolio.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

