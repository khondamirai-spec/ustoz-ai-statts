"use client";

import { motion } from "framer-motion";
import { useCitySalesData } from "@/hooks/useCitySalesData";

interface CitySalesListProps {
  animate?: boolean;
  delay?: number;
}

export function CitySalesList({ animate = true, delay = 0 }: CitySalesListProps) {
  const cityData = useCitySalesData();

  if (!cityData || cityData.length === 0) {
    return <div className="city-list">No data available</div>;
  }

  return (
    <div className="city-list">
      {cityData.map((city, index) => (
        <motion.div
          key={city.city}
          className="city-row"
          initial={animate ? { opacity: 0, x: 16 } : undefined}
          animate={animate ? { opacity: 1, x: 0 } : undefined}
          transition={{
            duration: 0.6,
            delay: delay * 0.08 + index * 0.18,
            ease: "easeOut",
          }}
        >
          <strong>{city.city}</strong>
          <div>
            <span>{city.value}</span>
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
              {city.delta}
            </motion.em>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

