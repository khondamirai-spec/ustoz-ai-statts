"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";

interface Region {
  name: string;
  value: number;
  iconColor: string;
  bgColor: string;
  textColor: string;
  gradientFrom: string;
  gradientTo: string;
}

interface RegionsListProps {
  onRegionClick?: (regionName: string, gradientFrom: string, gradientTo: string) => void;
}

export const regions: Region[] = [
  {
    name: "Xorazm viloyati",
    value: 111480,
    iconColor: "bg-purple-500",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    gradientFrom: "#6A5AED",
    gradientTo: "#C053E4",
  },
  {
    name: "Farg'ona viloyati",
    value: 93256,
    iconColor: "bg-orange-500",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    gradientFrom: "#FF6B35",
    gradientTo: "#F7931E",
  },
  {
    name: "Andijon viloyati",
    value: 56695,
    iconColor: "bg-purple-500",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    gradientFrom: "#9158EA",
    gradientTo: "#6A5AED",
  },
  {
    name: "Surxondaryo viloyati",
    value: 51769,
    iconColor: "bg-green-500",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    gradientFrom: "#2ED47A",
    gradientTo: "#10B981",
  },
  {
    name: "Jizzax viloyati",
    value: 36320,
    iconColor: "bg-blue-500",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    gradientFrom: "#3B82F6",
    gradientTo: "#2563EB",
  },
  {
    name: "Namangan viloyati",
    value: 35510,
    iconColor: "bg-indigo-500",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
    gradientFrom: "#6366F1",
    gradientTo: "#4F46E5",
  },
  {
    name: "Buxoro viloyati",
    value: 26851,
    iconColor: "bg-amber-500",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    gradientFrom: "#F59E0B",
    gradientTo: "#D97706",
  },
  {
    name: "Samarqand viloyati",
    value: 24868,
    iconColor: "bg-rose-500",
    bgColor: "bg-rose-100",
    textColor: "text-rose-700",
    gradientFrom: "#F43F5E",
    gradientTo: "#E11D48",
  },
  {
    name: "Toshkent viloyati",
    value: 24003,
    iconColor: "bg-cyan-500",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-700",
    gradientFrom: "#06B6D4",
    gradientTo: "#0891B2",
  },
  {
    name: "Toshkent shahri",
    value: 21105,
    iconColor: "bg-violet-500",
    bgColor: "bg-violet-100",
    textColor: "text-violet-700",
    gradientFrom: "#8B5CF6",
    gradientTo: "#7C3AED",
  },
  {
    name: "Qashqadaryo viloyati",
    value: 19338,
    iconColor: "bg-teal-500",
    bgColor: "bg-teal-100",
    textColor: "text-teal-700",
    gradientFrom: "#14B8A6",
    gradientTo: "#0D9488",
  },
  {
    name: "Qoraqalpog'iston Respublikasi",
    value: 14961,
    iconColor: "bg-lime-500",
    bgColor: "bg-lime-100",
    textColor: "text-lime-700",
    gradientFrom: "#84CC16",
    gradientTo: "#65A30D",
  },
  {
    name: "Navoiy viloyati",
    value: 10339,
    iconColor: "bg-pink-500",
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
    gradientFrom: "#EC4899",
    gradientTo: "#DB2777",
  },
  {
    name: "Sirdaryo viloyati",
    value: 9115,
    iconColor: "bg-emerald-500",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    gradientFrom: "#10B981",
    gradientTo: "#059669",
  },
];

export function RegionsList({ onRegionClick }: RegionsListProps) {
  return (
    <div className="flex flex-col h-full min-h-[420px]">
      {/* Header with animation */}
      <motion.div 
        className="mb-6 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div 
            className="relative p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl opacity-75 blur-sm"></div>
            <svg
              className="relative w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </motion.div>
          <motion.h2 
            className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            O'zbekiston Respublikasi viloyatlari bo'yicha
          </motion.h2>
        </div>
        <motion.p 
          className="text-sm text-slate-600 ml-12 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Barcha mavjud kurslarni ko'rib chiqing va tanlang
        </motion.p>
      </motion.div>

      {/* Regions List with staggered animations */}
      <div className="flex-1">
        <div className="max-h-[360px] overflow-y-auto pr-2 overscroll-contain scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
          <div className="flex flex-col gap-3">
            {regions.map((region, index) => {
              const cardVariants = {
                hidden: { 
                  opacity: 0, 
                  x: -30,
                  scale: 0.9
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.05 + 0.2,
                  },
                },
              };

              const hoverVariants = {
                hover: {
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                },
              };

              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  onClick={() => onRegionClick?.(region.name, region.gradientFrom, region.gradientTo)}
                  className="group relative flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200/80 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer w-full overflow-hidden"
                  style={{
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Animated gradient background on hover */}
                  <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, ${region.gradientFrom}20, ${region.gradientTo}15)`,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Gradient border effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 region-gradient-border"
                    style={{
                      background: `linear-gradient(135deg, ${region.gradientFrom}, ${region.gradientTo})`,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/70 to-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 z-10 flex items-center justify-center gap-2 rounded-xl transition-all duration-300">
                    <span className="text-base font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      More about
                    </span>
                    <motion.svg
                      className="w-5 h-5 text-slate-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{}}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-3 w-full relative z-0">
                    <motion.div 
                      className={`relative w-11 h-11 ${region.iconColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        background: `linear-gradient(135deg, ${region.gradientFrom}, ${region.gradientTo})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm"></div>
                      <motion.svg
                        className="relative w-6 h-6 text-white drop-shadow-sm"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.3, duration: 0.3 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </motion.svg>
                    </motion.div>
                    <motion.span 
                      className="text-base font-semibold text-slate-900 group-hover:text-slate-950 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.4 }}
                    >
                      {region.name}
                    </motion.span>
                  </div>
                  <motion.div 
                    className={`px-3.5 py-2 ${region.bgColor} ${region.textColor} rounded-xl font-bold text-sm flex-shrink-0 relative z-0 shadow-sm`}
                    whileHover={{ scale: 1.08, rotate: 1 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.5 }}
                    style={{
                      background: `linear-gradient(135deg, ${region.gradientFrom}15, ${region.gradientTo}10)`,
                      border: `1px solid ${region.gradientFrom}30`,
                    }}
                  >
                    <AnimatedNumber value={region.value} />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
