"use client";

import { useState } from "react";
import { DashboardGridLayout } from "@/components/layout/DashboardGridLayout";
import { UsersCard } from "@/components/cards/UsersCard";
import { IncomeCard } from "@/components/cards/IncomeCard";
import { WeeklyMonthlyYearlyCard } from "@/components/cards/WeeklyMonthlyYearlyCard";
import { TallSalesCard } from "@/components/cards/TallSalesCard";
import { SimpleStatCard } from "@/components/cards/SimpleStatCard";
import { CourseCardsCarousel } from "@/components/cards/CourseCardsCarousel";
import { RegionsList } from "@/components/cards/RegionsList";
import { RegionPanel } from "@/components/panels/RegionPanel";
import { useIncomeData } from "@/hooks/useIncomeData";
import { useVideoViewsData } from "@/hooks/useVideoViewsData";

// Course data for the carousel
const courses = [
  { id: 1, title: "Mobile Afix Kursi", image: "/images/mobile-afix-thumbnail_1.png" },
  { id: 2, title: "Web Development", image: "/images/mobile-afix-thumbnail_2.png" },
  { id: 3, title: "Data Science", image: "/images/mobile-afix-thumbnail_3.png" },
  { id: 4, title: "UI/UX Design", image: "/images/mobile-afix-thumbnail_4.png" },
  { id: 5, title: "Python Programming", image: "/images/mobile-afix-thumbnail_5.png" },
  { id: 6, title: "JavaScript Mastery", image: "/images/mobile-afix-thumbnail_6.png" },
  { id: 7, title: "React Advanced", image: "/images/mobile-afix-thumbnail_7.png" },
  { id: 8, title: "Node.js Backend", image: "/images/mobile-afix-thumbnail_8.png" },
  { id: 9, title: "Database Design", image: "/images/mobile-afix-thumbnail_9.png" },
  { id: 10, title: "DevOps Basics", image: "/images/mobile-afix-thumbnail_10.png" },
  { id: 11, title: "Cloud Computing", image: "/images/mobile-afix-thumbnail_11.png" },
  { id: 12, title: "Machine Learning", image: "/images/mobile-afix-thumbnail_12.png" },
  { id: 13, title: "Cybersecurity", image: "/images/mobile-afix-thumbnail_13.png" },
  { id: 14, title: "Mobile Development", image: "/images/mobile-afix-thumbnail_14.png" },
  { id: 15, title: "Blockchain Basics", image: "/images/mobile-afix-thumbnail_15.png" },
  { id: 16, title: "AI Fundamentals", image: "/images/mobile-afix-thumbnail_16.png" },
];

export default function DashboardPage() {
  const incomeData = useIncomeData();
  const videoViewsData = useVideoViewsData();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(regionName);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedRegion(null);
  };

  return (
    <>
      <div className="page">
        <DashboardGridLayout>
          {/* Row 1: Top Stats Cards */}
          <UsersCard delay={0} />
          <IncomeCard data={incomeData} delay={1} />
          <SimpleStatCard title="Active Courses" value={156} change={12.5} delay={2} />

          {/* Row 2: Large Chart Card */}
          <WeeklyMonthlyYearlyCard delay={4} />

          {/* Row 3: Sales Report with Gauge */}
          <TallSalesCard data={videoViewsData} delay={7} />

          {/* Row 4: Regions List */}
          <div className="card card-full" data-delay="14">
            <RegionsList onRegionClick={handleRegionClick} />
          </div>

          {/* Row 5: Course Carousel - Full Width */}
          <div className="card card-full" data-delay="16">
            <CourseCardsCarousel courses={courses} />
          </div>
        </DashboardGridLayout>
      </div>

      {/* Region Panel */}
      <RegionPanel
        region={selectedRegion}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </>
  );
}
