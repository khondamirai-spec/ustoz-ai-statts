"use client";

import { motion } from "framer-motion";
import { SalesReportCard } from "./SalesReportCard";
import type { SalesReportData } from "@/hooks/useSalesReportData";

interface GaugeCardProps {
  data: SalesReportData;
  title?: string;
  animate?: boolean;
  delay?: number;
}

export function GaugeCard({ data, title, animate = true, delay = 0 }: GaugeCardProps) {
  return (
    <SalesReportCard 
      data={data} 
      title={title}
      variant="gauge" 
      animate={animate} 
      delay={delay}
    />
  );
}

