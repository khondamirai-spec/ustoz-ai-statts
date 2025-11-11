"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface CourseCardProps {
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

export function CourseCard({
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
  // Generate random numbers if not provided (stable per card instance)
  const randomUsers = useMemo(() => users ?? Math.floor(Math.random() * 5000) + 1000, [users]);
  const randomViews = useMemo(() => views ?? Math.floor(Math.random() * 10000) + 5000, [views]);
  const randomCertificates = useMemo(() => certificates ?? Math.floor(Math.random() * 500) + 100, [certificates]);
  const randomPortfolio = useMemo(() => portfolio ?? Math.floor(Math.random() * 200) + 50, [portfolio]);
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

