"use client";

import { motion } from "framer-motion";
import { useVideoViewsListData } from "@/hooks/useVideoViewsListData";

interface VideoViewsListProps {
  animate?: boolean;
  delay?: number;
}

export function VideoViewsList({ animate = true, delay = 0 }: VideoViewsListProps) {
  const viewsData = useVideoViewsListData();

  if (!viewsData || viewsData.length === 0) {
    return <div className="city-list">No data available</div>;
  }

  return (
    <div className="city-list">
      {viewsData.map((item, index) => (
        <motion.div
          key={item.label}
          className="city-row"
          initial={animate ? { opacity: 0, x: 16 } : undefined}
          animate={animate ? { opacity: 1, x: 0 } : undefined}
          transition={{
            duration: 0.6,
            delay: delay * 0.08 + index * 0.18,
            ease: "easeOut",
          }}
        >
          <strong>{item.label}</strong>
          <div>
            <span>{item.value}</span>
            <motion.em
              initial={false}
              animate={
                animate
                  ? {
                      opacity: [0, 1, 0],
                      x: [0, -4, 0],
                      transition: {
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3,
                      },
                    }
                  : undefined
              }
            >
              {item.delta}
            </motion.em>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

